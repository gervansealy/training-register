const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configure your email service
// For Gmail, you need to use an App Password (not your regular password)
// Go to: https://myaccount.google.com/apppasswords
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: functions.config().email.user,
        pass: functions.config().email.pass
    }
});

// This function runs daily at 9 AM to check for notifications
exports.checkExpirations = functions.pubsub
    .schedule('0 9 * * *')
    .timeZone('America/New_York')
    .onRun(async (context) => {
        const db = admin.database();
        
        // Get notification settings
        const settingsSnapshot = await db.ref('settings/notifications').once('value');
        if (!settingsSnapshot.exists()) {
            console.log('No notification settings found');
            return null;
        }
        
        const settings = settingsSnapshot.val();
        const notificationEmails = settings.emails || [];
        const intervals = settings.intervals || [];
        
        if (notificationEmails.length === 0) {
            console.log('No notification emails configured');
            return null;
        }
        
        // Get all training records
        const recordsSnapshot = await db.ref('trainingRecords').once('value');
        if (!recordsSnapshot.exists()) {
            console.log('No training records found');
            return null;
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const notificationsToSend = [];
        
        recordsSnapshot.forEach((childSnapshot) => {
            const record = childSnapshot.val();
            const recordId = childSnapshot.key;
            const expiryDate = new Date(record.expiryDate);
            expiryDate.setHours(0, 0, 0, 0);
            
            const diffTime = expiryDate - today;
            const daysToExpiration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (intervals.includes(daysToExpiration)) {
                notificationsToSend.push({
                    recordId: recordId,
                    personName: record.personName,
                    company: record.company,
                    trainingType: record.trainingType,
                    expiryDate: record.expiryDate,
                    daysToExpiration: daysToExpiration
                });
            }
        });
        
        if (notificationsToSend.length === 0) {
            console.log('No notifications to send today');
            return null;
        }
        
        // Group notifications by urgency
        const expiredRecords = notificationsToSend.filter(n => n.daysToExpiration < 0);
        const urgentRecords = notificationsToSend.filter(n => n.daysToExpiration >= 0 && n.daysToExpiration <= 7);
        const upcomingRecords = notificationsToSend.filter(n => n.daysToExpiration > 7);
        
        // Create email content
        let emailHtml = `
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; }
                    .section { margin-bottom: 30px; }
                    .section h2 { color: #667eea; border-bottom: 2px solid #eee; padding-bottom: 10px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                    th { background: #667eea; color: white; padding: 12px; text-align: left; }
                    td { padding: 10px; border-bottom: 1px solid #eee; }
                    .expired { background: #fee; color: #c00; font-weight: bold; }
                    .urgent { background: #fff3cd; color: #856404; font-weight: bold; }
                    .footer { background: #f8f9fa; padding: 15px; text-align: center; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Training Register - Expiration Notifications</h1>
                    <p>${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div class="content">
        `;
        
        if (expiredRecords.length > 0) {
            emailHtml += `
                <div class="section">
                    <h2>⚠️ EXPIRED Training Certifications (${expiredRecords.length})</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Company</th>
                                <th>Training Type</th>
                                <th>Expired Date</th>
                                <th>Days Overdue</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            expiredRecords.forEach(record => {
                emailHtml += `
                    <tr>
                        <td>${record.personName}</td>
                        <td>${record.company}</td>
                        <td>${record.trainingType}</td>
                        <td>${new Date(record.expiryDate).toLocaleDateString()}</td>
                        <td class="expired">${Math.abs(record.daysToExpiration)} days</td>
                    </tr>
                `;
            });
            emailHtml += `
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        if (urgentRecords.length > 0) {
            emailHtml += `
                <div class="section">
                    <h2>🔔 URGENT - Expiring Within 7 Days (${urgentRecords.length})</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Company</th>
                                <th>Training Type</th>
                                <th>Expiry Date</th>
                                <th>Days Remaining</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            urgentRecords.forEach(record => {
                emailHtml += `
                    <tr>
                        <td>${record.personName}</td>
                        <td>${record.company}</td>
                        <td>${record.trainingType}</td>
                        <td>${new Date(record.expiryDate).toLocaleDateString()}</td>
                        <td class="urgent">${record.daysToExpiration} days</td>
                    </tr>
                `;
            });
            emailHtml += `
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        if (upcomingRecords.length > 0) {
            emailHtml += `
                <div class="section">
                    <h2>📅 Upcoming Expirations (${upcomingRecords.length})</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Company</th>
                                <th>Training Type</th>
                                <th>Expiry Date</th>
                                <th>Days Remaining</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            upcomingRecords.forEach(record => {
                emailHtml += `
                    <tr>
                        <td>${record.personName}</td>
                        <td>${record.company}</td>
                        <td>${record.trainingType}</td>
                        <td>${new Date(record.expiryDate).toLocaleDateString()}</td>
                        <td>${record.daysToExpiration} days</td>
                    </tr>
                `;
            });
            emailHtml += `
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        emailHtml += `
                </div>
                <div class="footer">
                    <p>This is an automated notification from the Training Register System</p>
                    <p>Please do not reply to this email</p>
                </div>
            </body>
            </html>
        `;
        
        // Send email to all configured addresses
        const mailOptions = {
            from: functions.config().email.user,
            to: notificationEmails.join(','),
            subject: `Training Register Alert: ${notificationsToSend.length} Certifications Require Attention`,
            html: emailHtml
        };
        
        try {
            await transporter.sendMail(mailOptions);
            console.log(`Email sent successfully to ${notificationEmails.length} recipients`);
            
            // Log notifications sent
            const notifRef = db.ref('notificationLogs').push();
            await notifRef.set({
                timestamp: admin.database.ServerValue.TIMESTAMP,
                recipientCount: notificationEmails.length,
                recordCount: notificationsToSend.length,
                expired: expiredRecords.length,
                urgent: urgentRecords.length,
                upcoming: upcomingRecords.length
            });
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
        
        return null;
    });

// Manual trigger function (for testing)
exports.sendTestNotification = functions.https.onRequest(async (req, res) => {
    // Add authentication check here
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(403).send('Unauthorized');
        return;
    }
    
    try {
        await checkExpirations.run();
        res.status(200).send('Notification check completed');
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});
