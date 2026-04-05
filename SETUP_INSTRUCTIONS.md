# Complete Setup & Installation Guide

## 🎯 Project: Playwright Automation Anywhere Framework

This is a **production-ready** Playwright automation framework with complete PDF upload/download functionality, modern UI, and comprehensive testing.

---

## 📋 Table of Contents

1. [System Requirements](#system-requirements)
2. [Installation Steps](#installation-steps)
3. [Quick Start](#quick-start)
4. [Running Tests](#running-tests)
5. [API Endpoints](#api-endpoints)
6. [Troubleshooting](#troubleshooting)
7. [Project Structure](#project-structure)
8. [Features Overview](#features-overview)

---

## 💻 System Requirements

### Minimum Requirements
- **Operating System:** Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **Node.js:** v18.0.0 or higher
- **npm:** v8.0.0 or higher (or pnpm v7.0.0+)
- **RAM:** 4GB minimum (8GB recommended)
- **Disk Space:** 2GB free space
- **Browser:** Chrome/Chromium (for Playwright)

### Recommended Setup
- **Node.js:** v20.0.0 or higher
- **pnpm:** v10.0.0+ (faster than npm)
- **RAM:** 8GB or more
- **Disk Space:** 5GB free space

### Verify Your System
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check if git is installed
git --version
```

---

## 📥 Installation Steps

### Step 1: Extract the Project

```bash
# Extract the zip file
unzip playwright-aa-unified.zip

# Navigate to project directory
cd playwright-aa-unified
```

### Step 2: Install Dependencies

#### Option A: Using npm (Recommended for beginners)
```bash
npm install
```

#### Option B: Using pnpm (Faster)
```bash
# Install pnpm if not already installed
npm install -g pnpm

# Install dependencies
pnpm install
```

**Installation Time:** 2-5 minutes depending on internet speed

### Step 3: Verify Installation

```bash
# Check if all dependencies are installed
npm run doctor

# Or with pnpm
pnpm run doctor
```

Expected output:
```
✓ Node version check passed
✓ package.json found
✓ playwright.config.js found
✓ .env.example found
✓ sample-upload.pdf found
✓ Playwright tests discovered
```

---

## 🚀 Quick Start

### Start the Demo Server

```bash
# Navigate to project directory
cd playwright-aa-unified

# Start the server (default port 3000)
npm run demo:start

# Or with custom port
DEMO_PORT=3001 node demo-server/server.js
```

**Expected Output:**
```
Demo server running at http://127.0.0.1:3000
Uploads directory: /path/to/demo-server/uploads
```

### Access the Application

1. Open your browser
2. Navigate to: `http://localhost:3000`
3. Login with demo credentials:
   - **Username:** `harshitha`
   - **Password:** `harshitha21`

### Try the Features

#### Upload a PDF
1. Click "📁 File Manager" in sidebar
2. Drag and drop a PDF or click to browse
3. File uploads automatically

#### Create a Form
1. Click "Forms" in sidebar
2. Click "Create"
3. Enter form name
4. Drag "Text Box" to canvas
5. Drag "File Upload" to canvas
6. Click "Save"

#### Create a Task Bot
1. Click "Task Bots" in sidebar
2. Click "Create"
3. Enter bot name
4. Double-click "Message Box" to add action
5. Click "Save"

---

## 🧪 Running Tests

### Complete Workflow Test (Recommended First)

```bash
# Run all 10 tests
node test-workflow.js
```

**Expected Output:**
```
[INFO] === Automation Anywhere Demo - Complete Workflow Test ===
[SUCCESS] ✓ Authentication - Login with valid credentials
[SUCCESS] ✓ Authentication - Reject invalid credentials
[SUCCESS] ✓ Form - Save form successfully
[SUCCESS] ✓ Task Bot - Save task bot successfully
[SUCCESS] ✓ File Upload - Upload PDF file successfully
[SUCCESS] ✓ File List - Retrieve uploaded files
[SUCCESS] ✓ File Download - Download uploaded PDF
[SUCCESS] ✓ File Delete - Delete uploaded file
[SUCCESS] ✓ File Verification - Confirm file was deleted
[SUCCESS] ✓ Learning Instance - Create with authentication

Total Tests: 10
Passed: 10
Failed: 0

🎉 All tests passed! Complete workflow is working perfectly.
```

### Playwright UI Tests

```bash
# Run all UI tests
npm run test:ui

# Run specific use case tests
npm run test:uc1        # Message Box Task
npm run test:uc2        # Form Upload Flow
npm run test:uc3        # Learning Instance API

# Run with headed browser (see browser actions)
npm run test:headed

# Run in debug mode
npm run test:debug

# Run smoke tests
npm run test:smoke
```

### Playwright API Tests

```bash
# Run all API tests
npm run test:api

# Run all tests
npm run test
```

### View Test Reports

```bash
# Generate and view Playwright report
npm run report

# Generate Allure report
npm run allure:generate
npm run allure:open
```

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:3000
```

### Authentication
```
POST /v2/authentication
Content-Type: application/json

Request:
{
  "username": "harshitha",
  "password": "harshitha21"
}

Response:
{
  "token": "demo-token-harshitha"
}
```

### File Management

#### Upload File
```
POST /api/file/upload
Content-Type: multipart/form-data

Body: file (binary)

Response:
{
  "status": "ok",
  "file": {
    "id": "file-xxx",
    "fileName": "xxx.pdf",
    "originalName": "sample.pdf",
    "uploadedAt": "2026-04-05T12:52:53.125Z",
    "size": 1442
  }
}
```

#### List Files
```
GET /api/file/list

Response:
{
  "status": "ok",
  "files": [...]
}
```

#### Download File
```
GET /api/file/download/:fileId

Response: Binary file content
```

#### Delete File
```
DELETE /api/file/delete/:fileId

Response:
{
  "status": "ok",
  "message": "File deleted successfully"
}
```

### Form & Task Bot

#### Save Form
```
POST /api/form/save
Content-Type: application/json

Response:
{
  "status": "ok",
  "message": "Form saved successfully"
}
```

#### Save Task Bot
```
POST /api/taskbot/save
Content-Type: application/json

Response:
{
  "status": "ok",
  "message": "Task bot saved successfully"
}
```

### Learning Instances

#### Create Learning Instance
```
POST /iqbot/api/v2/learning-instances
Authorization: Bearer demo-token-harshitha
Content-Type: application/json

Request:
{
  "name": "My Learning Instance",
  "description": "Test instance"
}

Response:
{
  "id": "li-xxx",
  "name": "My Learning Instance",
  "status": "CREATED",
  "description": "Test instance",
  "locale": "en_US"
}
```

#### Get Learning Instance
```
GET /iqbot/api/v2/learning-instances/:id
Authorization: Bearer demo-token-harshitha

Response:
{
  "id": "li-xxx",
  "name": "My Learning Instance",
  "status": "CREATED",
  "description": "Test instance",
  "locale": "en_US"
}
```

---

## 🐛 Troubleshooting

### Issue: Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
DEMO_PORT=3001 node demo-server/server.js
```

### Issue: Dependencies Not Installing

**Error:** `npm ERR! code ERESOLVE`

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try installing again
npm install

# Or use pnpm instead
pnpm install
```

### Issue: Tests Failing

**Error:** `Error: Timeout waiting for element`

**Solution:**
```bash
# Check setup
npm run doctor

# Run with debug output
npm run test:debug

# Increase timeout
TIMEOUT=60000 npm run test
```

### Issue: File Upload Not Working

**Error:** `Upload failed`

**Solution:**
```bash
# Check if uploads directory exists
ls -la demo-server/uploads/

# Create if missing
mkdir -p demo-server/uploads

# Check permissions
chmod 755 demo-server/uploads
```

### Issue: Cannot Connect to Server

**Error:** `Connection refused`

**Solution:**
```bash
# Verify server is running
ps aux | grep "node demo-server"

# Check if port is accessible
curl http://localhost:3000

# Try different port
DEMO_PORT=3001 node demo-server/server.js
```

### Issue: Browser Not Found

**Error:** `Chromium not found`

**Solution:**
```bash
# Install Playwright browsers
npx playwright install

# Or with pnpm
pnpm exec playwright install
```

---

## 📁 Project Structure

```
playwright-aa-unified/
├── demo-server/                    # Express.js backend
│   ├── server.js                   # Main server with file endpoints
│   ├── uploads/                    # File storage directory
│   └── public/
│       └── index.html              # Frontend UI
├── tests/                          # Playwright test suites
│   ├── ui/
│   │   ├── uc1-message-box.spec.js
│   │   └── uc2-form-upload.spec.js
│   └── api/
│       └── uc3-learning-instance.spec.js
├── pages/                          # Page Object Models
│   ├── AutomationPage.js
│   ├── FormPage.js
│   ├── LoginPage.js
│   └── TaskBotPage.js
├── config/                         # Configuration
│   └── env.config.js
├── utils/                          # Utilities
│   ├── apiClient.js
│   ├── globalSetup.js
│   └── helpers.js
├── test-data/                      # Test data
│   ├── generate-sample.js
│   ├── sample-upload.pdf
│   └── testData.js
├── scripts/                        # Helper scripts
│   └── doctor.js
├── package.json                    # Dependencies & scripts
├── playwright.config.js            # Playwright configuration
├── test-workflow.js                # Complete workflow test
├── SETUP_INSTRUCTIONS.md           # This file
├── QUICK_START.md                  # Quick reference
├── UNIFIED_PROJECT_README.md       # Full documentation
├── COMPATIBILITY_VERIFICATION.md   # Compatibility report
└── README.md                       # Original documentation
```

---

## ✨ Features Overview

### Use Case 1: Message Box Task
- Create task bots
- Add message box actions
- Save configurations
- Test automation

### Use Case 2: Form with Upload
- Create forms
- Add text boxes
- Add file upload controls
- Upload PDF files
- Save forms

### Use Case 3: Learning Instance API
- Create learning instances
- Retrieve instances
- API validation
- Authentication

### Additional Features
- File upload & download
- File deletion
- Modern responsive UI
- Dark theme
- Drag & drop support
- Toast notifications
- Comprehensive testing

---

## 🎓 Demo Credentials

```
Username: harshitha
Password: harshitha21
Auth Token: demo-token-harshitha
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| SETUP_INSTRUCTIONS.md | Complete setup guide (this file) |
| QUICK_START.md | 5-minute quick reference |
| UNIFIED_PROJECT_README.md | Full project documentation |
| COMPATIBILITY_VERIFICATION.md | UI/Backend compatibility report |
| README.md | Original Playwright documentation |

---

## 🔧 Environment Configuration

### .env File (Optional)

Create `.env` file in project root:

```env
# Server Configuration
DEMO_PORT=3000
DEMO_MODE=true

# Authentication
AA_USERNAME=harshitha
AA_PASSWORD=harshitha21
AA_API_USERNAME=harshitha
AA_API_PASSWORD=harshitha21

# API Endpoints
BASE_URL=http://127.0.0.1:3000
API_BASE_URL=http://127.0.0.1:3000
AA_API_BASE=http://127.0.0.1:3000
AA_LOGIN_PATH=/v2/authentication
AA_LI_PATH=/iqbot/api/v2/learning-instances
```

---

## 📊 Available Scripts

```bash
# Testing
npm run test                # All tests
npm run test:ui            # UI tests only
npm run test:api           # API tests only
npm run test:uc1           # Message box test
npm run test:uc2           # Form upload test
npm run test:uc3           # Learning instance test
npm run test:smoke         # Smoke tests
npm run test:headed        # Headed browser
npm run test:debug         # Debug mode

# Reporting
npm run report             # Playwright report
npm run allure:generate    # Generate Allure report
npm run allure:open        # Open Allure report

# Demo
npm run demo:start         # Start demo server
npm run demo:test:ui       # Run UI tests on demo
npm run demo:test:api      # Run API tests on demo
npm run demo:smoke         # Run smoke tests on demo

# Utilities
npm run doctor             # Check setup
npm run generate:pdf       # Generate sample PDF

# Portal (Optional)
npm run portal:dev         # Dev server
npm run portal:build       # Build portal
npm run portal:preview     # Preview build
```

---

## ✅ Verification Checklist

After installation, verify everything works:

- [ ] Node.js installed: `node --version`
- [ ] npm installed: `npm --version`
- [ ] Dependencies installed: `npm install`
- [ ] Setup verified: `npm run doctor`
- [ ] Server starts: `npm run demo:start`
- [ ] UI accessible: `http://localhost:3000`
- [ ] Login works: `harshitha / harshitha21`
- [ ] Tests pass: `node test-workflow.js`
- [ ] All 10 tests pass

---

## 🚀 Deployment

### Local Development
```bash
npm run demo:start
```

### Production
```bash
# Install dependencies
npm install

# Start server
DEMO_PORT=3000 node demo-server/server.js
```

### Docker (Optional)
```dockerfile
FROM node:20
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "demo:start"]
```

---

## 📞 Support

### Common Issues

1. **Port in use** → Use different port: `DEMO_PORT=3001 node demo-server/server.js`
2. **Dependencies fail** → Clear cache: `npm cache clean --force`
3. **Tests timeout** → Increase timeout in playwright.config.js
4. **File upload fails** → Check `demo-server/uploads/` directory exists
5. **Browser not found** → Install: `npx playwright install`

### Getting Help

1. Check QUICK_START.md for quick reference
2. Read UNIFIED_PROJECT_README.md for details
3. Run `npm run doctor` to diagnose issues
4. Check server logs for errors
5. Review test output for failures

---

## 🎉 You're Ready!

Your complete Playwright automation framework is ready to use. Follow these steps:

1. **Extract** the zip file
2. **Install** dependencies: `npm install`
3. **Verify** setup: `npm run doctor`
4. **Start** server: `npm run demo:start`
5. **Open** browser: `http://localhost:3000`
6. **Login** with demo credentials
7. **Run** tests: `node test-workflow.js`

**Everything should work perfectly!** 🚀

---

## 📝 Notes

- All files are included in the zip
- No additional downloads needed
- Complete documentation provided
- All tests included and passing
- Production-ready code
- Ready for submission

**Enjoy your automation framework!** ✨
