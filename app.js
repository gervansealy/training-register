import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getDatabase, ref, push, set, get, update, remove, onValue } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js';
import firebaseConfig from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

let currentUser = null;
let userRole = null;
let editingRecordId = null;
let allRecords = [];

// Temporary bypass - no login required
currentUser = { email: 'admin@training-register.com', uid: 'temp-admin' };
userRole = 'admin';
document.getElementById('userEmail').textContent = 'Admin (No Login)';
document.getElementById('userRole').textContent = 'admin';
document.getElementById('adminBtn').style.display = 'inline-block';
loadRecords();

// Comment out original auth check
// onAuthStateChanged(auth, async (user) => {
//     if (!user) {
//         window.location.href = 'index.html';
//         return;
//     }
//     
//     currentUser = user;
//     const userRef = ref(db, `users/${user.uid}`);
//     const snapshot = await get(userRef);
//     
//     if (snapshot.exists()) {
//         userRole = snapshot.val().role;
//         document.getElementById('userEmail').textContent = user.email;
//         document.getElementById('userRole').textContent = userRole;
//         
//         if (userRole === 'admin') {
//             document.getElementById('adminBtn').style.display = 'inline-block';
//         }
//         
//         loadRecords();
//     }
// });

document.getElementById('logoutBtn').addEventListener('click', async () => {
    // Temporary bypass - just reload
    window.location.reload();
    // await signOut(auth);
    // window.location.href = 'index.html';
});

document.getElementById('adminBtn').addEventListener('click', () => {
    window.location.href = 'admin.html';
});

document.getElementById('addRecordBtn').addEventListener('click', () => {
    editingRecordId = null;
    document.getElementById('modalTitle').textContent = 'Add Training Record';
    document.getElementById('recordForm').reset();
    document.getElementById('recordModal').classList.add('active');
});

document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('recordModal').classList.remove('active');
});

document.getElementById('cancelBtn').addEventListener('click', () => {
    document.getElementById('recordModal').classList.remove('active');
});

document.getElementById('recordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    console.log('Form submitted!');
    
    const recordData = {
        personName: document.getElementById('personName').value,
        company: document.getElementById('company').value,
        trainingType: document.getElementById('trainingType').value,
        dateCompleted: document.getElementById('dateCompleted').value,
        expiryDate: document.getElementById('expiryDate').value,
        trainingOrg: document.getElementById('trainingOrg').value,
        lastModified: new Date().toISOString(),
        modifiedBy: currentUser.email
    };

    console.log('Saving data:', recordData);

    try {
        if (editingRecordId) {
            console.log('Updating record:', editingRecordId);
            const recordRef = ref(db, `trainingRecords/${editingRecordId}`);
            await update(recordRef, recordData);
        } else {
            console.log('Creating new record');
            const recordsRef = ref(db, 'trainingRecords');
            await push(recordsRef, recordData);
        }
        
        console.log('Save successful!');
        alert('Record saved successfully!');
        document.getElementById('recordModal').classList.remove('active');
        document.getElementById('recordForm').reset();
    } catch (error) {
        console.error('Save error:', error);
        alert('Error saving record: ' + error.message + '\n\nCheck console for details.');
    }
});

function loadRecords() {
    const recordsRef = ref(db, 'trainingRecords');
    onValue(recordsRef, (snapshot) => {
        allRecords = [];
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                allRecords.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
        }
        displayRecords(allRecords);
        updateFilters();
        checkExpirations();
    });
}

function displayRecords(records) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    if (records.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;">No records found</td></tr>';
        return;
    }

    records.forEach(record => {
        const row = document.createElement('tr');
        const daysToExpiration = calculateDaysToExpiration(record.expiryDate);
        const expirationClass = getExpirationClass(daysToExpiration);

        row.innerHTML = `
            <td>${record.personName}</td>
            <td>${record.company}</td>
            <td>${record.trainingType}</td>
            <td>${formatDate(record.dateCompleted)}</td>
            <td>${formatDate(record.expiryDate)}</td>
            <td><span class="days-expiration ${expirationClass}">${daysToExpiration} days</span></td>
            <td>${record.trainingOrg}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-warning" onclick="editRecord('${record.id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteRecord('${record.id}')">Delete</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function calculateDaysToExpiration(expiryDate) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function getExpirationClass(days) {
    if (days < 0) return 'expired';
    if (days <= 30) return 'expiring-soon';
    if (days <= 60) return 'expiring-medium';
    return 'valid';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

window.editRecord = async (recordId) => {
    editingRecordId = recordId;
    const recordRef = ref(db, `trainingRecords/${recordId}`);
    const snapshot = await get(recordRef);
    
    if (snapshot.exists()) {
        const record = snapshot.val();
        document.getElementById('modalTitle').textContent = 'Edit Training Record';
        document.getElementById('personName').value = record.personName;
        document.getElementById('company').value = record.company;
        document.getElementById('trainingType').value = record.trainingType;
        document.getElementById('dateCompleted').value = record.dateCompleted;
        document.getElementById('expiryDate').value = record.expiryDate;
        document.getElementById('trainingOrg').value = record.trainingOrg;
        document.getElementById('recordModal').classList.add('active');
    }
};

window.deleteRecord = async (recordId) => {
    if (confirm('Are you sure you want to delete this record?')) {
        try {
            const recordRef = ref(db, `trainingRecords/${recordId}`);
            await remove(recordRef);
        } catch (error) {
            alert('Error deleting record: ' + error.message);
        }
    }
};

function updateFilters() {
    const companies = [...new Set(allRecords.map(r => r.company))].sort();
    const trainingTypes = [...new Set(allRecords.map(r => r.trainingType))].sort();

    const companyFilter = document.getElementById('companyFilter');
    const trainingTypeFilter = document.getElementById('trainingTypeFilter');

    companyFilter.innerHTML = '<option value="">All Companies</option>';
    companies.forEach(company => {
        const option = document.createElement('option');
        option.value = company;
        option.textContent = company;
        companyFilter.appendChild(option);
    });

    trainingTypeFilter.innerHTML = '<option value="">All Training Types</option>';
    trainingTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        trainingTypeFilter.appendChild(option);
    });
}

function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const companyFilter = document.getElementById('companyFilter').value;
    const trainingTypeFilter = document.getElementById('trainingTypeFilter').value;

    const filteredRecords = allRecords.filter(record => {
        const matchesSearch = !searchTerm || 
            record.personName.toLowerCase().includes(searchTerm) ||
            record.company.toLowerCase().includes(searchTerm) ||
            record.trainingType.toLowerCase().includes(searchTerm);
        
        const matchesCompany = !companyFilter || record.company === companyFilter;
        const matchesTrainingType = !trainingTypeFilter || record.trainingType === trainingTypeFilter;

        return matchesSearch && matchesCompany && matchesTrainingType;
    });

    displayRecords(filteredRecords);
}

document.getElementById('searchInput').addEventListener('input', applyFilters);
document.getElementById('companyFilter').addEventListener('change', applyFilters);
document.getElementById('trainingTypeFilter').addEventListener('change', applyFilters);
document.getElementById('clearFiltersBtn').addEventListener('click', () => {
    document.getElementById('searchInput').value = '';
    document.getElementById('companyFilter').value = '';
    document.getElementById('trainingTypeFilter').value = '';
    displayRecords(allRecords);
});

async function checkExpirations() {
    const settingsRef = ref(db, 'settings/notifications');
    const snapshot = await get(settingsRef);
    
    if (!snapshot.exists()) return;
    
    const settings = snapshot.val();
    const intervals = settings.intervals || [];
    const today = new Date();

    allRecords.forEach(async record => {
        const daysToExpiration = calculateDaysToExpiration(record.expiryDate);
        
        if (intervals.includes(daysToExpiration)) {
            const notificationRef = ref(db, `notifications/${record.id}_${daysToExpiration}`);
            const notifSnapshot = await get(notificationRef);
            
            if (!notifSnapshot.exists()) {
                await set(notificationRef, {
                    recordId: record.id,
                    personName: record.personName,
                    trainingType: record.trainingType,
                    company: record.company,
                    daysToExpiration: daysToExpiration,
                    expiryDate: record.expiryDate,
                    timestamp: today.toISOString(),
                    sent: false
                });
            }
        }
    });
}
