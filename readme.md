Features
User registration and login with secure JWT authentication

Protected routes ensuring only authenticated users access sensitive pages

Portfolio management with live stock prices updating in real time

Order placement, modification, and cancellation with status updates

Real-time notifications for order events using Socket.io and toast alerts

Responsive UI with conditional rendering of navbar and headers

Deployment ready for backend and frontend on Render



Technologies Used
Backend: Node.js, Express.js, MongoDB, Mongoose, Socket.io

Frontend: React.js, React Router v6 (HashRouter in production), React Context, react-toastify

Styling: Tailwind CSS

Authentication: JWT tokens

Deployment: Render.com for hosting



Folder Structure
/backend         # Express.js backend code with routes & socket setup
/frontend        # React frontend app code
/components     # React components (LoginForm, RegistrationForm, Navbar, Dashboard, etc.)
server.js       # Backend entry point
.env            # Environment variables (not committed)


Getting Started
Backend Setup
1.Navigate to the backend folder and install dependencies:
cd backend
npm install


2.Create .env file with:
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
PORT=5000


3.Run backend server in development mode:
node server.js


4.To deploy on Render or other platforms, configure environment variables accordingly.



Frontend Setup

1.Navigate to the frontend folder and install dependencies:
cd frontend
npm install 

2.Run frontend in development mode:
npm start

Deployment Instructions
Backend
Push all backend code to GitHub.

Connect your GitHub backend repo to Render.

Create a new Web Service, set build command npm install, start command npm start.

Add your environment variables in Render dashboard.

Deploy and verify backend URL.

Frontend
Push frontend code to GitHub.

Connect frontend repo as a Static Site on Render.

Set build command npm install && npm run build.

Set publish directory to build.


Deploy and verify frontend URL.



Important Notes
Use HashRouter in production for React routing to avoid 404 errors on static hosting.

Ensure CORS in backend allows your frontend origin explicitly.

The backend emits real-time updates via Socket.io, and frontend listens to update UI and show notifications.

React Context manages authentication state across components.

Route guards protect sensitive pages from unauthorized access.