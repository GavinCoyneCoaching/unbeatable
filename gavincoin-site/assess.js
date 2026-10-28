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
          var item = pair[1][k];
          cell.textContent = item ? item.name + " (" + item.val + ")" : "—";
        }
      });
    }

    function update() {
      var n = answered(), t = total();
      el("a-live-num").innerHTML = (n === 10 ? t : t || "—") + "<span>/100</span>";
      el("a-live-band").textContent = n === 10 ? bandFor(t).name : n + " of 10 areas rated";
      el("a-live-note").textContent = n === 10 ? "Scroll down to finish and see your result" : "Tap a score for each area";
      fillTables();
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
      el("a-err").style.display = "none";

      var t = total(), band = bandFor(t);
      var r = ranked();
      var top = r.slice().sort(function (x, y) { return y.val - x.val; }).slice(0, 3);
      var low = r.slice().sort(function (x, y) { return x.val - y.val; }).slice(0, 3);
      var strengths = top.map(function (x, k) { return { area: x.name, score: x.val, note: el("a-snote" + k).value.trim() }; });
      var builds = low.map(function (x, k) { return { area: x.name, score: x.val, note: el("a-bnote" + k).value.trim() }; });

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
      function rows(items) {
        return items.map(function (x, k) { return "<tr><td>" + (k + 1) + ". " + esc(x.area) + " (" + x.score + ")</td><td>" + (esc(x.note) || "<span class='a-muted'>—</span>") + "</td></tr>"; }).join("");
      }
      var chat = CHAT_URL + encodeURIComponent("Hi Gavin, I just completed the " + A.title + " (" + t + "/100) and I'd like to talk it through.");

      el("a-result").innerHTML =
        '<div class="a-res">' +
        '<div class="a-res-head"><p class="a-res-kicker">' + esc(A.title) + "</p><h2>" + esc(displayName) + "</h2>" +
        '<p class="a-res-date">' + new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) + "</p></div>" +
        '<div class="a-res-score"><div class="a-res-box"><span class="a-res-lbl">' + esc(A.scoreLabel) + '</span><span class="a-res-num">' + t + "<small>/100</small></span></div>" +
        '<div class="a-bands">' + legend + "</div></div>" +
        '<div class="a-res-sec"><h3>Your 10 areas</h3>' + bars + "</div>" +
        '<div class="a-res-sec"><h3>' + esc(A.sec3.title) + '</h3><table class="a-tbl"><tr><th>' + esc(A.sec3.c1) + "</th><th>" + esc(A.sec3.c2) + "</th></tr>" + rows(strengths) + "</table></div>" +
        '<div class="a-res-sec"><h3>' + esc(A.sec4.title) + '</h3><table class="a-tbl"><tr><th>' + esc(A.sec4.c1) + "</th><th>" + esc(A.sec4.c2) + "</th></tr>" + rows(builds) + "</table></div>" +
        '<div class="a-next"><h3>Your next step</h3><p>' + esc(A.nextText) + '</p><div class="a-next-btns">' +
        '<a class="btn btn-primary" href="' + chat + '" target="_blank" rel="noopener">Talk it through with Gavin</a>' +
        (A.nextLink ? '<a class="btn btn-ghost-light" href="' + A.nextLink.href + '">' + esc(A.nextLink.label) + "</a>" : "") +
        '</div><p class="a-sent" id="' + key + '-a-sent">Sending your results…</p></div>' +
        "</div>";
      el("a-result").hidden = false;
      el("a-result").scrollIntoView({ behavior: "smooth", block: "start" });

      /* Send */
      var payload = {
        assessment: A.title, total: t, band: band.name, email: email, phone: phone,
        respondent: who, scores: A.areas.map(function (a, i) { return { area: a.name, score: vals[i] }; }),
        strengths: strengths, builds: builds,
        sec3: A.sec3, sec4: A.sec4, scoreLabel: A.scoreLabel, bandText: band.text,
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
