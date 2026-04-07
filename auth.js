/* ===== Authentication Module ===== */

// Demo user credentials - Students, Lecturers, and Admin
const DEMO_USERS = {
    // Students - login with student number
    '222028866': {
        password: 'gowaseb123',
        role: 'student',
        name: 'Gowaseb Immanuel',
        id: '222028866'
    },
    '223045756': {
        password: 'ebuke456',
        role: 'student',
        name: 'Ebuke Onyeka',
        id: '223045756'
    },
    '223052574': {
        password: 'kahiiko789',
        role: 'student',
        name: 'Undamuje Kahiiko',
        id: '223052574'
    },
    '221019855': {
        password: 'naomi321',
        role: 'student',
        name: 'Kamenye Naomi',
        id: '221019855'
    },
    
    // Lecturers - login with lecturer ID
    'L001': {
        password: 'ebuke123',
        role: 'lecturer',
        name: 'Master. Ebuke Onyeka',
        id: 'L001'
    },
    'L002': {
        password: 'smith456',
        role: 'lecturer',
        name: 'Mr. Daniel Smith',
        id: 'L002'
    },
    'L003': {
        password: 'kamenye789',
        role: 'lecturer',
        name: 'Miss. Kamenye Naomi',
        id: 'L003'
    },
    'L004': {
        password: 'fiavana321',
        role: 'lecturer',
        name: 'Dr. Fiavana Denilson',
        id: 'L004'
    },
    
    // Admin
    'ADMIN': {
        password: 'admin123',
        role: 'admin',
        name: 'System Administrator',
        id: 'ADM001'
    }
};

// Student to Module mapping - which modules each student is enrolled in
const STUDENT_MODULES = {
    '222028866': ['MAP7111S', 'SPS611S', 'DSA611S'],      // Gowaseb Immanuel
    '223045756': ['MAP7111S', 'SPS611S', 'DSA611S'],      // Ebuke Onyeka
    '223052574': ['MAP7111S', 'SPS611S', 'CTE611S'],      // Undamuje Kahiiko
    '221019855': ['MAP7111S', 'SPS611S', 'CTE611S']       // Kamenye Naomi
};

// Module details
const MODULE_DETAILS = {
    'MAP7111S': {
        name: 'Mobile Application Programming',
        lecturer: 'Master. Ebuke Onyeka',
        lecturerId: 'L001'
    },
    'SPS611S': {
        name: 'Software Process',
        lecturer: 'Mr. Daniel Smith',
        lecturerId: 'L002'
    },
    'DSA611S': {
        name: 'Data Structures & Algorithms',
        lecturer: 'Miss. Kamenye Naomi',
        lecturerId: 'L003'
    },
    'CTE611S': {
        name: 'Compiler Techniques',
        lecturer: 'Dr. Fiavana Denilson',
        lecturerId: 'L004'
    }
};

// Initialize session
class AuthManager {
    constructor() {
        this.currentUser = this.getStoredUser();
    }

    // Get stored user from session
    getStoredUser() {
        const userStr = sessionStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    }

    // Store user in session
    storeUser(user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser = user;
    }

    // Login function
    login(username, password) {
        const key = username.trim().toUpperCase();
        const user = DEMO_USERS[key];
        
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        
        if (password.length < 6) {
            return { success: false, message: 'Password must have at least 6 characters.' };
        }
        
        if (user.password !== password) {
            return { success: false, message: 'Incorrect password' };
        }

        this.storeUser(user);
        return { success: true, message: 'Login successful', user: user };
    }

    // Logout function
    logout() {
        sessionStorage.removeItem('currentUser');
        // Don't clear localStorage as attendance data should persist
        this.currentUser = null;
        window.location.href = 'index.html';
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Get user role
    getUserRole() {
        return this.currentUser ? this.currentUser.role : null;
    }

    // Verify access for specific role
    requiredRole(allowedRoles) {
        if (!this.isLoggedIn()) {
            window.location.href = 'index.html';
            return false;
        }
        
        if (!allowedRoles.includes(this.getUserRole())) {
            window.location.href = 'index.html';
            return false;
        }
        
        return true;
    }
}

// Initialize auth manager globally
const auth = new AuthManager();

// Render navbar with user info and logout button
function renderNavbar(title) {
    if (auth.isLoggedIn()) {
        const user = auth.getCurrentUser();
        const navbar = document.querySelector('.navbar');
        
        if (navbar) {
            navbar.innerHTML = `
                <div class="navbar-brand">NUST Attendance System</div>
                <div class="navbar-user">
                    <div class="user-info">
                        <strong>${user.name}</strong> (${user.role.toUpperCase()})
                    </div>
                    <button class="btn-logout" onclick="auth.logout()">Logout</button>
                </div>
            `;
        }
    }
}

// Redirect to home if not logged in
function checkAuth(requiredRole = null) {
    if (!auth.isLoggedIn()) {
        window.location.href = 'index.html';
        return false;
    }

    if (requiredRole && !Array.isArray(requiredRole)) {
        requiredRole = [requiredRole];
    }

    if (requiredRole && !requiredRole.includes(auth.getUserRole())) {
        window.location.href = 'index.html';
        return false;
    }

    return true;
}

// Format user display name
function formatUserDisplay() {
    if (auth.isLoggedIn()) {
        const user = auth.getCurrentUser();
        return `${user.name} (${user.id})`;
    }
    return 'Unknown User';
}

function saveAttendanceSession(moduleCode, attendanceData) {
    const historyKey = 'attendanceHistory_' + moduleCode;
    const existingHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
    existingHistory.unshift(attendanceData);
    localStorage.setItem(historyKey, JSON.stringify(existingHistory.slice(0, 20)));
    localStorage.setItem('attendanceData_' + moduleCode, JSON.stringify(attendanceData));
}

function getAttendanceHistory(moduleCode) {
    return JSON.parse(localStorage.getItem('attendanceHistory_' + moduleCode) || '[]');
}

function getLatestAttendance(moduleCode) {
    return JSON.parse(localStorage.getItem('attendanceData_' + moduleCode) || 'null');
}

function getModuleAverage(moduleCode) {
    const history = getAttendanceHistory(moduleCode);
    if (history.length === 0) return null;
    const total = history.reduce((sum, session) => sum + (session.percentage || 0), 0);
    return Math.round(total / history.length);
}

function formatTimestamp(timestamp) {
    if (!timestamp) return 'No data';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-hide');
        toast.addEventListener('transitionend', () => toast.remove());
    }, 3200);
}

