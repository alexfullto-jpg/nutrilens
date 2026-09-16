import { LoggedMeal, UserProfile } from '../types';

declare global {
  interface Window {
    google?: any;
  }
}

export interface SheetsExportData {
  title: string;
  rows: (string | number)[][];
}

/**
 * Prepares the formatted dataset for Google Sheets export
 */
export function prepareSheetsData(meals: LoggedMeal[], profile: UserProfile): SheetsExportData {
  const headers = [
    'Fecha',
    'Hora',
    'Tipo de Comida',
    'Nombre del Plato',
    'Calorías (kcal)',
    'Proteínas (g)',
    'Carbohidratos (g)',
    'Grasas (g)',
    'Método de Registro',
    'Detalle de Ingredientes',
  ];

  const rows: (string | number)[][] = [
    headers,
    ...meals.map((meal) => [
      meal.date,
      meal.time,
      meal.mealType.toUpperCase(),
      meal.title,
      meal.calories,
      meal.proteinG,
      meal.carbsG,
      meal.fatsG,
      meal.loggedVia === 'camera_ai'
        ? 'Reconocimiento Visual IA'
        : meal.loggedVia === 'barcode'
        ? 'Escáner Código de Barras'
        : meal.loggedVia === 'search_db'
        ? 'Base de Datos Nutricional'
        : 'Recomendación Menú IA',
      meal.items.map((it) => `${it.name} (${it.portionGrams}g, ${it.calories}kcal)`).join(' | '),
    ]),
  ];

  return {
    title: `NutriLens - Registro Nutricional (${profile.name})`,
    rows,
  };
}

/**
 * Triggers Google Sheets OAuth Flow using Google Identity Services (GSI)
 */
export async function authenticateGoogleSheets(clientId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!window.google?.accounts?.oauth2) {
      reject(new Error('Google Identity Services script no está cargado'));
      return;
    }

    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/spreadsheets',
        callback: (tokenResponse: any) => {
          if (tokenResponse.error) {
            reject(new Error(tokenResponse.error));
            return;
          }
          resolve(tokenResponse.access_token);
        },
      });

      tokenClient.requestAccessToken({ prompt: 'consent' });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Creates or updates a Google Sheet via Google Sheets REST API v4
 */
export async function exportToGoogleSheetsApi(
  accessToken: string,
  data: SheetsExportData
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  // Step 1: Create a new spreadsheet
  const createResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: data.title,
      },
      sheets: [
        {
          properties: {
            title: 'Registro de Calorías y Macros',
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!createResponse.ok) {
    const errorData = await createResponse.json();
    throw new Error(errorData.error?.message || 'Error creando la hoja de cálculo en Google Drive');
  }

  const spreadsheet = await createResponse.json();
  const spreadsheetId = spreadsheet.spreadsheetId;
  const spreadsheetUrl = spreadsheet.spreadsheetUrl;

  // Step 2: Append rows
  const appendResponse = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Registro de Calorías y Macros'!A1:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: data.rows,
      }),
    }
  );

  if (!appendResponse.ok) {
    const errorData = await appendResponse.json();
    throw new Error(errorData.error?.message || 'Error insertando filas en Google Sheets');
  }

  return { spreadsheetId, spreadsheetUrl };
}

/**
 * Downloads a CSV file as local fallback backup
 */
export function downloadCsvBackup(data: SheetsExportData): void {
  const csvContent = data.rows
    .map((row) =>
      row
        .map((cell) => {
          const str = String(cell).replace(/"/g, '""');
          return `"${str}"`;
        })
        .join(',')
    )
    .join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${data.title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
