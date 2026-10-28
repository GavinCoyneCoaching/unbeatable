/* Unbeatable assessments engine (Set A V4).
   assessments.html sets window.ASSESSMENTS = {player:{...}, coach:{...}, club:{...}};
   each section (#player, #coach, #club) has its own form, element ids prefixed "<key>-".
   On submit it shows the result, then sends the answers to:
     - Google Apps Script (APPS_SCRIPT_URL) -> logs to Google Sheet, emails Gavin
       AND emails the respondent their results; or, until that URL is set,
     - FormSubmit -> emails Gavin only.
*/
(function () {
  // Paste the Apps Script "Web app" URL here once it's deployed (see apps-script/README.md).
  var APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzHgrZ6Uti-N48SkDNsXfDPqzdElBv7BVOcIoNkvcKLebFaBVTww_xmKW2t0UWmNM3H/exec";
  var FORMSUBMIT_URL = "https://formsubmit.co/ajax/gavincoynecoaching@gmail.com";
  var CHAT_URL = "https://wa.me/353858682933?text=";

  /* ---- Kit bag: which Unbeatable tools help which areas ----
     After the score, the lowest-rated areas point to 2-3 recommended tools.
     First tool listed for an area is the main fit (full weight), second is supporting. */
  var TOOLS = {
    "Mirrors & Windows": "For players who worry about the opposition, complain to the referee or compare themselves to others. It brings attention back to what they can actually control.",
    "The Jar": "For players who seem scattered or overloaded, or never quite where they're supposed to be. It decides what deserves their attention right now — and what doesn't.",
    "Communication": "For a group that's never on the same page. Clearer calls, better listening and one shared language between players and coaches.",
    "Frustration vs Fascination": "For heads that drop after one mistake. It turns the setback into curiosity and the next useful action, instead of the next mistake.",
    "Beyond the Scoreboard": "For players who only feel good when they win. It measures the behaviours that create results — Communication, Attitude, Resilience, Effort.",
    "The Stairs": "For players who feel they're not getting any better. It breaks big goals into the next small, doable step.",
    "Paying the Price": "For when they want it, but the work isn't happening. Habits, effort and the choices that build them.",
    "5·5·5": "For when everyone waits for someone else to make it happen. Every player finds another way to help — stop asking \"how good am I?\", start asking \"how can I help?\""
  };
  var AREA_TOOLS = {
    "Focus & Attention": ["Mirrors & Windows", "The Jar"],
    "Communication": ["Communication"],
    "Communication Across Panels": ["Communication"],
    "Response to Mistakes": ["Frustration vs Fascination"],
    "Accountability": ["Mirrors & Windows", "Paying the Price"],
    "Preparation & Habits": ["The Jar", "Paying the Price"],
    "Preparation & Standards": ["The Jar", "Paying the Price"],
    "Standards & Preparation": ["The Jar", "Paying the Price"],
    "Discipline": ["Paying the Price", "The Jar"],
    "Commitment": ["Paying the Price", "The Stairs"],
    "Effort & Work Rate": ["Paying the Price", "Beyond the Scoreboard"],
    "Confidence & Composure": ["Frustration vs Fascination", "Beyond the Scoreboard"],
    "Leadership": ["Communication", "5·5·5"],
    "Team Contribution": ["5·5·5"],
    "Contribution": ["5·5·5"],
    "Support & Trust": ["Communication", "5·5·5"],
    "Coachability & Improvement": ["The Stairs", "Frustration vs Fascination"],
    "Player Engagement": ["Beyond the Scoreboard", "5·5·5"],
    "Coach Reinforcement": ["Communication"],
    "Shared Language": ["Communication"],
    "Development Follow-Through": ["The Stairs", "Beyond the Scoreboard"]
  };
  function recommendTools(scored) {
    var score = {}, why = {};
    scored.forEach(function (a) {
      var need = 10 - a.val;              // lower rating = bigger need
      if (need <= 2) return;               // 8+ is already a strength
      (AREA_TOOLS[a.name] || []).forEach(function (tool, i) {
        score[tool] = (score[tool] || 0) + need * (i === 0 ? 1 : 0.6);
        (why[tool] = why[tool] || []).push(a);
      });
    });
    return Object.keys(score).sort(function (x, y) { return score[y] - score[x]; }).slice(0, 3).map(function (tool) {
      var areas = why[tool].sort(function (x, y) { return x.val - y.val; }).slice(0, 2);
      return { tool: tool, text: TOOLS[tool], areas: areas };
    });
  }

  function run(key, A) {
    var root = document.getElementById(key);
    var vals = A.areas.map(function () { return 0; });

    function el(id) { return document.getElementById(key + "-" + id); }
    function esc(s) { return String(s || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
    function bandFor(t) { for (var i = 0; i < A.bands.length; i++) { if (t >= A.bands[i].min) return A.bands[i]; } return A.bands[A.bands.length - 1]; }
    function answered() { return vals.filter(function (v) { return v > 0; }).length; }
    function total() { return vals.reduce(function (s, v) { return s + v; }, 0); }

    /* ---- Render the 10 areas ---- */
    var list = el("a-areas");
    A.areas.forEach(function (a, i) {
      var row = document.createElement("div");
      row.className = "a-area";
      var btns = "";
      for (var n = 1; n <= 10; n++) {
        btns += '<button type="button" class="a-pick" data-i="' + i + '" data-v="' + n + '" aria-label="' + esc(a.name) + ': ' + n + '">' + n + "</button>";
      }
      row.innerHTML =
        '<div class="a-area-txt"><div class="a-area-name"><span class="a-num">' + (i + 1 < 10 ? "0" : "") + (i + 1) + "</span>" + esc(a.name) + "</div>" +
        '<p class="a-area-q">' + esc(a.q) + "</p></div>" +
        '<div class="a-picks" role="group" aria-label="' + esc(a.name) + '">' + btns + "</div>";
      list.appendChild(row);
    });

    list.addEventListener("click", function (e) {
      var b = e.target.closest(".a-pick");
      if (!b) return;
      var i = +b.dataset.i, v = +b.dataset.v;
      vals[i] = v;
      var group = b.parentNode.querySelectorAll(".a-pick");
      for (var k = 0; k < group.length; k++) group[k].classList.toggle("on", +group[k].dataset.v === v);
      b.closest(".a-area").classList.add("done");
      update();
    });

    /* ---- Live score bar + auto-filled strengths / build areas ---- */
    function ranked() { return A.areas.map(function (a, i) { return { name: a.name, val: vals[i] }; }).filter(function (x) { return x.val > 0; }); }

    function fillTables() {
      var r = ranked();
      var top = r.slice().sort(function (x, y) { return y.val - x.val; }).slice(0, 3);
      var low = r.slice().sort(function (x, y) { return x.val - y.val; }).slice(0, 3);
      [["s", top], ["b", low]].forEach(function (pair) {
        for (var k = 0; k < 3; k++) {
          var cell = el("a-" + pair[0] + "area" + k);
          if (!cell) continue;
          var item = pair[1][k];
          cell.textContent = item ? item.name + " (" + item.val + ")" : "—";
        }
      });
    }

    function update() {
      var n = answered(), t = total();
      el("a-live-num").innerHTML = (n === 10 ? t : t || "—") + "<span>/100</span>";
      el("a-live-band").textContent = n === 10 ? bandFor(t).name : n + " of 10 areas rated";
      el("a-live-note").textContent = n === 10 ? "Scroll down and tap \"Show my result\"" : "Tap a score for each area";
    }
    update();

    /* ---- Submit ---- */
    function showErr(msg) { var e = el("a-err"); e.textContent = msg; e.style.display = "block"; }

    el("a-submit").addEventListener("click", function () {
      if (answered() < 10) {
        showErr("Please rate all 10 areas first — " + (10 - answered()) + " still to go.");
        var first = root.querySelector(".a-area:not(.done)");
        if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      var email = el("a-email").value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showErr("Please add your email in the details at the top so we can send your results."); el("a-email").focus(); return; }
      var phoneEl = el("a-phone");
      if (phoneEl && phoneEl.hasAttribute("required") && phoneEl.value.replace(/[^0-9]/g, "").length < 7) {
        showErr("Please add a mobile number in the details at the top so Gavin can follow up with you.");
        phoneEl.focus(); return;
      }
      el("a-err").style.display = "none";

      var t = total(), band = bandFor(t);
      var r = ranked();
      var top = r.slice().sort(function (x, y) { return y.val - x.val; }).slice(0, 3);
      var low = r.slice().sort(function (x, y) { return x.val - y.val; }).slice(0, 3);
      var strengths = top.map(function (x, k) { return { area: x.name, score: x.val, note: "" }; });
      var builds = low.map(function (x, k) { return { area: x.name, score: x.val, note: "" }; });

      var who = {};
      A.fields.forEach(function (f) { who[f.label] = el("a-f-" + f.id).value.trim(); });
      var phone = el("a-phone").value.trim();
      var displayName = who[A.fields[0].label] || A.short;

      /* Result card */
      var bars = A.areas.map(function (a, i) {
        var v = vals[i], c = v >= 8 ? "var(--a-strong)" : v >= 6 ? "var(--a-good)" : v >= 4 ? "var(--a-mid)" : "var(--a-low)";
        return '<div class="a-bar"><span class="a-bar-l">' + esc(a.name) + '</span><span class="a-bar-t"><span style="width:' + v * 10 + "%;background:" + c + '"></span></span><span class="a-bar-v">' + v + "</span></div>";
      }).join("");
      var legend = A.bands.map(function (b) {
        return '<div class="a-band' + (b === band ? " on" : "") + '"><b>' + b.range + ": " + esc(b.name) + "</b><span>" + esc(b.text) + "</span></div>";
      }).join("");
      function areaList(items, withTool) {
        return '<ul class="a-arealist">' + items.map(function (x) {
          var tool = withTool && AREA_TOOLS[x.area] ? AREA_TOOLS[x.area][0] : "";
          return '<li><span class="a-al-name">' + esc(x.area) + '</span><span class="a-al-score">' + x.score + "/10</span>" +
            (tool ? '<span class="a-al-tool">Tool: ' + esc(tool) + "</span>" : "") + "</li>";
        }).join("") + "</ul>";
      }
      function rows(items) {
        return items.map(function (x, k) { return "<tr><td>" + (k + 1) + ". " + esc(x.area) + " (" + x.score + ")</td><td>" + (esc(x.note) || "<span class='a-muted'>—</span>") + "</td></tr>"; }).join("");
      }
      var recs = recommendTools(r);
      var recHtml = recs.length ? '<div class="a-res-sec a-recs"><h3>' + (key === "player" ? "Tools that would help you most" : "Tools your players would benefit from most") + '</h3>' +
        '<p class="a-recs-intro">Based on your lowest-rated areas, these parts of the Unbeatable programme are where we\'d start.</p>' +
        recs.map(function (x) {
          return '<div class="a-rec"><div class="a-rec-name">' + esc(x.tool) + '</div><p>' + esc(x.text) + '</p>' +
            '<p class="a-rec-why">Because: ' + x.areas.map(function (a) { return esc(a.name) + " (" + a.val + "/10)"; }).join(", ") + '</p></div>';
        }).join("") + '</div>' : "";
      var chat = CHAT_URL + encodeURIComponent("Hi Gavin, I just completed the " + A.title + " (" + t + "/100) and I'd like to talk it through.");

      el("a-result").innerHTML =
        '<div class="a-res">' +
        '<div class="a-res-head"><p class="a-res-kicker">' + esc(A.title) + "</p><h2>" + esc(displayName) + "</h2>" +
        '<p class="a-res-date">' + new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) + "</p></div>" +
        '<div class="a-res-score"><div class="a-res-box"><span class="a-res-lbl">' + esc(A.scoreLabel) + '</span><span class="a-res-num">' + t + "<small>/100</small></span></div>" +
        '<div class="a-bands">' + legend + "</div></div>" +
        '<div class="a-res-sec"><h3>Your 10 areas</h3>' + bars + "</div>" +
        '<div class="a-res-sec"><h3>' + esc(A.sec3.title) + '</h3><p class="a-recs-intro">Your three highest-rated areas &mdash; the strengths to protect and build from.</p>' + areaList(strengths, false) + "</div>" +
        '<div class="a-res-sec"><h3>' + esc(A.sec4.title) + '</h3><p class="a-recs-intro">Your three lowest-rated areas, and the Unbeatable tool that targets each one.</p>' + areaList(builds, true) + "</div>" +
        recHtml +
        '<div class="a-next"><h3>Your next step</h3><p>' + esc(A.nextText) + '</p><div class="a-next-btns">' +
        '<a class="btn btn-primary" href="' + chat + '" target="_blank" rel="noopener">Talk it through with Gavin</a>' +
        (A.nextLink ? '<a class="btn btn-ghost-light" href="' + A.nextLink.href + '">' + esc(A.nextLink.label) + "</a>" : "") +
        '</div><p class="a-sent" id="' + key + '-a-sent">Sending your results…</p></div>' +
        "</div>";
      el("a-result").hidden = false;
      var liveBar = root && root.querySelector(".a-live");
      if (liveBar) liveBar.style.display = "none";
      el("a-result").scrollIntoView({ behavior: "smooth", block: "start" });

      /* Send */
      var payload = {
        assessment: A.title, total: t, band: band.name, email: email, phone: phone,
        respondent: who, scores: A.areas.map(function (a, i) { return { area: a.name, score: vals[i] }; }),
        strengths: strengths, builds: builds,
        sec3: A.sec3, sec4: A.sec4, scoreLabel: A.scoreLabel, bandText: band.text,
        recommendedTools: recs.map(function (x) { return x.tool; }).join(", "),
        page: location.href
      };
      var sent = el("a-sent");
      var ok = "Done — " + (APPS_SCRIPT_URL ? "a copy of your results is on its way to " + email + ", and " : "") + "Gavin has your results and will be in touch.";
      var fail = "Your results are above. If you'd like to talk them through, tap the button.";

      if (APPS_SCRIPT_URL) {
        fetch(APPS_SCRIPT_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) })
          .then(function () { sent.textContent = ok; }).catch(function () { sent.textContent = fail; });
      } else {
        var flat = {
          _subject: "New " + A.title + ": " + displayName + " (" + t + "/100)", _template: "table", _captcha: "false",
          _autoresponse: "Thanks for completing the Unbeatable " + A.title + ". Gavin reads every one personally and will be in touch about your results. — Gavin Coyne Coaching · 085 868 2933",
          assessment: A.title, total_score: t + "/100", band: band.name, email: email, phone: phone || "(not given)"
        };
        Object.keys(who).forEach(function (k) { flat[k] = who[k] || "(not given)"; });
        payload.scores.forEach(function (s) { flat[s.area] = s.score + "/10"; });
        strengths.forEach(function (s, k) { flat["Strength " + (k + 1)] = s.area + " — " + (s.note || "(no note)"); });
        builds.forEach(function (s, k) { flat["Build " + (k + 1)] = s.area + " — " + (s.note || "(no note)"); });
        fetch(FORMSUBMIT_URL, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(flat) })
          .then(function (r) { sent.textContent = r.ok ? ok : fail; }).catch(function () { sent.textContent = fail; });
      }
    });
  }

  var all = window.ASSESSMENTS || {};
  Object.keys(all).forEach(function (k) { if (document.getElementById(k)) run(k, all[k]); });
})();
