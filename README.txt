# Booking Management System

This is a Node.js/Express backend project for managing bookings, slots, and users. It uses MongoDB (via Mongoose) and follows best practices with MVC, service, and middleware patterns. The project includes full unit test coverage and Swagger API documentation.

## Features
- User authentication and admin authorization
- Booking creation, update, patch, and deletion
- Slot management (create, update, delete, list)
- User management
- RESTful API structure
- Swagger (OpenAPI) documentation at `/api-docs`
- Unit tests for all major modules

## Project Structure
```
bookingmgmt/
├── app.js                  # Main Express app
├── package.json            # Project dependencies and scripts
├── src/
│   ├── controllers/        # Route controllers (business logic)
│   ├── middleware/         # Authentication/authorization middleware
│   ├── models/             # Mongoose models (Booking, Slot, User)
│   ├── routes/             # Express routers for API endpoints
│   ├── services/           # Service layer for business/data logic
│   └── swagger.js          # Swagger (OpenAPI) config
├── test/                   # Unit tests for all modules
└── data/                   # Sample/mock data (if any)
```

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB (local or remote)

### Installation
1. Clone the repository:
   ```
   git clone <your-repo-url>
   cd bookingmgmt
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Ensure MongoDB is running on `mongodb://localhost:27017/bookingsystem` (or update the connection string in `src/services/dbConnection.js`).

### Running the Application
```
npm start
```
The server will start on port 4000 (or as configured in your `app.js`).

### API Documentation
Swagger UI is available at: [http://localhost:4000/api-docs](http://localhost:4000/api-docs)

### Running Tests
```
npm test
```
Runs all unit tests in the `test/` directory using Mocha.

## Design Patterns Used
- **MVC (Model-View-Controller)**
- **Service Layer**
- **Middleware**
- **Singleton (Mongoose models)**
- **Factory (Router factory functions)**

## Adding/Editing API Endpoints
- Add new routes in `src/routes/`
- Implement business logic in `src/controllers/` and `src/services/`
- Add Swagger JSDoc comments above route handlers for documentation
