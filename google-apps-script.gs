/**
 * KidsBrain — Google Apps Script backend for questionnaire orders.
 *
 * Paste this into Extensions -> Apps Script inside your "KidsBrain Orders"
 * spreadsheet, then Deploy -> New deployment -> Web app
 * (Execute as: Me, Who has access: Anyone). Copy the Web App URL and put it
 * in GOOGLE_SCRIPT_URL at the top of both questionnaire.html and
 * admin-panel.html. Full steps are in SETUP.md.
 */

const SHEET_NAME = 'Sheet1'; // change if your sheet tab has a different name

const HEADERS = [
  'Timestamp', 'Child Name', 'Age', 'Gender', 'Interests', 'TV Shows',
  'YouTube Channels', 'Content Type', 'Brain Focus Primary',
  'Brain Focus Secondary', 'Parent Hopes', 'Child Struggles',
  'Screen Time Limit', 'Content To Avoid', 'Special Notes', 'Parent Name',
  'Email', 'Phone', 'Contact Method', 'Status'
];

// Optional: run this once from the editor to write the bold header row.
function setupHeaders() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = JSON.parse(e.postData.contents);

    const row = [
      new Date().toISOString(),            // Timestamp
      data.childName || '',                // Child Name
      data.age || '',                      // Age
      data.gender || '',                   // Gender
      (data.interests || []).join(', '),   // Interests
      data.tvShows || '',                  // TV Shows
      data.youtubeChannels || '',          // YouTube Channels
      (data.contentType || []).join(', '), // Content Type
      data.brainFocusPrimary || '',        // Brain Focus Primary
      data.brainFocusSecondary || '',      // Brain Focus Secondary
      data.parentHopes || '',              // Parent Hopes
      data.childStruggles || '',           // Child Struggles
      data.screenTimeLimit || '',          // Screen Time Limit
      (data.contentToAvoid || []).join(', '), // Content To Avoid
      data.specialNotes || '',             // Special Notes
      data.parentName || '',               // Parent Name
      data.email || '',                    // Email
      data.phone || '',                    // Phone
      data.contactMethod || '',            // Contact Method
      'New'                                // Status (default)
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Saved!' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const rows = data.slice(1).map(function (row) {
    const obj = {};
    headers.forEach(function (h, i) { obj[h] = row[i]; });
    return obj;
  });

  return ContentService
    .createTextOutput(JSON.stringify({ success: true, data: rows }))
    .setMimeType(ContentService.MimeType.JSON);
}
