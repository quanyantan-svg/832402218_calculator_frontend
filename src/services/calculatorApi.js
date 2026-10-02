/**
 * Calculator backend API client.
 *
 * Owns all HTTP communication with the FastAPI backend. App.vue and
 * components must not contain duplicated fetch logic; they delegate
 * to the functions in this module.
 *
 * The base URL is read from `VITE_API_BASE_URL` at call time. The
 * committed `.env.example` provides the local development value.
 */

const CALCULATE_PATH = '/api/calculate';
const HISTORY_PATH = '/api/history';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function resolveBaseUrl() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!baseUrl) {
    throw new ApiError(
      'Calculator service URL is not configured. Set VITE_API_BASE_URL in a local .env file.',
      0,
    );
  }
  return baseUrl.replace(/\/+$/, '');
}

function readMessage(payload) {
  if (payload && typeof payload.message === 'string' && payload.message.length > 0) {
    return payload.message;
  }
  return 'Calculator service returned an error.';
}

export async function calculateExpression(expression) {
  const url = `${resolveBaseUrl()}${CALCULATE_PATH}`;

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expression }),
    });
  } catch (networkError) {
    throw new ApiError(
      'Unable to connect to the calculator service.',
      0,
    );
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch (parseError) {
    payload = null;
  }

  if (!response.ok) {
    throw new ApiError(readMessage(payload), response.status);
  }

  if (!payload || typeof payload !== 'object' || typeof payload.result !== 'string') {
    throw new ApiError(
      'Calculator service returned an unexpected response.',
      response.status,
    );
  }

  return {
    expression: typeof payload.expression === 'string' ? payload.expression : expression,
    result: payload.result,
  };
}

export async function getHistory() {
  const url = `${resolveBaseUrl()}${HISTORY_PATH}`;

  let response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
  } catch (networkError) {
    throw new ApiError(
      'Unable to load calculation history.',
      0,
    );
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch (parseError) {
    payload = null;
  }

  if (!response.ok) {
    throw new ApiError(readMessage(payload), response.status);
  }

  if (!payload || typeof payload !== 'object' || !Array.isArray(payload.history)) {
    throw new ApiError(
      'Calculator service returned an unexpected history response.',
      response.status,
    );
  }

  return payload.history;
}

export async function deleteHistory(historyId) {
  if (typeof historyId !== 'number' || !Number.isInteger(historyId) || historyId <= 0) {
    throw new ApiError(
      'History record not found.',
      404,
    );
  }

  const url = `${resolveBaseUrl()}${HISTORY_PATH}/${historyId}`;

  let response;
  try {
    response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    });
  } catch (networkError) {
    throw new ApiError(
      'Unable to delete history record.',
      0,
    );
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch (parseError) {
    payload = null;
  }

  if (!response.ok) {
    throw new ApiError(readMessage(payload), response.status);
  }

  if (!payload || typeof payload !== 'object' || payload.success !== true) {
    throw new ApiError(
      'Calculator service returned an unexpected response.',
      response.status,
    );
  }

  return typeof payload.message === 'string' ? payload.message : '';
}
