import { google } from 'googleapis';
import logger from '../utils/logger.js';
import env from '../config/env.js';

let sheetsClient = null;
let authInitialized = false;

/**
 * Lazily initializes the Google Sheets API client using service account credentials.
 * Returns null if credentials are not configured.
 */
function getClient() {
  if (authInitialized) return sheetsClient;
  authInitialized = true;

  const { GOOGLE_SHEETS_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY } = env;

  if (!GOOGLE_SHEETS_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    logger.warn('Google Sheets credentials not fully configured. Sheet logging disabled.');
    return null;
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    sheetsClient = google.sheets({ version: 'v4', auth });
    logger.info('Google Sheets client initialized successfully.');
    return sheetsClient;
  } catch (err) {
    logger.error(`Failed to initialize Google Sheets client: ${err.message}`);
    return null;
  }
}

/**
 * Appends a single row to the configured Google Sheet.
 * Never throws -- all errors are caught and logged.
 *
 * @param {object} rowData - Object with column values
 * @returns {Promise<boolean>} true if appended successfully
 */
export async function appendResponseRow(rowData) {
  const client = getClient();
  if (!client) return false;

  const row = [
    rowData.sessionId,
    rowData.timestamp,
    rowData.userAgeSlab,
    rowData.userGender,
    rowData.section,
    rowData.questionType,
    rowData.questionId,
    rowData.questionTextEn,
    rowData.criteria,
    rowData.userAnswer,
    rowData.selectedOptionText,
    rowData.timeTakenSec,
    rowData.language,
    rowData.questionWeight,
  ];

  try {
    await client.spreadsheets.values.append({
      spreadsheetId: env.GOOGLE_SHEETS_ID,
      range: 'Sheet1!A:N',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [row],
      },
    });
    return true;
  } catch (err) {
    logger.error(`Google Sheets append failed: ${err.message}`);
    return false;
  }
}

/**
 * Checks whether the Google Sheets integration is configured.
 */
export function isSheetsEnabled() {
  const { GOOGLE_SHEETS_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY } = env;
  return !!(GOOGLE_SHEETS_ID && GOOGLE_SERVICE_ACCOUNT_EMAIL && GOOGLE_PRIVATE_KEY);
}
