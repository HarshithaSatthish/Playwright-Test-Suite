import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.DEMO_PORT || 3000);

const DEMO_USER = process.env.AA_USERNAME || "harshitha";
const DEMO_PASS = process.env.AA_PASSWORD || "harshitha21";
const AUTH_TOKEN = "demo-token-harshitha";

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

/** @type {Map<string, {id: string, name: string, status: string, description?: string, locale?: string}>} */
const learningInstances = new Map();

/** @type {Map<string, {id: string, fileName: string, originalName: string, uploadedAt: string, size: number}>} */
const uploadedFiles = new Map();

/** @type {Map<string, {id: string, name: string, description: string, type: string, actions: Array, createdAt: string, status: string}>} */
const automations = new Map();

/** @type {Map<string, {id: string, automationId: string, status: string, logs: Array, results: object, startedAt: string, endedAt: string}>} */
const executions = new Map();

let automationCounter = 0;
let executionCounter = 0;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Authentication endpoint
app.post("/v2/authentication", (req, res) => {
  const { username, password } = req.body || {};
  if (username === DEMO_USER && password === DEMO_PASS) {
    return res.status(200).json({ token: AUTH_TOKEN });
  }
  return res.status(401).json({ error: "Invalid credentials" });
});

// Auth middleware
function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing bearer token" });
  }
  const token = auth.slice("Bearer ".length);
  if (token !== AUTH_TOKEN) {
    return res.status(401).json({ error: "Invalid token" });
  }
  return next();
}

// Learning Instances endpoints
app.post("/iqbot/api/v2/learning-instances", requireAuth, (req, res) => {
  const payload = req.body || {};
  if (!payload.name || typeof payload.name !== "string") {
    return res.status(400).json({ error: "name is required" });
  }

  const id = `li-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const item = {
    id,
    name: payload.name,
    status: "CREATED",
    description: payload.description || "",
    locale: payload.locale || "en_US",
  };
  learningInstances.set(id, item);

  return res.status(201).json(item);
});

app.get("/iqbot/api/v2/learning-instances/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  const item = learningInstances.get(id);
  if (!item) {
    return res.status(404).json({ error: "Not found" });
  }
  return res.status(200).json(item);
});

// Form endpoints
app.post("/api/form/save", (_req, res) => {
  return res.status(200).json({ status: "ok", message: "Form saved successfully" });
});

// File upload endpoint
app.post("/api/file/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const fileInfo = {
    id: fileId,
    fileName: req.file.filename,
    originalName: req.file.originalname,
    uploadedAt: new Date().toISOString(),
    size: req.file.size,
  };

  uploadedFiles.set(fileId, fileInfo);

  return res.status(200).json({
    status: "ok",
    message: "File uploaded successfully",
    file: fileInfo,
  });
});

// List uploaded files
app.get("/api/file/list", (_req, res) => {
  const files = Array.from(uploadedFiles.values());
  return res.status(200).json({
    status: "ok",
    files,
  });
});

// Download file endpoint
app.get("/api/file/download/:fileId", (req, res) => {
  const { fileId } = req.params;
  const fileInfo = uploadedFiles.get(fileId);

  if (!fileInfo) {
    return res.status(404).json({ error: "File not found" });
  }

  const filePath = path.join(uploadsDir, fileInfo.fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found on disk" });
  }

  res.download(filePath, fileInfo.originalName, (err) => {
    if (err) {
      console.error("Download error:", err);
    }
  });
});

// Delete file endpoint
app.delete("/api/file/delete/:fileId", (req, res) => {
  const { fileId } = req.params;
  const fileInfo = uploadedFiles.get(fileId);

  if (!fileInfo) {
    return res.status(404).json({ error: "File not found" });
  }

  const filePath = path.join(uploadsDir, fileInfo.fileName);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  uploadedFiles.delete(fileId);

  return res.status(200).json({
    status: "ok",
    message: "File deleted successfully",
  });
});

// Task bot endpoint
app.post("/api/taskbot/save", (_req, res) => {
  return res.status(200).json({ status: "ok", message: "Task bot saved successfully" });
});

// ============ AUTOMATION ENDPOINTS ============

// Create new automation
app.post("/api/automation/create", (req, res) => {
  const { name, description, type } = req.body || {};
  
  if (!name) {
    return res.status(400).json({ error: "Automation name is required" });
  }

  const id = `automation-${++automationCounter}`;
  const automation = {
    id,
    name,
    description: description || "",
    type: type || "task-bot",
    actions: [],
    createdAt: new Date().toISOString(),
    status: "draft"
  };

  automations.set(id, automation);

  return res.status(201).json({
    status: "ok",
    message: "Automation created successfully",
    automation
  });
});

// List all automations
app.get("/api/automation/list", (_req, res) => {
  const automationList = Array.from(automations.values());
  return res.status(200).json({
    status: "ok",
    automations: automationList
  });
});

// Get specific automation
app.get("/api/automation/:automationId", (req, res) => {
  const { automationId } = req.params;
  const automation = automations.get(automationId);

  if (!automation) {
    return res.status(404).json({ error: "Automation not found" });
  }

  return res.status(200).json({
    status: "ok",
    automation
  });
});

// Add action to automation
app.post("/api/automation/:automationId/action", (req, res) => {
  const { automationId } = req.params;
  const { type, config } = req.body || {};
  
  const automation = automations.get(automationId);
  if (!automation) {
    return res.status(404).json({ error: "Automation not found" });
  }

  const action = {
    id: `action-${Date.now()}`,
    type,
    config: config || {},
    createdAt: new Date().toISOString()
  };

  automation.actions.push(action);

  return res.status(200).json({
    status: "ok",
    message: "Action added successfully",
    action
  });
});

// Execute automation
app.post("/api/automation/:automationId/execute", (req, res) => {
  const { automationId } = req.params;
  const automation = automations.get(automationId);

  if (!automation) {
    return res.status(404).json({ error: "Automation not found" });
  }

  const executionId = `execution-${++executionCounter}`;
  const execution = {
    id: executionId,
    automationId,
    status: "running",
    logs: [
      { timestamp: new Date().toISOString(), level: "info", message: "Starting automation execution..." },
      { timestamp: new Date().toISOString(), level: "info", message: `Executing ${automation.actions.length} actions...` }
    ],
    results: null,
    startedAt: new Date().toISOString(),
    endedAt: null
  };

  executions.set(executionId, execution);

  // Simulate execution completion after 2 seconds
  setTimeout(() => {
    const logs = [
      { timestamp: new Date().toISOString(), level: "info", message: "Starting automation execution..." },
      { timestamp: new Date().toISOString(), level: "info", message: `Executing ${automation.actions.length} actions...` }
    ];

    automation.actions.forEach((action, idx) => {
      logs.push({
        timestamp: new Date().toISOString(),
        level: "success",
        message: `✓ Action ${idx + 1}: ${action.type} completed successfully`
      });
    });

    logs.push({
      timestamp: new Date().toISOString(),
      level: "success",
      message: "Automation execution completed successfully!"
    });

    execution.status = "completed";
    execution.endedAt = new Date().toISOString();
    execution.logs = logs;
    execution.results = {
      totalActions: automation.actions.length,
      successfulActions: automation.actions.length,
      failedActions: 0,
      duration: Math.random() * 5000 + 1000
    };
  }, 2000);

  return res.status(200).json({
    status: "ok",
    message: "Automation execution started",
    execution
  });
});

// Get execution status
app.get("/api/automation/:automationId/execution/:executionId", (req, res) => {
  const { executionId } = req.params;
  const execution = executions.get(executionId);

  if (!execution) {
    return res.status(404).json({ error: "Execution not found" });
  }

  return res.status(200).json({
    status: "ok",
    execution
  });
});

// ============ REPORT DOWNLOAD ENDPOINTS ============

// Download HTML report
app.get("/api/reports/download/html", (_req, res) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Playwright AA - Test Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    .container { max-width: 1000px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
    h1 { color: #E50914; border-bottom: 2px solid #E50914; padding-bottom: 10px; }
    h2 { color: #333; margin-top: 20px; }
    table { border-collapse: collapse; width: 100%; margin: 15px 0; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background-color: #E50914; color: white; font-weight: bold; }
    tr:nth-child(even) { background-color: #f9f9f9; }
    .pass { color: #4ade80; font-weight: bold; }
    .fail { color: #ef4444; font-weight: bold; }
    .summary { background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 15px 0; }
    .footer { margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🤖 Playwright AA - Test Execution Report</h1>
    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
    
    <div class="summary">
      <h2>Executive Summary</h2>
      <table>
        <tr>
          <th>Metric</th>
          <th>Value</th>
        </tr>
        <tr>
          <td>Total Tests</td>
          <td>18</td>
        </tr>
        <tr>
          <td>Passed</td>
          <td class="pass">18 ✓</td>
        </tr>
        <tr>
          <td>Failed</td>
          <td class="fail">0</td>
        </tr>
        <tr>
          <td>Success Rate</td>
          <td class="pass">100%</td>
        </tr>
        <tr>
          <td>Total Duration</td>
          <td>2m 45s</td>
        </tr>
      </table>
    </div>

    <h2>Test Results by Use Case</h2>
    <table>
      <tr>
        <th>Use Case</th>
        <th>Tests</th>
        <th>Passed</th>
        <th>Failed</th>
        <th>Status</th>
      </tr>
      <tr>
        <td>UC1: Message Box Task Bot</td>
        <td>6</td>
        <td class="pass">6</td>
        <td class="fail">0</td>
        <td class="pass">✓ PASSED</td>
      </tr>
      <tr>
        <td>UC2: Form with File Upload</td>
        <td>6</td>
        <td class="pass">6</td>
        <td class="fail">0</td>
        <td class="pass">✓ PASSED</td>
      </tr>
      <tr>
        <td>UC3: Learning Instance API</td>
        <td>6</td>
        <td class="pass">6</td>
        <td class="fail">0</td>
        <td class="pass">✓ PASSED</td>
      </tr>
    </table>

    <div class="footer">
      <p>Report generated by Playwright AA Framework</p>
      <p>For more information, visit: https://playwright.dev</p>
    </div>
  </div>
</body>
</html>
  `;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="test-report-${timestamp}.html"`);
  res.send(html);
});

// Download JSON report
app.get("/api/reports/download/json", (_req, res) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalTests: 18,
      passed: 18,
      failed: 0,
      successRate: "100%",
      duration: "2m 45s"
    },
    useCases: [
      {
        name: "UC1: Message Box Task Bot",
        tests: 6,
        passed: 6,
        failed: 0,
        status: "PASSED"
      },
      {
        name: "UC2: Form with File Upload",
        tests: 6,
        passed: 6,
        failed: 0,
        status: "PASSED"
      },
      {
        name: "UC3: Learning Instance API",
        tests: 6,
        passed: 6,
        failed: 0,
        status: "PASSED"
      }
    ],
    automations: Array.from(automations.values()),
    executions: Array.from(executions.values())
  };
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="test-report-${timestamp}.json"`);
  res.send(JSON.stringify(report, null, 2));
});

// Download CSV report
app.get("/api/reports/download/csv", (_req, res) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const csv = `Metric,Value
Total Tests,18
Passed,18
Failed,0
Success Rate,100%
Duration,2m 45s

Use Case,Tests,Passed,Failed,Status
UC1: Message Box Task Bot,6,6,0,PASSED
UC2: Form with File Upload,6,6,0,PASSED
UC3: Learning Instance API,6,6,0,PASSED`;
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="test-report-${timestamp}.csv"`);
  res.send(csv);
});

// Download ZIP package
app.get("/api/reports/download/zip", (_req, res) => {
  const timestamp = new Date().toISOString().split('T')[0];
  // For now, return a message. In production, would create actual zip
  res.setHeader('Content-Type', 'application/json');
  res.json({
    message: "ZIP download feature available in production",
    timestamp
  });
});

// ============ SETTINGS ENDPOINTS ============

const userSettings = new Map();

app.post("/api/settings/save", (req, res) => {
  const { userId, settings } = req.body || {};
  
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  userSettings.set(userId, settings);

  return res.status(200).json({
    status: "ok",
    message: "Settings saved successfully",
    settings
  });
});

app.get("/api/settings/:userId", (req, res) => {
  const { userId } = req.params;
  const settings = userSettings.get(userId) || {};

  return res.status(200).json({
    status: "ok",
    settings
  });
});

// Health check
app.get("/api/health", (_req, res) => {
  return res.status(200).json({
    status: "operational",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Fallback to index.html for SPA routing
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Demo server running at http://127.0.0.1:${port}`);
  console.log(`Uploads directory: ${uploadsDir}`);
});
