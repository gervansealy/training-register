import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getDatabase, ref, set, get, update, remove, onValue } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js';
import firebaseConfig from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

let currentUser = null;
let userRole = null;

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    
    currentUser = user;
    const userRef = ref(db, `users/${user.uid}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
        userRole = snapshot.val().role;
        if (userRole !== 'admin') {
            alert('Access denied. Admin privileges required.');
            window.location.href = 'dashboard.html';
            return;
        }
        
        document.getElementById('userEmail').textContent = user.email;
        loadUsers();
        loadNotificationSettings();
        loadTrainingTypes();
        loadSystemStatus();
    }
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
    await signOut(auth);
    window.location.href = 'index.html';
});

document.getElementById('dashboardBtn').addEventListener('click', () => {
    window.location.href = 'dashboard.html';
});

document.getElementById('createUserBtn').addEventListener('click', async () => {
    const email = document.getElementById('newUserEmail').value;
    const password = document.getElementById('newUserPassword').value;
    const role = document.getElementById('newUserRole').value;
    const messageDiv = document.getElementById('userMessage');

    if (!email || !password) {
        showMessage(messageDiv, 'Please fill in all fields', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage(messageDiv, 'Password must be at least 6 characters', 'error');
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUserRef = ref(db, `users/${userCredential.user.uid}`);
        await set(newUserRef, {
            email: email,
            role: role,
            createdAt: new Date().toISOString(),
            createdBy: currentUser.email
        });

        showMessage(messageDiv, 'User created successfully', 'success');
        document.getElementById('newUserEmail').value = '';
        document.getElementById('newUserPassword').value = '';
        await auth.updateCurrentUser(currentUser);
    } catch (error) {
        showMessage(messageDiv, 'Error: ' + error.message, 'error');
    }
});

function loadUsers() {
    const usersRef = ref(db, 'users');
    onValue(usersRef, (snapshot) => {
        const usersList = document.getElementById('usersList');
        usersList.innerHTML = '';

        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const userData = childSnapshot.val();
                const userId = childSnapshot.key;
                
                const userItem = document.createElement('div');
                userItem.className = 'user-item';
                userItem.innerHTML = `
                    <div class="user-info">
                        <span>${userData.email}</span>
                        <span class="user-role-badge">${userData.role}</span>
                    </div>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser('${userId}', '${userData.email}')" 
                        ${userData.email === currentUser.email ? 'disabled' : ''}>
                        Delete
                    </button>
                `;
                usersList.appendChild(userItem);
            });
        }
    });
}

window.deleteUser = async (userId, email) => {
    if (email === currentUser.email) {
        alert('You cannot delete your own account');
        return;
    }

    if (confirm(`Are you sure you want to delete user: ${email}?`)) {
        try {
            const userRef = ref(db, `users/${userId}`);
            await remove(userRef);
            alert('User deleted successfully from database. Note: Firebase Authentication user must be deleted manually from Firebase Console.');
        } catch (error) {
            alert('Error deleting user: ' + error.message);
        }
    }
};

document.getElementById('saveNotificationBtn').addEventListener('click', async () => {
    const emails = document.getElementById('notificationEmails').value;
    const intervals = document.getElementById('notificationIntervals').value;
    const messageDiv = document.getElementById('notificationMessage');

    const emailArray = emails.split('\n').filter(e => e.trim() !== '');
    const intervalArray = intervals.split(',').map(i => parseInt(i.trim())).filter(i => !isNaN(i));

    try {
        const settingsRef = ref(db, 'settings/notifications');
        await set(settingsRef, {
            emails: emailArray,
            intervals: intervalArray,
            updatedAt: new Date().toISOString(),
            updatedBy: currentUser.email
        });

        showMessage(messageDiv, 'Notification settings saved successfully', 'success');
    } catch (error) {
        showMessage(messageDiv, 'Error: ' + error.message, 'error');
    }
});

async function loadNotificationSettings() {
    const settingsRef = ref(db, 'settings/notifications');
    const snapshot = await get(settingsRef);

    if (snapshot.exists()) {
        const settings = snapshot.val();
        document.getElementById('notificationEmails').value = (settings.emails || []).join('\n');
        document.getElementById('notificationIntervals').value = (settings.intervals || []).join(',');
    }
}

document.getElementById('addTrainingTypeBtn').addEventListener('click', async () => {
    const trainingType = document.getElementById('newTrainingType').value.trim();
    const messageDiv = document.getElementById('trainingTypeMessage');

    if (!trainingType) {
        showMessage(messageDiv, 'Please enter a training type', 'error');
        return;
    }

    try {
        const typesRef = ref(db, 'trainingTypes');
        const snapshot = await get(typesRef);
        const types = snapshot.exists() ? snapshot.val() : [];

        if (types.includes(trainingType)) {
            showMessage(messageDiv, 'This training type already exists', 'error');
            return;
        }

        types.push(trainingType);
        await set(typesRef, types);

        showMessage(messageDiv, 'Training type added successfully', 'success');
        document.getElementById('newTrainingType').value = '';
    } catch (error) {
        showMessage(messageDiv, 'Error: ' + error.message, 'error');
    }
});

function loadTrainingTypes() {
    const typesRef = ref(db, 'trainingTypes');
    onValue(typesRef, (snapshot) => {
        const typesList = document.getElementById('trainingTypesList');
        typesList.innerHTML = '';

        if (snapshot.exists()) {
            const types = snapshot.val();
            types.forEach((type, index) => {
                const typeItem = document.createElement('div');
                typeItem.className = 'training-type-item';
                typeItem.innerHTML = `
                    <span>${type}</span>
                    <button class="btn btn-sm btn-danger" onclick="deleteTrainingType(${index}, '${type}')">Delete</button>
                `;
                typesList.appendChild(typeItem);
            });
        }
    });
}

window.deleteTrainingType = async (index, typeName) => {
    if (confirm(`Are you sure you want to delete training type: ${typeName}?`)) {
        try {
            const typesRef = ref(db, 'trainingTypes');
            const snapshot = await get(typesRef);
            const types = snapshot.val();
            types.splice(index, 1);
            await set(typesRef, types);
        } catch (error) {
            alert('Error deleting training type: ' + error.message);
        }
    }
};

async function loadSystemStatus() {
    const recordsRef = ref(db, 'trainingRecords');
    const snapshot = await get(recordsRef);

    let total = 0;
    let expiringSoon = 0;
    let expired = 0;

    if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
            total++;
            const record = childSnapshot.val();
            const daysToExpiration = calculateDaysToExpiration(record.expiryDate);
            
            if (daysToExpiration < 0) {
                expired++;
            } else if (daysToExpiration <= 30) {
                expiringSoon++;
            }
        });
    }

    document.getElementById('totalRecords').textContent = total;
    document.getElementById('expiringSoon').textContent = expiringSoon;
    document.getElementById('expired').textContent = expired;
}

function calculateDaysToExpiration(expiryDate) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
    setTimeout(() => {
        element.className = 'message';
    }, 5000);
}
