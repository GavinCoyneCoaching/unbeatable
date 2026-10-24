/**
 * Unbeatable assessments — Google Sheets + email back end.
 *
 * Paste this whole file into Extensions → Apps Script of the Google Sheet
 * "Unbeatable Assessments", then Deploy → New deployment → Web app
 * (Execute as: Me · Who has access: Anyone). Copy the Web app URL into
 * APPS_SCRIPT_URL at the top of gavincoin-site/assess.js.
 *
 * Every submission:
 *   1. adds a row to the tab for that assessment (Player / Team / Club Assessment),
 *   2. emails Gavin a summary,
 *   3. emails the respondent their results.
 */

var OWNER_EMAIL = 'gavincoynecoaching@gmail.com';
var FROM_NAME = 'Gavin Coyne Coaching';
var REPLY_LINE = 'Reply to this email or WhatsApp Gavin on 085 868 2933 to talk your results through.';

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    logToSheet_(d);
    emailOwner_(d);
    emailRespondent_(d);
    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: String(err) });
  }
}

/* ---------- Sheet ---------- */
function logToSheet_(d) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var tabName = String(d.assessment || 'Assessment').slice(0, 90);
  var sh = ss.getSheetByName(tabName) || ss.insertSheet(tabName);

  var respondentKeys = Object.keys(d.respondent || {});
  var areaNames = (d.scores || []).map(function (s) { return s.area; });
  var header = ['Submitted', 'Total /100', 'Band', 'Email', 'Phone']
    .concat(respondentKeys)
    .concat(areaNames)
    .concat(['Strength 1', 'Strength 1 note', 'Strength 2', 'Strength 2 note', 'Strength 3', 'Strength 3 note',
             'Build 1', 'Build 1 note', 'Build 2', 'Build 2 note', 'Build 3', 'Build 3 note', 'Follow-up done?']);

  if (sh.getLastRow() === 0) {
    sh.appendRow(header);
    sh.getRange(1, 1, 1, header.length).setFontWeight('bold').setBackground('#14304A').setFontColor('#ffffff');
    sh.setFrozenRows(1);
  }

  var row = [new Date(), d.total, d.band, d.email, d.phone || '']
    .concat(respondentKeys.map(function (k) { return d.respondent[k] || ''; }))
    .concat((d.scores || []).map(function (s) { return s.score; }));
  [d.strengths || [], d.builds || []].forEach(function (list) {
    for (var i = 0; i < 3; i++) {
      var x = list[i] || {};
      row.push(x.area ? x.area + ' (' + x.score + ')' : '', x.note || '');
    }
  });
  row.push('');
  sh.appendRow(row);
}

/* ---------- Emails ---------- */
function resultsHtml_(d, forOwner) {
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); };
  var bars = (d.scores || []).map(function (s) {
    return '<tr><td style="padding:4px 10px 4px 0;color:#14304A">' + esc(s.area) + '</td><td style="padding:4px 0;font-weight:bold;color:#14304A">' + s.score + '/10</td></tr>';
  }).join('');
  function list(title, c2, items) {
    return '<h3 style="color:#14304A;margin:22px 0 6px">' + esc(title) + '</h3><table style="border-collapse:collapse;width:100%">' +
      items.map(function (x, i) {
        return '<tr><td style="border:1px solid #e2e7ee;padding:8px;width:45%;color:#14304A"><b>' + (i + 1) + '. ' + esc(x.area) + ' (' + x.score + ')</b></td>' +
               '<td style="border:1px solid #e2e7ee;padding:8px;color:#374b5e">' + (esc(x.note) || '&mdash;') + '</td></tr>';
      }).join('') + '</table>';
  }
  var who = Object.keys(d.respondent || {}).map(function (k) {
    return d.respondent[k] ? '<b>' + esc(k) + ':</b> ' + esc(d.respondent[k]) : '';
  }).filter(String).join('<br>');
  return '<div style="font-family:Arial,sans-serif;max-width:620px;color:#1b2a36">' +
    '<div style="background:#14304A;color:#fff;padding:20px;border-top:5px solid #F2C200">' +
      '<div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#5b9bdd">' + esc(d.assessment) + '</div>' +
      '<div style="font-size:30px;font-weight:bold;margin-top:6px">' + d.total + '/100 &middot; ' + esc(d.band) + '</div></div>' +
    '<p style="color:#374b5e">' + esc(d.bandText) + '</p>' +
    (forOwner ? '<p>' + who + '<br><b>Email:</b> ' + esc(d.email) + (d.phone ? '<br><b>Phone:</b> ' + esc(d.phone) : '') + '</p>' : '') +
    '<h3 style="color:#14304A;margin:22px 0 6px">Your 10 areas</h3><table>' + bars + '</table>' +
    list(d.sec3 ? d.sec3.title : 'Strengths', '', d.strengths || []) +
    list(d.sec4 ? d.sec4.title : 'Where to build', '', d.builds || []) +
    (forOwner ? '' : '<p style="margin-top:24px;color:#374b5e">' + REPLY_LINE + '</p><p style="color:#5c6b7a;font-size:12px">Unbeatable by Gavin Coyne Coaching &middot; a practical framework for sport and life. A coaching tool, not a test or diagnosis.</p>') +
    '</div>';
}

function emailOwner_(d) {
  var name = firstValue_(d.respondent) || d.email;
  MailApp.sendEmail({
    to: OWNER_EMAIL,
    replyTo: d.email,
    subject: 'New ' + d.assessment + ': ' + name + ' (' + d.total + '/100)',
    htmlBody: resultsHtml_(d, true),
    name: 'Unbeatable Assessments'
  });
}

function emailRespondent_(d) {
  if (!d.email) return;
  MailApp.sendEmail({
    to: d.email,
    replyTo: OWNER_EMAIL,
    subject: 'Your Unbeatable ' + d.assessment + ' results: ' + d.total + '/100',
    htmlBody: resultsHtml_(d, false),
    name: FROM_NAME
  });
}

/* ---------- helpers ---------- */
function firstValue_(o) { for (var k in (o || {})) { if (o[k]) return o[k]; } return ''; }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

/** Run once from the editor to check the sheet + email permissions work. */
function testSubmission() {
  doPost({ postData: { contents: JSON.stringify({
    assessment: 'Player Assessment', total: 64, band: 'Building Well',
    bandText: 'You have a solid base. Make the stronger behaviours more consistent and strengthen a small number of gaps.',
    email: OWNER_EMAIL, phone: '', respondent: { 'Your name': 'Test Player', 'Age': '15' },
    scores: [{ area: 'Focus & Attention', score: 6 }, { area: 'Communication', score: 7 }],
    strengths: [{ area: 'Communication', score: 7, note: 'test' }], builds: [{ area: 'Focus & Attention', score: 6, note: 'test' }],
    sec3: { title: "What's working?" }, sec4: { title: 'Where can I build?' }
  }) } });
}
