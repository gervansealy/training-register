# Training Register - Complete Setup Guide

This guide will walk you through setting up your Training Register application with Firebase backend, GitHub hosting, and automated email notifications.

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Firebase Setup](#firebase-setup)
3. [Local Project Setup](#local-project-setup)
4. [GitHub Setup](#github-setup)
5. [GitHub Pages Deployment](#github-pages-deployment)
6. [Email Notification Setup](#email-notification-setup)
7. [Creating Your First Admin User](#creating-your-first-admin-user)
8. [Security Best Practices](#security-best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, make sure you have:
- A Google account (for Firebase)
- A GitHub account
- Git installed on your computer
- A text editor (VS Code, Notepad++, etc.)
- Node.js installed (v18 or higher) - Download from [nodejs.org](https://nodejs.org)

---

## Firebase Setup

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter a project name (e.g., "training-register")
4. Disable Google Analytics (not needed for this project)
5. Click **"Create project"**

### Step 2: Enable Firebase Authentication

1. In Firebase Console, click **"Authentication"** in the left menu
2. Click **"Get started"**
3. Click on **"Email/Password"** under Sign-in method
4. Enable **"Email/Password"** (toggle it on)
5. Click **"Save"**

### Step 3: Create Firebase Realtime Database

1. In Firebase Console, click **"Realtime Database"** in the left menu
2. Click **"Create Database"**
3. Select your location (choose closest to you)
4. Start in **"Locked mode"** (we'll set proper rules next)
5. Click **"Enable"**

### Step 4: Set Database Security Rules

1. In Realtime Database, click the **"Rules"** tab
2. Copy the contents from `database-rules.json` in your project
3. Paste into the Firebase rules editor
4. Click **"Publish"**

### Step 5: Get Your Firebase Configuration

1. In Firebase Console, click the **gear icon** ⚙️ next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** `</>`
5. Register your app with a nickname (e.g., "Training Register Web")
6. **DO NOT** check "Firebase Hosting" (we're using GitHub Pages)
7. Click **"Register app"**
8. Copy the `firebaseConfig` object values

### Step 6: Configure Your Application

1. Open `firebase-config.template.js` in your project
2. Copy it and rename to `firebase-config.js`
3. Replace the placeholder values with your Firebase config:
   ```javascript
   const firebaseConfig = {
       apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
       authDomain: "your-project.firebaseapp.com",
       projectId: "your-project",
       storageBucket: "your-project.appspot.com",
       messagingSenderId: "123456789012",
       appId: "1:123456789012:web:abcdef1234567890",
       databaseURL: "https://your-project-default-rtdb.firebaseio.com"
   };
   
   export default firebaseConfig;
   ```

---

## Local Project Setup

### Step 1: Prepare Your Project Directory

1. Open PowerShell/Command Prompt
2. Navigate to your project folder:
   ```powershell
   cd "C:\Training Register 1"
   ```

### Step 2: Initialize Git (if not already done)

```powershell
git init
git add .
git commit -m "Initial commit - Training Register application"
```

---

## GitHub Setup

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the **"+"** icon in the top right
3. Select **"New repository"**
4. Name it (e.g., "training-register")
5. Choose **"Public"** (required for free GitHub Pages)
6. **DO NOT** initialize with README (we already have files)
7. Click **"Create repository"**

### Step 2: Connect Local Repository to GitHub

```powershell
git remote add origin https://github.com/YOUR_USERNAME/training-register.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### Step 3: Set Up Automatic Push (Optional)

To automatically push changes, you have two options:

**Option A: Use Git Credential Manager (Recommended)**
- Windows will remember your credentials after first push
- Just use normal git commands: `git add .`, `git commit -m "message"`, `git push`

**Option B: Use GitHub Desktop**
1. Download [GitHub Desktop](https://desktop.github.com/)
2. Sign in with your GitHub account
3. Add your local repository
4. It will auto-sync changes

**Option C: Create a Push Script**
Create a file named `push-changes.ps1`:
```powershell
$commitMessage = Read-Host "Enter commit message"
git add .
git commit -m "$commitMessage"
git push origin main
Write-Host "Changes pushed to GitHub!" -ForegroundColor Green
```

Run it with: `.\push-changes.ps1`

---

## GitHub Pages Deployment

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **"Settings"**
3. Click **"Pages"** in the left sidebar
4. Under **"Source"**, select **"main"** branch
5. Select **"/ (root)"** folder
6. Click **"Save"**

### Step 2: Access Your Live Site

After 2-3 minutes, your site will be live at:
```
https://YOUR_USERNAME.github.io/training-register/
```

⚠️ **IMPORTANT**: Update your Firebase settings:
1. Go to Firebase Console → Authentication
2. Click **"Settings"** tab
3. Scroll to **"Authorized domains"**
4. Click **"Add domain"**
5. Add: `YOUR_USERNAME.github.io`

---

## Email Notification Setup

### Step 1: Install Firebase CLI

Open PowerShell as Administrator:
```powershell
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```powershell
firebase login
```

### Step 3: Initialize Firebase Functions

In your project directory:
```powershell
firebase init functions
```

- Select your Firebase project
- Choose JavaScript
- Install dependencies: Yes

### Step 4: Set Up Email Configuration

#### For Gmail:
1. Enable 2-Step Verification on your Google account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Create an app password for "Mail"
4. Copy the 16-character password

#### Set Firebase Environment Variables:
```powershell
firebase functions:config:set email.user="your-email@gmail.com" email.pass="your-app-password"
```

### Step 5: Deploy Cloud Functions

```powershell
firebase deploy --only functions
```

### Step 6: Test Email Notifications

1. Go to your admin panel in the app
2. Add notification email addresses
3. Set notification intervals (e.g., 59,49,39,29,14,7,3,1)
4. Add test training records with upcoming expiry dates

The function runs automatically every day at 9 AM. To test manually:
1. Go to Firebase Console → Functions
2. Find `checkExpirations` function
3. Click **"View logs"** to see execution history

---

## Creating Your First Admin User

Since this is your first time, you'll need to manually create an admin user:

### Step 1: Create User via Firebase Console

1. Go to Firebase Console → Authentication
2. Click **"Add user"**
3. Enter email and password
4. Copy the User UID (the long string)

### Step 2: Add Admin Role to Database

1. Go to Firebase Console → Realtime Database
2. Click the **"+"** next to your database root
3. Add this structure:
   ```
   users
     └─ [PASTE_USER_UID_HERE]
          ├─ email: "your-email@example.com"
          ├─ role: "admin"
          └─ createdAt: "2026-02-11T00:00:00.000Z"
   ```

### Step 3: Login to Your App

1. Go to your GitHub Pages URL
2. Login with the email and password you created
3. You now have full admin access!

---

## Security Best Practices

### 1. Protect Your Firebase Config

✅ **DO:**
- Keep `firebase-config.js` in `.gitignore`
- Use `firebase-config.template.js` for version control
- Never commit real API keys to GitHub

❌ **DON'T:**
- Share your API keys publicly
- Commit `firebase-config.js` to GitHub

### 2. Database Security

The rules in `database-rules.json` ensure:
- Only authenticated users can read data
- Only admins can modify settings and users
- All users can edit training records (editors and admins)

### 3. Authentication Security

- Use strong passwords (min 8 characters, mixed case, numbers, symbols)
- Only give admin access to trusted individuals
- Regularly audit user list in admin panel
- Remove users who no longer need access

### 4. API Key Security

Your Firebase API key is safe to expose in frontend code because:
- Firebase Security Rules protect your data
- API key identifies your Firebase project, not authentication
- All operations require authenticated users

### 5. Regular Backups

Export your database regularly:
1. Firebase Console → Realtime Database
2. Click the **3-dot menu** ⋮
3. Select **"Export JSON"**
4. Save the file securely

---

## Troubleshooting

### Issue: "Permission denied" when accessing database

**Solution:**
- Check that database rules are properly set
- Verify user is authenticated
- Check user has correct role in database

### Issue: Cannot login with credentials

**Solution:**
- Verify Email/Password authentication is enabled
- Check user exists in Firebase Authentication
- Ensure user has entry in `users` node with role

### Issue: GitHub Pages not loading properly

**Solution:**
- Check all file paths are relative (not absolute)
- Verify `firebase-config.js` exists (not just template)
- Check browser console for errors
- Ensure domain is added to Firebase authorized domains

### Issue: Email notifications not sending

**Solution:**
- Verify Gmail app password is correct
- Check Firebase Functions logs for errors
- Ensure billing is enabled (Functions require Blaze plan for external API calls)
- Verify notification settings are saved in database

### Issue: Days to expiration not calculating

**Solution:**
- Check date format is YYYY-MM-DD
- Verify dates are valid
- Clear browser cache and reload

### Issue: Changes not reflecting on GitHub Pages

**Solution:**
- Wait 2-3 minutes for GitHub Pages to rebuild
- Clear browser cache (Ctrl+Shift+R)
- Check that changes were pushed to GitHub
- Verify correct branch is selected in GitHub Pages settings

---

## Additional Configuration

### Customize Notification Schedule

Edit the schedule in `functions/index.js`:
```javascript
.schedule('0 9 * * *')  // Daily at 9 AM
.timeZone('America/New_York')  // Change to your timezone
```

Schedule format: `minute hour day month dayOfWeek`

Examples:
- `0 9 * * *` - Every day at 9 AM
- `0 9 * * 1` - Every Monday at 9 AM
- `0 9,17 * * *` - Daily at 9 AM and 5 PM

### Add More Training Types

As admin:
1. Go to Admin Panel
2. Scroll to "Training Types Management"
3. Add your custom training types

### Customize Styling

Edit `styles.css` to change:
- Colors (search for `#667eea` and `#764ba2`)
- Fonts
- Layout
- Component styling

---

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Review Firebase Console logs
3. Verify all setup steps were completed
4. Check GitHub repository settings

---

## Summary Checklist

- [ ] Firebase project created
- [ ] Authentication enabled
- [ ] Realtime Database created
- [ ] Database rules set
- [ ] firebase-config.js configured
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] GitHub Pages enabled
- [ ] Domain added to Firebase authorized domains
- [ ] First admin user created
- [ ] Firebase Functions deployed
- [ ] Email configuration set
- [ ] Notification settings configured

---

**🎉 Congratulations! Your Training Register is now live and fully functional!**

Your live site: `https://YOUR_USERNAME.github.io/training-register/`
