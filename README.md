# Interactive e-Learning & Peer Review System

## Setup Instructions

1. **Extract Files**: Unzip this archive to your web server directory (e.g., htdocs for XAMPP)

2. **Database Setup**: 
   - Import `database/schema.sql` into your MySQL database
   - Update database credentials in `config/database.php`

3. **File Structure**:
   ```
   elearning-system/
   ├── index.html          # Main application (standalone)
   ├── index.php           # PHP version entry point
   ├── login.php           # PHP login page
   ├── assets/
   │   ├── css/style.css   # All styles
   │   └── js/main.js      # All JavaScript
   ├── api/                # PHP API endpoints
   ├── config/             # Configuration files
   └── database/           # SQL schema
   ```

4. **Usage**:
   - Open `index.html` in browser for frontend-only demo
   - Use PHP files with web server for full functionality
   - Default admin login: admin@elearning.local / admin123

## Features

✅ Multi-role system (Admin, Instructor, Student)
✅ Course management and enrollment
✅ Assignment submission system
✅ Peer review workflow
✅ Discussion forums
✅ Achievement system and leaderboards
✅ Real-time notifications
✅ Responsive design
✅ Progress tracking

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Backend**: PHP 7.4+, MySQL 8.0+
- **Libraries**: Chart.js, Font Awesome

## Browser Compatibility

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

For support or customization, contact the development team.
