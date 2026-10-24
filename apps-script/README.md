# Unbeatable assessments: Google Sheet setup (about 10 minutes, once)

This connects the three website assessments (Player, Team, Club) to a Google Sheet.
After setup, every submission:

1. adds a row to the Sheet (one tab per assessment),
2. emails Gavin a summary,
3. emails the person their own results.

## Steps (on the desktop, logged into gavincoynecoaching@gmail.com)

1. Go to **sheets.google.com** and create a blank sheet called **Unbeatable Assessments**.
2. In the sheet: **Extensions → Apps Script**.
3. Delete everything in the editor, paste in the whole of `Code.gs` (this folder), click **Save**.
4. Choose **testSubmission** in the function dropdown and click **Run**. Google asks for permission:
   **Review permissions → your account → Advanced → Go to (unsafe) → Allow**. This is normal for your own script.
   You should get a test email and a "Player Assessment" tab with one row. Delete that row afterwards.
5. Click **Deploy → New deployment → ⚙ → Web app**.
   - Description: `Unbeatable assessments`
   - Execute as: **Me**
   - Who has access: **Anyone**
   Click **Deploy** and copy the **Web app URL** (it ends in `/exec`).
6. Send that URL to Claude. It goes into `APPS_SCRIPT_URL` at the top of `gavincoin-site/assess.js`.

## Notes

- Gmail lets a script send roughly 100 emails a day on a free account (each submission sends 2).
- Until the URL is added, the assessments still email Gavin through FormSubmit, but nothing goes to the Sheet
  and respondents don't get their results by email.
- If you change `Code.gs` later: **Deploy → Manage deployments → ✏ Edit → Version: New version → Deploy**
  (keeps the same URL).
- The **Follow-up done?** column is for you to tick off who you've contacted.
