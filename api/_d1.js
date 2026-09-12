/**
 * Cloudflare D1 Database Helper for Vercel Serverless Functions
 * Uses the official Cloudflare D1 REST API to execute SQL statements on the edge.
 */

function getD1Credentials() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || process.env.CF_ACCOUNT_ID || "";
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID || process.env.CF_D1_DATABASE_ID || "9e5fde94-6ad0-414f-ab69-0fc0452c28ce";
  const apiToken = process.env.CLOUDFLARE_API_TOKEN || process.env.CF_API_TOKEN || "";
  return { accountId, databaseId, apiToken };
}

/**
 * Execute a SQL query on Cloudflare D1
 * @param {string} sql - SQL statement to execute
 * @param {Array} params - Bound parameters
 * @returns {Promise<Array>} Array of rows
 */
export async function queryD1(sql, params = []) {
  const { accountId, databaseId, apiToken } = getD1Credentials();

  if (!accountId || !apiToken) {
    console.warn("[Cloudflare D1] Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN in environment variables.");
    return null;
  }

  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sql,
      params,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Cloudflare D1 API error (${res.status}): ${errText}`);
  }

  const json = await res.json();
  if (!json.success) {
    const msg = json.errors?.[0]?.message || "Failed to query Cloudflare D1";
    throw new Error(msg);
  }

  return json.result?.[0]?.results || [];
}

/**
 * Execute a write query (INSERT / UPDATE / DELETE) on Cloudflare D1
 */
export async function executeD1(sql, params = []) {
  const { accountId, databaseId, apiToken } = getD1Credentials();

  if (!accountId || !apiToken) {
    console.warn("[Cloudflare D1] Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN in environment variables.");
    return { success: true, simulated: true };
  }

  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sql,
      params,
    }),
  });

  const json = await res.json();
  if (!json.success) {
    const msg = json.errors?.[0]?.message || "Failed to execute statement on Cloudflare D1";
    throw new Error(msg);
  }

  return json.result?.[0] || { success: true };
}
