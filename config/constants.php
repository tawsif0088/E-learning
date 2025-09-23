<?php
define('SITE_NAME', 'Interactive e-Learning System');
define('SITE_URL', 'http://localhost/elearning-system');
define('ADMIN_EMAIL', 'admin@elearning.local');

// Security settings
define('SESSION_TIMEOUT', 1800);
define('PASSWORD_MIN_LENGTH', 8);

// File upload settings  
define('MAX_FILE_SIZE', 10485760); // 10MB
define('ALLOWED_FILE_TYPES', ['pdf', 'doc', 'docx', 'txt']);

// Points system
define('POINTS_ASSIGNMENT_SUBMIT', 10);
define('POINTS_PEER_REVIEW', 5);
define('POINTS_FORUM_POST', 2);
?>