// src/libs/response.js

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

const success = (data, statusCode = 200) => ({
  statusCode,
  headers,
  body: JSON.stringify({ success: true, data }),
});

const error = (message, statusCode = 500, details = null) => ({
  statusCode,
  headers,
  body: JSON.stringify({
    success: false,
    error: message,
    ...(details && { details }),
  }),
});

const paginated = (data, total, page, limit) => ({
  statusCode: 200,
  headers,
  body: JSON.stringify({
    success: true,
    data,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  }),
});

module.exports = { success, error, paginated };
