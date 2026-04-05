# Quick Start Guide

## 1. Navigate to Project
```bash
cd /home/ubuntu/playwright-aa-unified
```

## 2. Start Demo Server
```bash
# Option A: Default port 3000
npm run demo:start

# Option B: Custom port 3001
DEMO_PORT=3001 node demo-server/server.js
```

## 3. Open Browser
```
http://localhost:3000  (or your custom port)
```

## 4. Login
- Username: `harshitha`
- Password: `harshitha21`

## 5. Try Features

### Upload PDF
1. Click "📁 File Manager" in sidebar
2. Drag and drop a PDF or click to browse
3. File uploads automatically

### Download PDF
1. In File Manager, click "Download" next to any file
2. File downloads to your computer

### Create Form
1. Click "Forms" in sidebar
2. Click "Create"
3. Enter form name
4. Drag components to canvas
5. Click "Save"

### Create Task Bot
1. Click "Task Bots" in sidebar
2. Click "Create"
3. Enter bot name
4. Double-click "Message Box" to add actions
5. Click "Save"

## 6. Run Tests
```bash
# Complete workflow test
node test-workflow.js

# Playwright tests
npm run test:uc2        # Form upload
npm run test:ui         # All UI tests
npm run test:api        # All API tests
```

## 7. View Reports
```bash
npm run report          # Playwright report
npm run allure:generate # Allure report
npm run allure:open     # Open Allure report
```

## Troubleshooting

### Port Already in Use
```bash
lsof -ti:3000 | xargs kill -9
```

### Dependencies Not Installed
```bash
pnpm install
```

### Tests Failing
```bash
npm run doctor          # Check setup
npm run test:debug      # Debug mode
```

## Key Files
- `demo-server/server.js` - Backend server
- `demo-server/public/index.html` - Frontend UI
- `test-workflow.js` - Complete workflow tests
- `UNIFIED_PROJECT_README.md` - Full documentation

## API Endpoints
- `POST /v2/authentication` - Login
- `POST /api/file/upload` - Upload file
- `GET /api/file/list` - List files
- `GET /api/file/download/:id` - Download file
- `DELETE /api/file/delete/:id` - Delete file
- `POST /api/form/save` - Save form
- `POST /api/taskbot/save` - Save task bot
- `POST /iqbot/api/v2/learning-instances` - Create learning instance

## Demo Credentials
- Username: `harshitha`
- Password: `harshitha21`
- Token: `demo-token-harshitha`

That's it! Everything is ready to go. 🚀
