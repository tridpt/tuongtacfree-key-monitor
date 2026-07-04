const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");

const HOST = "127.0.0.1";
const PORT = Number(process.env.PORT || 8788);
const API_ORIGIN = "https://api.tuongtacfree.vn";

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(body);
}

function sendText(res, status, text, contentType = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "content-type": contentType,
    "cache-control": "no-store",
  });
  res.end(text);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1024 * 1024) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function loadConfiguredKey() {
  const settingsPath = path.join(os.homedir(), ".claude", "settings.json");
  if (!fs.existsSync(settingsPath)) return null;
  const raw = fs.readFileSync(settingsPath, "utf8");
  const json = JSON.parse(raw);
  return json?.env?.ANTHROPIC_API_KEY || json?.env?.ANTHROPIC_AUTH_TOKEN || null;
}

function maskKey(key) {
  if (!key || key.length < 12) return "";
  return `${key.slice(0, 6)}...${key.slice(-4)}`;
}

async function callCheckKey(route, key) {
  const response = await fetch(`${API_ORIGIN}/checkkey/${route}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ key }),
  });
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  if (!response.ok) {
    const message =
      data?.error?.message || data?.message || `HTTP ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

async function resolveKey(req) {
  if (req.method === "GET") return loadConfiguredKey();
  const raw = await readBody(req);
  if (!raw.trim()) return loadConfiguredKey();
  const body = JSON.parse(raw);
  return body.key || loadConfiguredKey();
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${HOST}:${PORT}`);

    if (url.pathname === "/" || url.pathname === "/index.html") {
      const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
      sendText(res, 200, html, "text/html; charset=utf-8");
      return;
    }

    if (url.pathname === "/api/config") {
      const key = loadConfiguredKey();
      sendJson(res, 200, {
        hasKey: Boolean(key),
        keyMasked: maskKey(key),
        source: key ? path.join(os.homedir(), ".claude", "settings.json") : null,
      });
      return;
    }

    if (url.pathname === "/api/info") {
      const key = await resolveKey(req);
      if (!key) {
        sendJson(res, 400, {
          error: "Khong tim thay API key trong ~/.claude/settings.json",
        });
        return;
      }
      const data = await callCheckKey("info", key);
      sendJson(res, 200, data);
      return;
    }

    if (url.pathname === "/api/history") {
      const key = await resolveKey(req);
      if (!key) {
        sendJson(res, 400, {
          error: "Khong tim thay API key trong ~/.claude/settings.json",
        });
        return;
      }
      const data = await callCheckKey("history", key);
      sendJson(res, 200, data);
      return;
    }

    sendJson(res, 404, { error: "Not found" });
  } catch (error) {
    sendJson(res, error.status || 500, {
      error: error.message || "Unknown error",
      detail: error.data || null,
    });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`CheckKey dashboard: http://${HOST}:${PORT}`);
});
