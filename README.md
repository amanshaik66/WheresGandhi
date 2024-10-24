WheresGandhi
Overview
WheresGandhi is a modern web and mobile application that allows users to efficiently manage their bills, track referrals, and access personalized dashboards. The project uses React for the frontend, Firebase for backend services (authentication, Firestore, and hosting), and React Native for mobile functionality.

This project follows corporate-level coding standards, with a clear folder structure, modular components, and automated CI/CD pipelines via GitHub Actions.
Project Structure

WheresGandhi/
│
├── frontend/            # React frontend for web interface
├── backend/             # Firebase functions for backend logic
├── mobile/              # React Native code for mobile app
├── database/            # Firebase database configuration
├── tests/               # Automated test files
├── documentation/       # Documentation files (guides, policies, terms)
├── deployment/          # Deployment scripts and CI/CD config
├── analytics/           # Analytics logic for tracking usage and trends
└── placeholder/         # Temporary notes and ideas

Features
1. Bill Management: Add, update, and track bills.
2. User Authentication: Login and signup with Firebase Authentication.
3. Role-Based Dashboard: Separate views for users and admins.
4. Referral Program: Track user referrals.
5. Mobile Support: Shared logic between web and mobile using React Native.
6. Analytics Integration: Track dashboard trends using analytics.
Installation & Setup
Prerequisites
Ensure you have the following installed:
- Node.js
- Firebase CLI
Install Firebase CLI with:
npm install -g firebase-tools
1. Clone the Repository
git clone https://github.com/your-repository/WheresGandhi.git
cd WheresGandhi
2. Install Dependencies
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
3. Configure Firebase
Ensure Firebase project keys are set in `/database/firebase-config.json` and `.env`.
4. Running the Project Locally
**Frontend (React):**
cd frontend
npm start

**Backend (Firebase Functions):**
cd backend
firebase emulators:start
Deployment
Manual Deployment (Firebase Hosting)
cd frontend
npm run build
firebase deploy
Automated Deployment (GitHub Actions)
Push to `main` branch to trigger automated deployment.
Running Tests
# Authentication tests
npm test auth.test.js

# Bill tracker tests
npm test billTracker.test.js

# Dashboard tests
npm test dashboard.test.js
Technologies Used
- React: Frontend development
- React Native: Mobile app development
- Firebase: Authentication, Firestore, Hosting
- Material-UI: Professional UI components
- GitHub Actions: Automated deployment pipelines
Contributing
We welcome contributions! Follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-branch`).
3. Commit changes (`git commit -m 'Add feature'`).
4. Push to branch (`git push origin feature-branch`).
5. Open a pull request.
License
This project is licensed under the MIT License. See the LICENSE file for details.
Contact
For questions, contact us at:
- Email: support@wheresgandhi.com
- GitHub Issues: https://github.com/your-repository/issues
