# DateScape

A full-stack web application for discovering, sharing and reviewing dating locations.

## Overview
DateScape allows users to:
- Create an account and authenticate securely
- Add favorite locations
- Browse and review places shared by other users
- Save locations to favorites
- View locations on an interactive map

## Features
- User authentication (session-based)
- Protected routes and authorization
- CRUD operations for locations
- Review system
- Favorites functionality
- Image upload support
- Interactive map integration

## Tech Stack
Frontend:
- React
- TypeScript
- Tailwind CSS

Backend:
- Node.js
- Express

Database:
- MongoDB

Services:
- Passport.js
- Cloudinary
- MapTiler

## Architecture
Client (React)
↓
REST API (Express)
↓
MongoDB
↓
External Services:
Cloudinary + MapTiler

## Installation

Clone the repositories:

git clone <frontend-repo-url>
git clone <backend-repo-url>

Install dependencies:

npm install

Create .env file:

PORT=
MONGO_URI=
SESSION_SECRET=
CLOUDINARY_KEY=
MAPTILER_KEY=

Run application:

npm run dev

## Screenshots
Home Page
<img width="320" height="180" alt="DateScape_Home" src="https://github.com/user-attachments/assets/59cf2a37-f9a6-44cd-9dc4-ebb18170daf6" />
Signup Page
<img width="320" height="180" alt="DateScape_Signup" src="https://github.com/user-attachments/assets/a24ba2df-25ab-45c1-8c83-4880711aabb3" />
Interactive Map
<img width="320" height="180" alt="DateScape_Map" src="https://github.com/user-attachments/assets/7d7457c2-92ee-490d-aa75-012f302a51ac" />
Locations Page
<img width="320" height="180" alt="DateScape_Locations2" src="https://github.com/user-attachments/assets/6565bf02-3db2-4b39-979e-10371db08752" />
Location View Page
<img width="320" height="180" alt="DateScape_LocationView" src="https://github.com/user-attachments/assets/172e76f0-ac4f-493d-a4be-623a8154afaf" />
Location Creation Modal
<img width="320" height="180" alt="DateScape_CreationModal" src="https://github.com/user-attachments/assets/0190b337-4207-42c6-93a2-e2183c88a2f3" />

## Challenges Solved
- Session authentication in production
- Secure CORS configuration
- Route protection
- Integrating geospatial data with backend resources

## Demo Video:
Add Loom link

## Author
Daniel Hazan
