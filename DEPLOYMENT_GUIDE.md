# 🚀 Deployment Guide - GitHub & Vercel

Complete step-by-step guide to deploy your Playwright Test Runner to GitHub and Vercel.

---

## 📋 Prerequisites

Before you start, make sure you have:
- ✅ GitHub account ([github.com](https://github.com))
- ✅ Vercel account ([vercel.com](https://vercel.com))
- ✅ Git installed on your computer
- ✅ Node.js 16+ installed

---

## 🔧 Step 1: Prepare Your Project

### 1.1 Clean Up Project Files

```bash
cd playwright-aa-unified

# Remove unnecessary files
rm -rf node_modules
rm -rf .manus-logs
rm -rf test-results
rm -rf .playwright

# Create fresh .env file
cp .env.example .env
```

### 1.2 Verify Project Structure

```bash
# Check essential files exist
ls -la demo-server/server.js
ls -la demo-server/public/index.html
ls -la package.json
ls -la vercel.json
```

---

## 📤 Step 2: Push to GitHub

### 2.1 Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `playwright-test-runner`
3. Description: "Professional Playwright Test Automation Platform"
4. Choose **Public** or **Private**
5. Click **Create repository**

### 2.2 Initialize Git and Push

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Premium Playwright Test Runner"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/playwright-test-runner.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 2.3 Verify on GitHub

- Visit `https://github.com/YOUR_USERNAME/playwright-test-runner`
- Verify all files are uploaded
- Check that `vercel.json` is present

---

## 🌐 Step 3: Deploy to Vercel

### 3.1 Connect GitHub to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Paste your GitHub URL: `https://github.com/YOUR_USERNAME/playwright-test-runner`
5. Click **"Import"**

### 3.2 Configure Project Settings

**Project Name:**
```
playwright-test-runner
```

**Framework Preset:**
```
Other (Node.js)
```

**Root Directory:**
```
./
```

**Build Command:**
```
npm install
```

**Output Directory:**
```
demo-server/public
```

**Environment Variables:**
```
NODE_ENV = production
DEMO_PORT = 3000
```

### 3.3 Deploy

1. Click **"Deploy"**
2. Wait for deployment to complete (usually 2-3 minutes)
3. You'll see: **"Congratulations! Your project has been successfully deployed"**
4. Your live URL: `https://playwright-test-runner.vercel.app`

---

## ✅ Step 4: Verify Deployment

### 4.1 Test Live Application

1. Open your Vercel URL in browser
2. Login with credentials:
   - Username: `harshitha`
   - Password: `harshitha21`
3. Test features:
   - ✅ Dashboard loads
   - ✅ Test Runner works
   - ✅ File Manager functions
   - ✅ Settings accessible
   - ✅ Logout works

### 4.2 Check Vercel Logs

```bash
# View deployment logs
vercel logs --follow

# Check function logs
vercel logs --tail
```

### 4.3 Monitor Performance

In Vercel Dashboard:
1. Click your project
2. Go to **"Analytics"** tab
3. Monitor:
   - Response times
   - Error rates
   - Request volume

---

## 🔄 Step 5: Continuous Deployment

### 5.1 Auto-Deploy on Push

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
nano demo-server/server.js

# Commit and push
git add .
git commit -m "Update: Improved test runner"
git push origin main

# Vercel will automatically deploy!
```

### 5.2 Preview Deployments

Every pull request gets a preview URL:

1. Create a new branch
2. Make changes
3. Push to GitHub
4. Create a Pull Request
5. Vercel creates preview URL automatically

---

## 🔐 Step 6: Security & Environment

### 6.1 Add Secrets

In Vercel Dashboard:

1. Go to **"Settings"** → **"Environment Variables"**
2. Add sensitive variables:
   ```
   DATABASE_URL = your_database_url
   API_KEY = your_api_key
   SECRET = your_secret
   ```

### 6.2 Configure Domains

1. Go to **"Settings"** → **"Domains"**
2. Add custom domain (optional):
   ```
   playwright-test.yourdomain.com
   ```
3. Follow DNS setup instructions

---

## 📊 Step 7: Monitoring & Maintenance

### 7.1 Monitor Application

```bash
# View real-time logs
vercel logs --follow

# Check deployment status
vercel status

# List all deployments
vercel list
```

### 7.2 Update Application

```bash
# Pull latest changes
git pull origin main

# Make updates
npm install  # if dependencies changed

# Commit and push
git add .
git commit -m "Update: New features"
git push origin main

# Vercel auto-deploys!
```

### 7.3 Rollback if Needed

```bash
# In Vercel Dashboard:
# 1. Go to "Deployments"
# 2. Find previous deployment
# 3. Click "..."
# 4. Select "Promote to Production"
```

---

## 🐛 Troubleshooting

### Issue: Deployment Failed

**Solution:**
1. Check Vercel logs: `vercel logs --follow`
2. Verify `vercel.json` is correct
3. Ensure `demo-server/server.js` exists
4. Check Node.js version compatibility

### Issue: 404 on Routes

**Solution:**
1. Verify routes in `vercel.json`
2. Check file paths are correct
3. Ensure `index.html` is in `demo-server/public/`

### Issue: Environment Variables Not Working

**Solution:**
1. Go to Vercel Dashboard
2. Settings → Environment Variables
3. Redeploy after adding variables
4. Verify variable names match code

### Issue: Slow Performance

**Solution:**
1. Check Vercel Analytics
2. Optimize images and assets
3. Enable caching headers
4. Consider upgrading plan

---

## 📈 Performance Optimization

### 7.1 Enable Caching

Add to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/demo-server/public/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600"
        }
      ]
    }
  ]
}
```

### 7.2 Compress Assets

```bash
# Enable gzip compression
npm install compression
```

### 7.3 Monitor Metrics

Track in Vercel Dashboard:
- Response times
- Error rates
- Bandwidth usage
- Deployment frequency

---

## 🎯 Next Steps

1. ✅ Push to GitHub
2. ✅ Deploy to Vercel
3. ✅ Test live application
4. ✅ Monitor performance
5. ✅ Set up custom domain
6. ✅ Enable auto-deployments
7. ✅ Share with team

---

## 📞 Support

If you encounter issues:

1. **Check Vercel Logs**
   ```bash
   vercel logs --follow
   ```

2. **Review GitHub Issues**
   - Search existing issues
   - Create new issue with details

3. **Contact Support**
   - Vercel: support@vercel.com
   - GitHub: support@github.com

---

## 🎉 Congratulations!

Your Playwright Test Runner is now live on Vercel! 🚀

**Your Live URL:** `https://playwright-test-runner.vercel.app`

**GitHub Repository:** `https://github.com/YOUR_USERNAME/playwright-test-runner`

Share with your team and start automating tests! 🧪✨
