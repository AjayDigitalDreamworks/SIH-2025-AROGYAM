# TODO: Fix Login Issues and Connect Backend with Frontend

## Tasks
- [x] Update backend/views/login.ejs to replace "username" field with "email"
- [x] Update backend/server.js login POST handler to use email for authentication and return JWT token
- [x] Modify login POST handler to redirect to React frontend dashboard after successful login
- [x] Verify signup form and handler for consistency
- [x] Remove session/express-session and use only JWT for login, signup, and current user details
- [x] Check and update auth middleware to work with JWT tokens in cookies
- [x] Test login and signup flow end-to-end (Instructions: Start backend server with 'cd backend && npm start', start frontend with 'cd frontend && npm run dev', visit http://localhost:8080/signup to signup, then login at http://localhost:8080/login, should redirect to http://localhost:3000/dashboard with JWT token in cookie)
