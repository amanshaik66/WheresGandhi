
Where's Gandhi - Track the Journey of Your Currency

Welcome to Where's Gandhi, an innovative platform that allows users to track the journey of their bills across regions and countries. Our application leverages Firebase for backend operations, user authentication, and Firestore database management. Whether you want to monitor personal expenses or share referrals with friends, our app provides everything you need to stay on top of your finances.

Table of Contents

Features
Tech Stack
Project Structure
Installation
Usage
Deployment
Contributing
License
Features
Currency Tracking: Monitor the movement and status of your bills.
User Authentication: Secure login and signup using Firebase Authentication.
Referral Program: Earn rewards by referring friends.
Bill Management: Add, update, and delete bills.
Mobile App: Cross-platform mobile app with React Native.
Dashboard Analytics: Track your expenses and see real-time trends.
Tech Stack
Frontend: React, React Router, Material-UI, React Toastify
Backend: Firebase Functions, Firestore
Mobile: React Native, Firebase Authentication
Database: Firebase Firestore
Hosting: Firebase Hosting
Testing: Jest, Firebase Emulator
Project Structure
WheresGandhi/
│
├── frontend/                  # Frontend React app
├── backend/                   # Firebase Functions and APIs
├── mobile/                    # Mobile app with React Native
├── database/                  # Firebase configuration files
├── tests/                     # Test cases for frontend and backend
├── documentation/             # Documentation files
├── analytics/                 # Analytics tracking logic
└── deployment/                # Deployment scripts

Installation
Prerequisites
Node.js installed on your machine
Firebase CLI installed
Expo Go (for mobile app testing)
Steps:
1. Clone the repository:
git clone https://github.com/your-repository/wheresgandhi.git
2. Install dependencies for the frontend:
cd frontend
npm install
3. Install dependencies for the backend:
cd ../backend
npm install
4. Start the Firebase emulator for backend testing:
firebase emulators:start
Usage
1. Frontend App:
cd frontend
npm start
The React app will be available at http://localhost:3000.
2. Mobile App: Install Expo Go and scan the QR code when running:
cd mobile
npm start
3. Run Tests:
npm test
Deployment
1. Deploy Backend:
firebase deploy --only functions
2. Deploy Frontend:
firebase deploy --only hosting
Contributing
We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a new branch:
git checkout -b feature-branch
3. Make your changes and commit:
git commit -m "Add new feature"
4. Push your changes:
git push origin feature-branch
5. Open a pull request.
License
This project is licensed under the MIT License. See the LICENSE file for more details.

Contact
For any inquiries or support, please contact us at support@wheresgandhi.com.
