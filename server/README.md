# DateScape Server Side

This README provides details about the server-side implementation of the DateScape application. The backend is built using Node.js with Express.js for handling requests, MongoDB as the database, and Passport.js for authentication.

## Features

### Routing

**User Router:** Handles user-related operations such as registration, login, and user profile management.

**Reviews Router:** Manages operations related to reviews, including adding, editing, and retrieving reviews for specific locations.

**Locations Router:** Handles CRUD operations for locations, including fetching, adding, updating, and deleting locations.

### Authentication

**Passport.js:** Used for user authentication with strategies for:

**Registration:** Securely register new users.

**Login:** Authenticate existing users and maintain sessions.

### Database

**MongoDB:** Stores all application data, including:

**Users:** User profiles, authentication data, and preferences.

**Locations:** Details about submitted locations.

**Reviews:** User-submitted reviews for specific locations.

### Project Structure

**Routers:**

**userRouter.js:** Handles user-related routes.

**reviewsRouter.js:** Manages review-related routes.

**locationsRouter.js:** Deals with location-related routes.

**Middleware:**

Passport.js for authentication.

Custom middleware for error handling, route protection, validate reviews and locations creation.

**Database Models:**

**User:** Schema for user profiles and authentication data.

**Location:** Schema for location data, including coordinates and descriptions.

**Review:** Schema for user reviews linked to specific locations.

### API Endpoints

**User Routes**

POST /api/auth/register: Register a new user.

POST /api/auth/login: Authenticate a user.

GET /api/auth/login: Authenticate a user.

**Location Routes**

GET /api/locations: Fetch all locations.

POST /api/locations: Add a new location.

GET /api/locations/:id: Fetch a specific location by ID.

PUT /api/locations/:id: Update a location by ID.

DELETE /api/locations/:id: Delete a location by ID.

**Review Routes**

POST /api/reviews: Add a new review.

DELETE /api/reviews/:reviewsId: Delete a review by ID.
