# KidsBrain — Orders backend & admin setup

This connects the parent questionnaire to a free Google Sheets "database" and a
secret admin page. No server required.

```
questionnaire.html  --POST-->  Google Apps Script  --writes-->  Google Sheet
                                                    <--reads---  admin-panel.html
```

## 1. Create the spreadsheet
1. Go to https://sheets.google.com and create a new sheet named **KidsBrain Orders**.
2. Note the tab name at the bottom (usually `Sheet1`).

## 2. Add the Apps Script
1. In the sheet: **Extensions → Apps Script**.
2. Delete any boilerplate, then paste the entire contents of **`google-apps-script.gs`**.
3. If your tab isn't named `Sheet1`, change `SHEET_NAME` at the top.
4. Save. (Optional) run the `setupHeaders` function once to write the header row
   automatically — or paste these 20 headers into row 1 yourself:

   `Timestamp | Child Name | Age | Gender | Interests | TV Shows | YouTube Channels | Content Type | Brain Focus Primary | Brain Focus Secondary | Parent Hopes | Child Struggles | Screen Time Limit | Content To Avoid | Special Notes | Parent Name | Email | Phone | Contact Method | Status`

## 3. Deploy as a Web App
1. **Deploy → New deployment**.
2. Type: **Web app**.
3. Execute as: **Me**.
4. Who has access: **Anyone**.
5. **Deploy**, authorize when prompted, and copy the **Web App URL**
   (looks like `https://script.google.com/macros/s/AKfycbx.../exec`).

## 4. Wire the URL into the site
Open **both** files and replace the placeholder near the top of the `<script>`:

```js
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```

- `questionnaire.html` — sends each submission to the sheet.
- `admin-panel.html` — reads all submissions.

> Re-deploying the script can change the URL. If orders stop saving, re-copy the
> current Web App URL into both files. (Use **Manage deployments** and edit the
> existing deployment to keep the same URL.)

## 5. Deploy the site & test
1. Commit and deploy (e.g. Netlify).
2. Fill out the questionnaire and hit **Submit** → a new row should appear in the sheet.
3. Open `admin-panel.html` directly → the order should show up.

## Admin page notes
- It's intentionally **not linked** anywhere — reach it only by direct URL,
  e.g. `https://YOUR-SITE.netlify.app/admin-panel.html`. It also sends
  `noindex, nofollow`. This is light obscurity, **not real security** — anyone
  with the link (or the public Apps Script URL) can read orders. For real
  protection, add auth or move to a private backend.
- Status buttons (New → In Progress → Done) save **in your browser** for quick
  triage. To change status permanently, edit the **Status** column in the sheet.
