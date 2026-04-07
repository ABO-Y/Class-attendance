/* ===== Authentication Module ===== */

// Demo user credentials - Students, Lecturers, and Admin
const DEMO_USERS = {
    // Students - login with student number
    '222028866': {
        password: 'student123',
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
        password: 'lecturer123',
        role: 'lecturer',
        name: 'Dr. Ebuke Onyeka',
        id: 'L001'
    },
    'L002': {
        password: 'smith456',
        role: 'lecturer',
        name: 'Dr. James Smith',
        id: 'L002'
    },
    'L003': {
        password: 'kamenye789',
        role: 'lecturer',
        name: 'Dr. Kamenye Naomi',
        id: 'L003'
    },
    'L004': {
        password: 'fiavana321',
        role: 'lecturer',
        name: 'Dr. Fiavana Denilson',
        id: 'L004'
    },
    
    // Admin
    'admin': {
        password: 'admin123',
        role: 'admin',
        name: 'System Administrator',
        id: 'ADM001'
    }
};

// Student to Module mapping - which modules each student is enrolled in
const STUDENT_MODULES = {
    '222028866': ['PRG611S', 'ITA611S', 'DSA611S'],      // Gowaseb Immanuel
    '223045756': ['PRG611S', 'ITA611S', 'DSA611S'],      // Ebuke Onyeka
    '223052574': ['PRG611S', 'ITA611S', 'WEB611S'],      // Undamuje Kahiiko
    '221019855': ['PRG611S', 'ITA611S', 'WEB611S']       // Kamenye Naomi
};

// Module details
const MODULE_DETAILS = {
    'PRG611S': {
        name: 'Introduction to Software Engineering',
        lecturer: 'Dr. Ebuke Onyeka',
        lecturerId: 'L001'
    },
    'ITA611S': {
        name: 'IT Architectures',
        lecturer: 'Dr. James Smith',
        lecturerId: 'L002'
    },
    'DSA611S': {
        name: 'Data Structures & Algorithms',
        lecturer: 'Dr. Kamenye Naomi',
        lecturerId: 'L003'
    },
    'WEB611S': {
        name: 'Web Application Development',
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
        const user = DEMO_USERS[username];
        
        if (!user) {
            return { success: false, message: 'User not found' };
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
