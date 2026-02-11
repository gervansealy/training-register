# Training Register System

A comprehensive web-based training certification tracking system with automated expiration notifications.

## 🌟 Features

- **User Management**: Admin and Editor roles with different permission levels
- **Training Records**: Track personnel, companies, training types, dates, and expirations
- **Automated Calculations**: Days to expiration calculated automatically
- **Email Notifications**: Scheduled alerts at customizable intervals
- **Modern UI**: Clean, responsive design that works on all devices
- **Real-time Updates**: Changes sync instantly across all users
- **Secure**: Firebase authentication and database security rules
- **Cloud-hosted**: Free hosting on GitHub Pages with Firebase backend

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/training-register.git
   cd training-register
   ```

2. **Set up Firebase configuration**
   - Copy `firebase-config.template.js` to `firebase-config.js`
   - Add your Firebase project credentials

3. **Follow the detailed setup guide**
   - See [SETUP_GUIDE.md](SETUP_GUIDE.md) for complete instructions

## 📋 What's Included

### Frontend Files
- `index.html` - Login page
- `dashboard.html` - Main training records dashboard
- `admin.html` - Admin control panel
- `styles.css` - Modern, responsive styling

### JavaScript Modules
- `auth.js` - Authentication logic
- `app.js` - Dashboard functionality
- `admin.js` - Admin panel functionality
- `firebase-config.js` - Firebase configuration (create from template)

### Backend
- `functions/index.js` - Cloud Functions for email notifications
- `database-rules.json` - Firebase Realtime Database security rules

### Documentation
- `SETUP_GUIDE.md` - Comprehensive setup instructions
- `README.md` - This file

## 🔑 User Roles

### Admin
- Full access to all features
- Create/delete users
- Set notification emails and intervals
- Manage training types
- Edit all training records
- View system statistics

### Editor
- Edit training records
- Add new records
- Delete records
- View all data
- Cannot access admin settings

## 📧 Email Notifications

Automated email notifications are sent at configurable intervals before training certifications expire:
- Default intervals: 59, 49, 39, 29, 14, 7, 3, 1 days before expiry
- Beautiful HTML email format
- Groups expired, urgent, and upcoming expirations
- Runs daily at 9 AM (configurable)

## 🎨 Color-Coded Expiration Status

- **Red**: Expired certifications
- **Yellow**: Expiring within 30 days
- **Orange**: Expiring within 31-60 days
- **Green**: Valid (60+ days remaining)

## 🔒 Security Features

- Email/password authentication
- Role-based access control
- Firebase security rules
- API keys safely managed
- Automatic session management
- Secure data validation

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Firebase Realtime Database
- **Authentication**: Firebase Authentication
- **Functions**: Firebase Cloud Functions
- **Email**: Nodemailer with Gmail
- **Hosting**: GitHub Pages
- **Version Control**: Git/GitHub

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (responsive design)

## 🤝 Contributing

This is a private training register system. If you'd like to use this for your organization:
1. Fork the repository
2. Follow the setup guide
3. Customize for your needs

## 📄 License

Private use for organizational training tracking.

## 💡 Tips

- Regularly backup your database (export JSON from Firebase)
- Keep user list updated
- Review notification settings quarterly
- Monitor email delivery logs
- Update training types as needed

## 🆘 Support

For setup issues, see the [SETUP_GUIDE.md](SETUP_GUIDE.md) troubleshooting section.

## 📊 System Requirements

- Modern web browser
- Internet connection
- Firebase account (free tier sufficient for small teams)
- GitHub account
- Gmail account (for sending notifications)

---

**Built with ❤️ for efficient training compliance management**
