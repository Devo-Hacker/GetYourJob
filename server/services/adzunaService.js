import axios from "axios";

// Free tier: register at https://developer.adzuna.com/ to get an
// app_id + app_key (about 1,000 calls/month, no card required).
// Docs: https://developer.adzuna.com/docs/search
//
// Client is built lazily (inside the function) for the same reason as
// geminiService.js's getGroqClient() - dotenv.config() in server.js
// runs AFTER this module is first imported, so reading
// process.env.ADZUNA_APP_ID at the top of the file would capture
// "undefined" permanently.
function getAdzunaCredentials() {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (!appId || !appKey) {
    throw new Error(
      "ADZUNA_APP_ID / ADZUNA_APP_KEY missing. Get a free key at https://developer.adzuna.com/ and add them to server/.env"
    );
  }
  return { appId, appKey };
}

// what: search query (e.g. a target role name like "Backend Developer")
// where: optional location filter (city/region)
// country: Adzuna's two-letter country code - "in" for India, "gb" for
//          UK, "us" for United States, etc. Defaults to India since the
//          app's existing mock data is priced in LPA/₹.
export async function searchJobs({ what, where, page = 1, country, resultsPerPage = 20 }) {
  const { appId, appKey } = getAdzunaCredentials();
  const cc = country || process.env.ADZUNA_COUNTRY || "in";

  const { data } = await axios.get(
    `https://api.adzuna.com/v1/api/jobs/${cc}/search/${page}`,
    {
      params: {
        app_id: appId,
        app_key: appKey,
        what,
        where: where || undefined,
        results_per_page: resultsPerPage,
        "content-type": "application/json",
      },
    }
  );

  return {
    count: data.count,
    results: data.results || [],
  };
}
