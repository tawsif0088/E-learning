// ========== GLOBAL VARIABLES ========== 
let currentUser = {
    id: null,
    name: '',
    role: 'student', // Can be 'admin', 'instructor', 'student'
    email: '',
    points: 0,
    isLoggedIn: false
};

let currentPage = 'dashboard';
let notifications = [];
let isLoggedIn = false;

// ========== PAGE INITIALIZATION ========== 
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkLoginStatus();

    if (!isLoggedIn) {
        showLoginForm();
    } else {
        initializeApp();
    }

    initializeEventListeners();
});

function checkLoginStatus() {
    // Check localStorage for login status
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        currentUser = JSON.parse(userData);
        isLoggedIn = true;
        hideLoginForm();
    }
}

function showLoginForm() {
    document.getElementById('loginContainer').style.display = 'flex';
    document.body.classList.add('login-active');
}

function hideLoginForm() {
    document.getElementById('loginContainer').style.display = 'none';
    document.body.classList.remove('login-active');
}

function initializeApp() {
    // Set user name in navbar
    document.getElementById('currentUserName').textContent = currentUser.name;

    loadSidebarMenu();
    loadDashboard();

    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// ========== LOGIN FUNCTIONALITY ========== 
function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('loginRole').value;

    if (username && password) {
        // Simulate login - in real app, this would make an API call
        currentUser = {
            id: 1,
            name: username.includes('@') ? username.split('@')[0] : username,
            role: role,
            email: username.includes('@') ? username : `${username}@example.com`,
            points: Math.floor(Math.random() * 200) + 50,
            isLoggedIn: true
        };

        // Store in localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        isLoggedIn = true;
        hideLoginForm();
        initializeApp();

        showAlert('Login successful! Welcome back.', 'success');
    } else {
        showAlert('Please enter username and password.', 'danger');
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = { id: null, name: '', role: 'student', email: '', points: 0, isLoggedIn: false };
    isLoggedIn = false;
    showLoginForm();
    showAlert('You have been logged out.', 'info');
}

// ========== SIDEBAR MENU MANAGEMENT ========== 
function loadSidebarMenu() {
    const menuItems = getMenuItemsByRole(currentUser.role);
    const sidebarMenu = document.getElementById('sidebarMenu');

    sidebarMenu.innerHTML = menuItems.map(item => `
        <li>
            <a href="#${item.page}" class="${item.page === currentPage ? 'active' : ''}" 
               onclick="navigateTo('${item.page}')">
                <i class="${item.icon}"></i>
                <span>${item.label}</span>
            </a>
        </li>
    `).join('');
}

function getMenuItemsByRole(role) {
    const commonItems = [
        { page: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
        { page: 'profile', label: 'Profile', icon: 'fas fa-user' }
    ];

    const roleSpecificItems = {
        admin: [
            { page: 'users', label: 'Manage Users', icon: 'fas fa-users' },
            { page: 'courses', label: 'All Courses', icon: 'fas fa-book' },
            { page: 'analytics', label: 'Analytics', icon: 'fas fa-chart-line' },
            { page: 'settings', label: 'System Settings', icon: 'fas fa-cog' }
        ],
        instructor: [
            { page: 'my-courses', label: 'My Courses', icon: 'fas fa-chalkboard-teacher' },
            { page: 'create-course', label: 'Create Course', icon: 'fas fa-plus-circle' },
            { page: 'assignments', label: 'Assignments', icon: 'fas fa-tasks' },
            { page: 'peer-reviews', label: 'Peer Reviews', icon: 'fas fa-user-friends' },
            { page: 'gradebook', label: 'Gradebook', icon: 'fas fa-clipboard-list' }
        ],
        student: [
            { page: 'my-courses', label: 'My Courses', icon: 'fas fa-book-open' },
            { page: 'assignments', label: 'Assignments', icon: 'fas fa-file-alt' },
            { page: 'peer-reviews', label: 'Peer Reviews', icon: 'fas fa-users' },
            { page: 'forums', label: 'Discussion Forums', icon: 'fas fa-comments' },
            { page: 'achievements', label: 'Achievements', icon: 'fas fa-trophy' }
        ]
    };

    return [...commonItems, ...roleSpecificItems[role]];
}

// ========== NAVIGATION ========== 
function navigateTo(page) {
    currentPage = page;
    updateActiveMenuItem();
    loadPageContent(page);
}

function updateActiveMenuItem() {
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentPage}`) {
            link.classList.add('active');
        }
    });
}

function loadPageContent(page) {
    const pageContent = document.getElementById('pageContent');
    pageContent.innerHTML = '<div class="spinner"></div>';

    setTimeout(() => {
        switch(page) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'my-courses':
                loadMyCourses();
                break;
            case 'assignments':
                loadAssignments();
                break;
            case 'peer-reviews':
                loadPeerReviews();
                break;
            case 'forums':
                loadForums();
                break;
            case 'achievements':
                loadAchievements();
                break;
            case 'profile':
                loadProfile();
                break;
            case 'create-course':
                loadCreateCourse();
                break;
            case 'analytics':
                loadAnalytics();
                break;
            case 'users':
                loadUserManagement();
                break;
            case 'settings':
                loadSystemSettings();
                break;
            default:
                loadDashboard();
        }
    }, 500);
}

// ========== PAGE CONTENT LOADERS ========== 
function loadDashboard() {
    const content = `
        <div class="row mb-4">
            <div class="col-12">
                <h2 class="fade-in">Welcome back, ${currentUser.name}!</h2>
                <p class="text-muted">Here's what's happening in your courses today.</p>
            </div>
        </div>

        <div class="row mb-4">
            <div class="col-lg-3 col-md-6 mb-3">
                <div class="stats-card">
                    <h3>4</h3>
                    <p>Active Courses</p>
                    <i class="fas fa-book-open position-absolute" style="top: 15px; right: 15px; opacity: 0.3; font-size: 2rem;"></i>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 mb-3">
                <div class="stats-card warning">
                    <h3>3</h3>
                    <p>Pending Assignments</p>
                    <i class="fas fa-clock position-absolute" style="top: 15px; right: 15px; opacity: 0.3; font-size: 2rem;"></i>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 mb-3">
                <div class="stats-card success">
                    <h3>2</h3>
                    <p>Peer Reviews</p>
                    <i class="fas fa-users position-absolute" style="top: 15px; right: 15px; opacity: 0.3; font-size: 2rem;"></i>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 mb-3">
                <div class="stats-card danger">
                    <h3>${currentUser.points}</h3>
                    <p>Total Points</p>
                    <i class="fas fa-star position-absolute" style="top: 15px; right: 15px; opacity: 0.3; font-size: 2rem;"></i>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-8">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0"><i class="fas fa-calendar-alt me-2"></i>Upcoming Assignments</h5>
                    </div>
                    <div class="card-body">
                        <div class="assignment-item">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6>Database Design Project</h6>
                                    <p class="text-muted mb-1">CS 301 - Database Systems</p>
                                    <span class="assignment-due soon">Due in 2 days</span>
                                </div>
                                <button class="btn btn-primary btn-sm" onclick="openSubmissionModal()">
                                    Submit
                                </button>
                            </div>
                        </div>
                        <div class="assignment-item">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6>React Components Analysis</h6>
                                    <p class="text-muted mb-1">CS 405 - Web Development</p>
                                    <span class="assignment-due">Due in 5 days</span>
                                </div>
                                <button class="btn btn-outline-primary btn-sm">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-4">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0"><i class="fas fa-trophy me-2"></i>Recent Achievements</h5>
                    </div>
                    <div class="card-body text-center">
                        <div class="achievement-badge">
                            <i class="fas fa-medal"></i>
                        </div>
                        <h6>Assignment Master</h6>
                        <p class="text-muted small">Submitted 10 assignments on time</p>
                    </div>
                </div>

                <div class="card mt-3">
                    <div class="card-header">
                        <h5 class="mb-0"><i class="fas fa-chart-line me-2"></i>Progress Overview</h5>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <div class="d-flex justify-content-between">
                                <span>Database Systems</span>
                                <span>85%</span>
                            </div>
                            <div class="progress">
                                <div class="progress-bar bg-success" style="width: 85%"></div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="d-flex justify-content-between">
                                <span>Web Development</span>
                                <span>72%</span>
                            </div>
                            <div class="progress">
                                <div class="progress-bar bg-info" style="width: 72%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('pageContent').innerHTML = content;
}

function loadMyCourses() {
    const content = `
        <div class="row mb-4">
            <div class="col-12">
                <h2>My Courses</h2>
                <p class="text-muted">Manage your enrolled courses and track your progress.</p>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-4 col-md-6">
                <div class="course-card">
                    <div class="course-header">
                        <div class="course-code">CS 301</div>
                        <h5>Database Systems</h5>
                        <p class="mb-0">Dr. Sarah Johnson</p>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <div class="d-flex justify-content-between mb-1">
                                <span>Progress</span>
                                <span>85%</span>
                            </div>
                            <div class="progress">
                                <div class="progress-bar bg-success" style="width: 85%"></div>
                            </div>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span><i class="fas fa-users me-1"></i> 45 students</span>
                            <span><i class="fas fa-calendar me-1"></i> 12 weeks</span>
                        </div>
                        <div class="d-flex gap-2">
                            <button class="btn btn-primary btn-sm flex-fill">Enter Course</button>
                            <button class="btn btn-outline-secondary btn-sm">
                                <i class="fas fa-chart-line"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-4 col-md-6">
                <div class="course-card">
                    <div class="course-header">
                        <div class="course-code">CS 405</div>
                        <h5>Web Development</h5>
                        <p class="mb-0">Prof. Michael Chen</p>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <div class="d-flex justify-content-between mb-1">
                                <span>Progress</span>
                                <span>72%</span>
                            </div>
                            <div class="progress">
                                <div class="progress-bar bg-info" style="width: 72%"></div>
                            </div>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span><i class="fas fa-users me-1"></i> 38 students</span>
                            <span><i class="fas fa-calendar me-1"></i> 10 weeks</span>
                        </div>
                        <div class="d-flex gap-2">
                            <button class="btn btn-primary btn-sm flex-fill">Enter Course</button>
                            <button class="btn btn-outline-secondary btn-sm">
                                <i class="fas fa-chart-line"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('pageContent').innerHTML = content;
}

function loadAssignments() {
    const content = `
        <div class="row mb-4">
            <div class="col-12">
                <h2>Assignments</h2>
                <p class="text-muted">View and manage your assignment submissions.</p>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Assignment</th>
                                <th>Course</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Grade</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <strong>Database Design Project</strong>
                                    <br><small class="text-muted">Design and implement a relational database</small>
                                </td>
                                <td>CS 301</td>
                                <td>
                                    <span class="text-danger">
                                        <i class="fas fa-clock me-1"></i>
                                        Sep 22, 2025
                                    </span>
                                </td>
                                <td><span class="badge bg-warning">Pending</span></td>
                                <td>-</td>
                                <td>
                                    <button class="btn btn-primary btn-sm" onclick="openSubmissionModal()">
                                        Submit
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>Binary Tree Implementation</strong>
                                    <br><small class="text-muted">Implement various binary tree operations</small>
                                </td>
                                <td>CS 302</td>
                                <td>Sep 15, 2025</td>
                                <td><span class="badge bg-success">Submitted</span></td>
                                <td><strong>88/100</strong></td>
                                <td>
                                    <button class="btn btn-outline-secondary btn-sm">View</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    document.getElementById('pageContent').innerHTML = content;
}

function loadPeerReviews() {
    const content = `
        <div class="row mb-4">
            <div class="col-12">
                <h2>Peer Reviews</h2>
                <p class="text-muted">Review your peers' work and view reviews of your submissions.</p>
            </div>
        </div>

        <div class="review-card">
            <div class="review-status pending">Pending Review</div>
            <h6>Database Design Project - Anonymous Submission</h6>
            <p class="text-muted">CS 301 - Database Systems</p>
            <p>Review this student's database design and provide constructive feedback on their ER diagram and normalization approach.</p>
            <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">Due: Sep 24, 2025</small>
                <button class="btn btn-success btn-sm" onclick="openPeerReviewModal()">
                    Start Review
                </button>
            </div>
        </div>

        <div class="review-card">
            <div class="review-status completed">Completed</div>
            <h6>Binary Tree Implementation Review</h6>
            <p class="text-muted">CS 302 - Data Structures</p>
            <div class="row">
                <div class="col-md-6">
                    <strong>Your Rating:</strong>
                    <div class="rating-stars">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="far fa-star"></i>
                        <span class="ms-2">4.0/5.0</span>
                    </div>
                </div>
                <div class="col-md-6">
                    <small class="text-muted">Reviewed on: Sep 16, 2025</small>
                </div>
            </div>
        </div>
    `;
    document.getElementById('pageContent').innerHTML = content;
}

function loadForums() {
    const content = `
        <div class="row mb-4">
            <div class="col-12">
                <h2>Discussion Forums</h2>
                <p class="text-muted">Engage with your classmates and instructors in course discussions.</p>
            </div>
        </div>

        <div class="forum-post">
            <div class="post-meta">
                <span class="post-author">Dr. Sarah Johnson</span> • 
                <span>CS 301 - Database Systems</span> • 
                <span>2 hours ago</span>
                <span class="badge bg-success ms-2">Instructor</span>
            </div>
            <h6>Database Normalization Best Practices</h6>
            <p>I wanted to share some additional resources on database normalization that might help with your upcoming project...</p>
            <div class="vote-buttons">
                <button class="vote-btn">
                    <i class="fas fa-thumbs-up me-1"></i> 15
                </button>
                <button class="vote-btn">
                    <i class="fas fa-reply me-1"></i> Reply
                </button>
            </div>
        </div>

        <div class="forum-post reply">
            <div class="post-meta">
                <span class="post-author">Alice Smith</span> • 
                <span>1 hour ago</span>
            </div>
            <p>Thank you for sharing this! I was struggling with understanding when to use 3NF vs BCNF.</p>
            <div class="vote-buttons">
                <button class="vote-btn">
                    <i class="fas fa-thumbs-up me-1"></i> 8
                </button>
                <button class="vote-btn">
                    <i class="fas fa-reply me-1"></i> Reply
                </button>
            </div>
        </div>
    `;
    document.getElementById('pageContent').innerHTML = content;
}

function loadAchievements() {
    const content = `
        <div class="row mb-4">
            <div class="col-12">
                <h2>Achievements & Leaderboard</h2>
                <p class="text-muted">Track your progress and see how you compare with your peers.</p>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-8">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0"><i class="fas fa-trophy me-2"></i>Your Achievements</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-4 text-center mb-4">
                                <div class="achievement-badge">
                                    <i class="fas fa-medal"></i>
                                </div>
                                <h6>Assignment Master</h6>
                                <p class="text-muted small">Submitted 10 assignments on time</p>
                                <span class="badge bg-success">Earned</span>
                            </div>
                            <div class="col-md-4 text-center mb-4">
                                <div class="achievement-badge">
                                    <i class="fas fa-users"></i>
                                </div>
                                <h6>Peer Reviewer</h6>
                                <p class="text-muted small">Completed 5 peer reviews</p>
                                <span class="badge bg-success">Earned</span>
                            </div>
                            <div class="col-md-4 text-center mb-4">
                                <div class="achievement-badge" style="opacity: 0.5;">
                                    <i class="fas fa-crown"></i>
                                </div>
                                <h6>Discussion Leader</h6>
                                <p class="text-muted small">Start 10 forum discussions</p>
                                <span class="badge bg-secondary">3/10</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-4">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0"><i class="fas fa-list-ol me-2"></i>Leaderboard</h5>
                    </div>
                    <div class="card-body">
                        <div class="leaderboard-item" style="background: #e3f2fd;">
                            <div class="rank-number">1</div>
                            <div class="flex-grow-1">
                                <strong>You (${currentUser.name})</strong>
                                <div class="text-muted small">${currentUser.points} points</div>
                            </div>
                            <div class="text-end">
                                <i class="fas fa-user text-primary"></i>
                            </div>
                        </div>
                        <div class="leaderboard-item">
                            <div class="rank-number second">2</div>
                            <div class="flex-grow-1">
                                <strong>Sarah Wilson</strong>
                                <div class="text-muted small">140 points</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('pageContent').innerHTML = content;
}

function loadProfile() {
    const content = `
        <div class="row mb-4">
            <div class="col-12">
                <h2>Profile Settings</h2>
                <p class="text-muted">Manage your account information and preferences.</p>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-4">
                <div class="card text-center">
                    <div class="card-body">
                        <div class="mb-3">
                            <img src="https://via.placeholder.com/120x120/3498db/ffffff?text=${currentUser.name.charAt(0)}" 
                                 class="rounded-circle" alt="Profile Picture" width="120" height="120">
                        </div>
                        <h5>${currentUser.name}</h5>
                        <p class="text-muted">${currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}</p>
                        <p class="text-muted">${currentUser.email}</p>
                        <button class="btn btn-primary">Change Photo</button>
                    </div>
                </div>
            </div>

            <div class="col-lg-8">
                <div class="card">
                    <div class="card-header">
                        <h6 class="mb-0">Personal Information</h6>
                    </div>
                    <div class="card-body">
                        <form>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">First Name</label>
                                    <input type="text" class="form-control" value="${currentUser.name.split(' ')[0] || ''}">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Last Name</label>
                                    <input type="text" class="form-control" value="${currentUser.name.split(' ')[1] || ''}">
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" value="${currentUser.email}">
                            </div>
                            <button type="submit" class="btn btn-primary" onclick="updateProfile(event)">Save Changes</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('pageContent').innerHTML = content;
}

function loadCreateCourse() {
    const content = `
        <div class="row mb-4">
            <div class="col-12">
                <h2>Create New Course</h2>
                <p class="text-muted">Set up a new course with lessons, assignments, and peer review activities.</p>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <form id="newCourseForm">
                    <div class="row">
                        <div class="col-md-8 mb-3">
                            <label class="form-label">Course Title</label>
                            <input type="text" class="form-control" name="title" placeholder="Enter course title" required>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label">Course Code</label>
                            <input type="text" class="form-control" name="code" placeholder="e.g., CS101" required>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Description</label>
                        <textarea class="form-control" rows="4" name="description" placeholder="Course description and objectives" required></textarea>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Category</label>
                            <select class="form-select" name="category" required>
                                <option value="">Select category</option>
                                <option value="computer-science">Computer Science</option>
                                <option value="mathematics">Mathematics</option>
                                <option value="physics">Physics</option>
                                <option value="chemistry">Chemistry</option>
                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Max Enrollment</label>
                            <input type="number" class="form-control" name="maxEnrollment" placeholder="50" value="50">
                        </div>
                    </div>

                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-primary">Create Course</button>
                        <button type="button" class="btn btn-secondary">Save as Draft</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.getElementById('pageContent').innerHTML = content;

    // Add form submit handler
    document.getElementById('newCourseForm').addEventListener('submit', function(e) {
        e.preventDefault();
        createCourse();
    });
}

function loadAnalytics() {
    const content = `
        <div class="row mb-4">
            <div class="col-12">
                <h2>Analytics Dashboard</h2>
                <p class="text-muted">System-wide analytics and performance metrics.</p>
            </div>
        </div>

        <div class="row mb-4">
            <div class="col-lg-3 col-md-6 mb-3">
                <div class="stats-card">
                    <h3>1,247</h3>
                    <p>Total Users</p>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 mb-3">
                <div class="stats-card success">
                    <h3>45</h3>
                    <p>Active Courses</p>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 mb-3">
                <div class="stats-card warning">
                    <h3>328</h3>
                    <p>Assignments</p>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 mb-3">
                <div class="stats-card danger">
                    <h3>892</h3>
                    <p>Peer Reviews</p>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-8">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">User Activity Overview</h5>
                    </div>
                    <div class="card-body">
                        <canvas id="activityChart" width="400" height="200"></canvas>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Course Completion Rates</h5>
                    </div>
                    <div class="card-body">
                        <canvas id="completionChart" width="200" height="200"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('pageContent').innerHTML = content;

    setTimeout(() => {
        if (currentPage === 'analytics') {
            initializeCharts();
        }
    }, 100);
}

function loadUserManagement() {
    const content = `
        <div class="row mb-4">
            <div class="col-12">
                <h2>User Management</h2>
                <p class="text-muted">Manage system users and their permissions.</p>
            </div>
        </div>

        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">All Users</h5>
                <button class="btn btn-primary btn-sm">Add New User</button>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Last Login</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Sarah Johnson</td>
                                <td>sarah.johnson@university.edu</td>
                                <td><span class="badge bg-success">Instructor</span></td>
                                <td><span class="badge bg-success">Active</span></td>
                                <td>2 hours ago</td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary">Edit</button>
                                    <button class="btn btn-sm btn-outline-danger">Disable</button>
                                </td>
                            </tr>
                            <tr>
                                <td>${currentUser.name}</td>
                                <td>${currentUser.email}</td>
                                <td><span class="badge bg-info">${currentUser.role}</span></td>
                                <td><span class="badge bg-success">Active</span></td>
                                <td>Now</td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary">Edit</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    document.getElementById('pageContent').innerHTML = content;
}

function loadSystemSettings() {
    const content = `
        <div class="row mb-4">
            <div class="col-12">
                <h2>System Settings</h2>
                <p class="text-muted">Configure system-wide settings and preferences.</p>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-6">
                <div class="card">
                    <div class="card-header">
                        <h6 class="mb-0">General Settings</h6>
                    </div>
                    <div class="card-body">
                        <form>
                            <div class="mb-3">
                                <label class="form-label">System Name</label>
                                <input type="text" class="form-control" value="e-Learning System">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Admin Email</label>
                                <input type="email" class="form-control" value="admin@elearning.edu">
                            </div>
                            <div class="mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="enableRegistration" checked>
                                    <label class="form-check-label" for="enableRegistration">
                                        Allow user registration
                                    </label>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary">Save Settings</button>
                        </form>
                    </div>
                </div>
            </div>

            <div class="col-lg-6">
                <div class="card">
                    <div class="card-header">
                        <h6 class="mb-0">Peer Review Settings</h6>
                    </div>
                    <div class="card-body">
                        <form>
                            <div class="mb-3">
                                <label class="form-label">Minimum Reviews per Assignment</label>
                                <input type="number" class="form-control" value="3">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Review Deadline (days after submission)</label>
                                <input type="number" class="form-control" value="7">
                            </div>
                            <div class="mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="anonymousReviews" checked>
                                    <label class="form-check-label" for="anonymousReviews">
                                        Anonymous peer reviews
                                    </label>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary">Save Settings</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('pageContent').innerHTML = content;
}

// ========== EVENT LISTENERS ========== 
function initializeEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.getElementById('mainContent');
            sidebar.classList.toggle('show');
            mainContent.classList.toggle('expanded');
        });
    }

    // Notification bell
    const notificationBell = document.getElementById('notificationBell');
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            const dropdown = document.getElementById('notificationDropdown');
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
    }

    // Logout functionality
    document.addEventListener('click', function(e) {
        if (e.target && e.target.getAttribute('href') === '#logout') {
            e.preventDefault();
            logout();
        }
    });

    // Close notification dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const bell = document.getElementById('notificationBell');
        const dropdown = document.getElementById('notificationDropdown');
        if (bell && dropdown && !bell.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });

    // Handle responsive sidebar
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.getElementById('mainContent');
            if (sidebar) sidebar.classList.remove('show');
            if (mainContent) mainContent.classList.remove('expanded');
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('input[placeholder*="Search"]');
            if (searchInput) {
                searchInput.focus();
            }
        }

        // Escape to close modals/dropdowns
        if (e.key === 'Escape') {
            const dropdown = document.getElementById('notificationDropdown');
            if (dropdown) dropdown.style.display = 'none';
        }
    });
}

// ========== MODAL FUNCTIONS ========== 
function openSubmissionModal() {
    const modal = new bootstrap.Modal(document.getElementById('submissionModal'));
    modal.show();
}

function openPeerReviewModal() {
    const modal = new bootstrap.Modal(document.getElementById('peerReviewModal'));
    modal.show();
}

function openCourseModal() {
    const modal = new bootstrap.Modal(document.getElementById('courseModal'));
    modal.show();
}

// ========== FORM SUBMISSION FUNCTIONS ========== 
function submitAssignment() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('submissionModal'));
    modal.hide();
    showAlert('Assignment submitted successfully!', 'success');

    // Update UI to show submitted status
    setTimeout(() => {
        if (currentPage === 'dashboard' || currentPage === 'assignments') {
            loadPageContent(currentPage);
        }
    }, 1000);
}

function submitPeerReview() {
    const form = document.getElementById('peerReviewForm');
    const formData = new FormData(form);

    // Validate that all criteria are rated
    const requiredFields = ['contentQuality', 'organization', 'clarity', 'completeness'];
    let allFieldsValid = true;

    requiredFields.forEach(field => {
        if (!formData.get(field)) {
            allFieldsValid = false;
        }
    });

    if (!allFieldsValid) {
        showAlert('Please rate all criteria before submitting.', 'warning');
        return;
    }

    const modal = bootstrap.Modal.getInstance(document.getElementById('peerReviewModal'));
    modal.hide();
    showAlert('Peer review submitted successfully! Thank you for your feedback.', 'success');

    // Update points
    currentUser.points += 5;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    setTimeout(() => {
        if (currentPage === 'peer-reviews') {
            loadPageContent(currentPage);
        }
    }, 1000);
}

function createCourse() {
    const form = document.getElementById('courseForm');
    const formData = new FormData(form);

    // Basic validation
    const title = formData.get('courseTitle');
    const code = formData.get('courseCode');

    if (!title || !code) {
        showAlert('Please fill in all required fields.', 'warning');
        return;
    }

    const modal = bootstrap.Modal.getInstance(document.getElementById('courseModal'));
    modal.hide();
    showAlert('Course created successfully!', 'success');

    setTimeout(() => {
        navigateTo('my-courses');
    }, 1000);
}

function updateProfile(event) {
    event.preventDefault();
    showAlert('Profile updated successfully!', 'success');
}

// ========== CHART INITIALIZATION ========== 
function initializeCharts() {
    // Activity Chart
    const activityCtx = document.getElementById('activityChart');
    if (activityCtx) {
        new Chart(activityCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Active Users',
                    data: [120, 190, 300, 250, 220, 330],
                    borderColor: 'rgb(52, 152, 219)',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }

    // Completion Chart
    const completionCtx = document.getElementById('completionChart');
    if (completionCtx) {
        new Chart(completionCtx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'In Progress', 'Not Started'],
                datasets: [{
                    data: [65, 25, 10],
                    backgroundColor: [
                        'rgb(39, 174, 96)',
                        'rgb(243, 156, 18)',
                        'rgb(231, 76, 60)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                }
            }
        });
    }
}

// ========== UTILITY FUNCTIONS ========== 
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(alertDiv);

    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function calculateTimeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };

    for (const [unit, seconds] of Object.entries(intervals)) {
        const interval = Math.floor(diffInSeconds / seconds);
        if (interval > 0) {
            return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
        }
    }

    return 'Just now';
}