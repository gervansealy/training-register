# 🚀 GET STARTED - First Steps

Follow these steps IN ORDER to get your Training Register up and running.

---

## ⏱️ Time Estimate: 30-45 minutes

---

## Step 1: Create Firebase Project (10 minutes)

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name it: `training-register`
4. Disable Google Analytics
5. Click "Create project"

✅ **Checkpoint**: You should see your project dashboard

---

## Step 2: Enable Authentication (2 minutes)

1. Click "Authentication" in left menu
2. Click "Get started"
3. Click "Email/Password"
4. Enable it and click "Save"

✅ **Checkpoint**: Email/Password should show as "Enabled"

---

## Step 3: Create Database (3 minutes)

1. Click "Realtime Database" in left menu
2. Click "Create Database"
3. Choose your location
4. Start in "Locked mode"
5. Click "Enable"

✅ **Checkpoint**: You should see an empty database

---

## Step 4: Set Database Rules (2 minutes)

1. In Realtime Database, click "Rules" tab
2. Copy everything from `database-rules.json`
3. Paste into Firebase rules editor
4. Click "Publish"

✅ **Checkpoint**: Rules should show "Published"

---

## Step 5: Get Your Firebase Config (3 minutes)

1. Click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the Web icon `</>`
5. Register app (nickname: "Training Register")
6. Copy the config values
7. Open `firebase-config.template.js`
8. Copy it to `firebase-config.js`
9. Paste your Firebase values

✅ **Checkpoint**: Your `firebase-config.js` has real values

---

## Step 6: Test Locally (2 minutes)

1. Open `index.html` in your browser
2. You should see the login page

✅ **Checkpoint**: Login page displays (you can't login yet - that's normal)

---

## Step 7: Create GitHub Repository (5 minutes)

1. Go to https://github.com
2. Click "+" → "New repository"
3. Name it: `training-register`
4. Make it **Public**
5. Do NOT add README
6. Click "Create repository"

✅ **Checkpoint**: Empty repository created

---

## Step 8: Push Code to GitHub (3 minutes)

Open PowerShell in your project folder:

```powershell
cd "C:\Training Register 1"
git init
git add .
git commit -m "Initial commit - Training Register"
git remote add origin https://github.com/YOUR_USERNAME/training-register.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

✅ **Checkpoint**: Code is on GitHub

---

## Step 9: Enable GitHub Pages (2 minutes)

1. Go to your GitHub repository
2. Click "Settings"
3. Click "Pages" in left sidebar
4. Source: "main" branch
5. Folder: "/ (root)"
6. Click "Save"

✅ **Checkpoint**: Shows "Your site is live at..."

---

## Step 10: Authorize GitHub Domain in Firebase (2 minutes)

1. Go to Firebase Console → Authentication
2. Click "Settings" tab
3. Scroll to "Authorized domains"
4. Click "Add domain"
5. Add: `YOUR_USERNAME.github.io`
6. Click "Add"

✅ **Checkpoint**: Domain shows in authorized list

---

## Step 11: Create Your Admin Account (5 minutes)

### Create User in Firebase:
1. Firebase Console → Authentication
2. Click "Add user"
3. Enter your email and password
4. Click "Add user"
5. **COPY THE USER UID** (long string)

### Add Admin Role:
1. Firebase Console → Realtime Database
2. Click "+" next to database root
3. Add this structure:
   - Key: `users`
   - Click "+"
   - Key: [PASTE YOUR UID HERE]
   - Click "+"
   - Add these child nodes:
     - `email`: "your-email@example.com"
     - `role`: "admin"
     - `createdAt`: "2026-02-11T00:00:00.000Z"

✅ **Checkpoint**: You can see your user in the database with role "admin"

---

## Step 12: Login to Your App! (1 minute)

1. Go to: `https://YOUR_USERNAME.github.io/training-register/`
2. Login with the email and password you created
3. You should see the dashboard!

✅ **Checkpoint**: You're in! Welcome to your Training Register!

---

## 🎉 SUCCESS! What's Next?

### Add Your First Training Record:
1. Click "+ Add Training Record"
2. Fill in the details
3. Click "Save"

### Set Up Email Notifications (Optional):
1. Click "Admin Panel"
2. Add notification email addresses (one per line)
3. Set notification intervals: `59,49,39,29,14,7,3,1`
4. Click "Save Notification Settings"

### Create Editor Users:
1. Click "Admin Panel"
2. Scroll to "User Management"
3. Enter email, password, role
4. Click "Create User"

### Add Training Types:
1. Click "Admin Panel"
2. Scroll to "Training Types Management"
3. Add your training types (e.g., "Rigging and Lifting", "Forklift Operator")

---

## 📧 Email Notifications Setup (Advanced - Optional)

This requires Node.js and Firebase CLI. If you want email notifications:

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init functions`
4. Set email config: `firebase functions:config:set email.user="your@gmail.com" email.pass="app-password"`
5. Deploy: `firebase deploy --only functions`

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed email setup instructions.

---

## 🆘 Need Help?

- **Full documentation**: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Quick commands**: [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- **Project info**: [README.md](README.md)

---

## 💡 Pro Tips

- **Bookmark your live site**: `https://YOUR_USERNAME.github.io/training-register/`
- **Bookmark Firebase Console**: https://console.firebase.google.com/
- **Use the PowerShell script**: `.\push-changes.ps1` to easily push updates
- **Backup regularly**: Export your database JSON monthly

---

## ✅ Final Checklist

- [ ] Firebase project created
- [ ] Authentication enabled
- [ ] Database created and rules set
- [ ] firebase-config.js configured with real values
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] GitHub Pages enabled
- [ ] GitHub domain authorized in Firebase
- [ ] Admin user created in Firebase
- [ ] Admin role added to database
- [ ] Successfully logged into live site
- [ ] First training record added

---

**🎊 Congratulations! You're all set up and ready to track training certifications!**

Your live site: `https://YOUR_USERNAME.github.io/training-register/`

Remember to replace `YOUR_USERNAME` with your actual GitHub username throughout this guide.
