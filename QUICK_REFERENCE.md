# Training Register - Quick Reference

## 🚀 Common Tasks

### Push Changes to GitHub

**Option 1: Using PowerShell Script**
```powershell
.\push-changes.ps1
```

**Option 2: Manual Git Commands**
```powershell
git add .
git commit -m "Your commit message"
git push origin main
```

### Access Your Application

- **Local Testing**: Open `index.html` in your browser
- **Live Site**: `https://YOUR_USERNAME.github.io/training-register/`
- **Firebase Console**: [https://console.firebase.google.com/](https://console.firebase.google.com/)

### Firebase Commands

```powershell
# Login to Firebase
firebase login

# Deploy functions
firebase deploy --only functions

# View function logs
firebase functions:log

# Test functions locally
firebase emulators:start

# Set email config
firebase functions:config:set email.user="your@email.com" email.pass="app-password"

# View current config
firebase functions:config:get
```

### Backup Database

1. Go to Firebase Console → Realtime Database
2. Click the 3-dot menu ⋮
3. Select "Export JSON"
4. Save the file with date: `backup-2026-02-11.json`

### Add New User (As Admin)

**Via Application:**
1. Login as admin
2. Go to Admin Panel
3. Enter email, password, and role
4. Click "Create User"

**Via Firebase Console:**
1. Firebase Console → Authentication
2. Add user manually
3. Copy User UID
4. Realtime Database → Add to `users` node with role

---

## 🎯 Default Settings

### Notification Intervals
59, 49, 39, 29, 14, 7, 3, 1 days before expiry

### Function Schedule
Daily at 9:00 AM Eastern Time

### Color Coding
- 🔴 Red: Expired
- 🟡 Yellow: ≤ 30 days
- 🟠 Orange: 31-60 days
- 🟢 Green: 60+ days

---

## 📝 File Structure

```
training-register/
├── index.html              # Login page
├── dashboard.html          # Main dashboard
├── admin.html             # Admin panel
├── styles.css             # All styling
├── auth.js                # Login logic
├── app.js                 # Dashboard logic
├── admin.js               # Admin logic
├── firebase-config.js     # Your config (DO NOT COMMIT)
├── firebase-config.template.js  # Template
├── database-rules.json    # Security rules
├── firebase.json          # Firebase config
├── .gitignore            # Protect sensitive files
├── functions/
│   ├── index.js          # Email notification function
│   └── package.json      # Function dependencies
├── SETUP_GUIDE.md        # Full setup instructions
├── README.md             # Project overview
└── QUICK_REFERENCE.md    # This file
```

---

## 🔧 Troubleshooting Quick Fixes

### Can't Login
```
1. Check Firebase Console → Authentication (user exists?)
2. Check Realtime Database → users → [uid] (role exists?)
3. Check browser console for errors (F12)
```

### Database Permission Denied
```
1. Firebase Console → Realtime Database → Rules
2. Verify rules match database-rules.json
3. Click "Publish"
```

### GitHub Pages Not Updating
```
1. Wait 2-3 minutes
2. Hard refresh browser (Ctrl+Shift+R)
3. Check GitHub → Actions for build status
```

### Emails Not Sending
```
1. Check Gmail App Password is correct
2. Verify: firebase functions:config:get
3. Check function logs: firebase functions:log
4. Ensure Firebase Blaze plan is active
```

---

## 📊 Database Structure

```
root/
├── users/
│   └── [uid]/
│       ├── email: string
│       ├── role: "admin" | "editor"
│       └── createdAt: timestamp
│
├── trainingRecords/
│   └── [recordId]/
│       ├── personName: string
│       ├── company: string
│       ├── trainingType: string
│       ├── dateCompleted: date
│       ├── expiryDate: date
│       ├── trainingOrg: string
│       ├── lastModified: timestamp
│       └── modifiedBy: email
│
├── settings/
│   └── notifications/
│       ├── emails: [array of emails]
│       ├── intervals: [array of numbers]
│       ├── updatedAt: timestamp
│       └── updatedBy: email
│
├── trainingTypes/
│   └── [array of strings]
│
└── notificationLogs/
    └── [logId]/
        ├── timestamp: number
        ├── recipientCount: number
        ├── recordCount: number
        ├── expired: number
        ├── urgent: number
        └── upcoming: number
```

---

## 🔐 Security Checklist

- [ ] `firebase-config.js` is in `.gitignore`
- [ ] Database rules are properly set
- [ ] Only admins can manage users
- [ ] Strong passwords for all accounts
- [ ] GitHub repository authorized in Firebase
- [ ] Regular database backups
- [ ] Function environment variables set
- [ ] Gmail app password (not regular password)

---

## 💻 Keyboard Shortcuts

- **Search records**: Just start typing in search box
- **Clear filters**: Click "Clear Filters" button
- **Close modal**: Click X or press Escape
- **Quick edit**: Click "Edit" button on any row
- **Quick delete**: Click "Delete" button on any row

---

## 📞 Important URLs

| Resource | URL |
|----------|-----|
| Firebase Console | https://console.firebase.google.com/ |
| Your GitHub Repo | https://github.com/YOUR_USERNAME/training-register |
| Live Application | https://YOUR_USERNAME.github.io/training-register/ |
| Gmail App Passwords | https://myaccount.google.com/apppasswords |
| Firebase Docs | https://firebase.google.com/docs |

---

## 🎨 Customization

### Change Colors
Edit `styles.css`:
- Primary: `#667eea`
- Secondary: `#764ba2`

### Change Notification Time
Edit `functions/index.js`:
```javascript
.schedule('0 9 * * *')  // minute hour day month dayOfWeek
```

### Change Timezone
Edit `functions/index.js`:
```javascript
.timeZone('America/New_York')  // Change to your timezone
```

---

## 📈 Best Practices

1. **Commit often**: Push changes after each feature
2. **Test locally**: Open files in browser before pushing
3. **Backup weekly**: Export database JSON regularly
4. **Review logs**: Check function logs for email delivery
5. **Update passwords**: Change them every 90 days
6. **Monitor expiries**: Check dashboard daily
7. **Clean old records**: Archive expired training records

---

**Need more help? See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions.**
