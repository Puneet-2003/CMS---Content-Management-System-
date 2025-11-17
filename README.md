Default Credential
admin@cms.com
admin123

Node.js + React CMS
A modern Content Management System built with Node.js/Express backend and React 18 admin panel, featuring JWT authentication, Sequelize ORM, and comprehensive content management capabilities.

Backend (Node.js + Express)
Node.js Runtime

Express.js Web Framework

JWT Authentication
Sequelize ORM with MySQL
File Upload handling with Multer
RESTful API with CRUD operations

Admin Panel (React 18)
React 18+ with Functional Components & Hooks
React Router for navigation
Context API for state management
Quill WYSIWYG Editor for rich content
Axios for API communication

Project Structure
cms-backend/

cms-backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── postController.js    # Posts CRUD
│   ├── pageController.js    # Pages CRUD
│   └── mediaController.js   # Media uploads
├── middleware/
│   ├── auth.js             # JWT verification
│   └── upload.js           # File upload handling
├── models/
│   ├── index.js            # Sequelize models index
│   ├── User.js             # User model
│   ├── Post.js             # Post model
│   ├── Page.js             # Page model
│   └── Media.js            # Media model
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── posts.js            # Post routes
│   ├── pages.js            # Page routes
│   └── media.js            # Media routes
├── uploads/                # File upload directory
├── .env                    # Environment variables
├── package.json
└── server.js              # Application entry point

my-cms-admin/
my-cms-admin/
├── src/
│   ├── components/
│   │   └── Layout.jsx      # Main layout component
│   ├── context/
│   │   └── AuthContext.jsx # Authentication state management
│   ├── pages/
│   │   ├── Login.jsx       # Login page
│   │   ├── Register.jsx    # Registration page
│   │   ├── Dashboard.jsx   # Admin dashboard
│   │   ├── Posts.jsx       # Posts list
│   │   ├── PostForm.jsx    # Create/Edit post
│   │   ├── PostView.jsx    # View single post
│   │   ├── Pages.jsx       # Pages list
│   │   ├── PageForm.jsx    # Create/Edit page
│   │   ├── PageView.jsx    # View single page
│   │   └── MediaManager.jsx # Media management
│   ├── services/
│   │   └── api.js          # API service functions
│   ├── App.jsx             # Main App component
│   ├── main.jsx            # Application entry point
│   └── App.css             # Styles
├── package.json
└── index.html

For Backend
cd cms-backend
npm install
Create .env file in the backend root:
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=1234
DB_NAME=cms_database

JWT_SECRET=puneet_8827688283@meena
JWT_EXPIRES_IN=3600
PORT=5000
Start Development Server
The backend will run on http://localhost:5000
terminal command to Run project ---npm run dev----

Frontend Setup (React)
cd my-cms-admin
npm install
npm run dev
The frontend will run on http://localhost:3000