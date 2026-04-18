# 🏡 Nivaas Luxe - Property Rental Platform

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://nivaas-luxe.onrender.com)
[![Node.js](https://img.shields.io/badge/Node.js-v.20.15.1-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-Backend-black.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-blue.svg)](https://www.mongodb.com/)

Nivaas Luxe is a comprehensive and dynamic property rental web application. It allows users to list their properties, browse various property listings, read and leave reviews, and make bookings securely.

## ✨ Features

- **Property Listings:** View, create, edit, and delete property listings with detailed descriptions, prices, and locations.
- **User Authentication:** Secure user registration, login, and logout using `Passport.js`.
- **Interactive Maps:** Implemented `Mapbox SDK` to display precise property locations on an interactive map.
- **Image Uploads:** Seamless image storage and delivery handled through `Cloudinary` and `Multer`.
- **Review System:** Users can leave ratings and text reviews for properties they have visited.
- **Secure Bookings & Payments:** Integrated booking workflow with `Razorpay` for seamless transaction handling.
- **Responsive UI:** Dynamic and responsive frontend built using `EJS`, HTML, and CSS (with `ejs-mate` for layouts).

## 🛠️ Technology Stack

- **Frontend:** `EJS` (Embedded JavaScript Templates), HTML, CSS, Bootstrap
- **Backend:** `Node.js`, `Express.js`
- **Database:** `MongoDB` managed through `Mongoose` ORM
- **Authentication:** `Passport.js` (Local Strategy, Passport-Local-Mongoose)
- **Sessions:** `express-session`, `connect-mongo`
- **Cloud/External APIs:** `Cloudinary` (Image hosting), `Mapbox` (Geocoding), `Razorpay` (Payment Gateway)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas instance)
- Accounts for [Mapbox](https://www.mapbox.com/), [Cloudinary](https://cloudinary.com/), and [Razorpay](https://razorpay.com/) (to get API keys)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/Property-Rental-Platform-Project.git
   cd Property-Rental-Platform-Project
   ```

2. **Install NPM dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add the following variables. Replace the placeholders with your actual keys.
   ```ini
   NODE_ENV=development
   PORT=3000
   ATLASDB_URL=your_mongodb_connection_string
   SECRET=your_session_secret

   # Cloudinary Keys
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret

   # Mapbox Key
   MAP_TOKEN=your_mapbox_public_token
   
   # Razorpay Keys (Optional: if implementing local payment testing)
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```

4. **Initialize Database (Optional):**
   If you want to populate the database with some initial seed data, you can run the provided scripts:
   ```bash
   node seedTestData.js
   ```

5. **Start the server:**
   ```bash
   # For production mode
   npm start
   
   # For development mode with auto-reload (requires nodemon)
   npm run dev
   ```

6. **Access the Application:**
   Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```text
├── controllers/          # Route controller logic
├── init/                 # Database initialization/seed data
├── middleware/           # Custom Express middlewares
├── models/               # Mongoose database schemas (Listing, User, Review)
├── public/               # Static assets (CSS, JS, Images)
├── routes/               # Express router configurations
├── utils/                # Utility classes (Error handling, Async wrapping)
├── views/                # EJS templates and layouts
├── app.js                # Main application entry point
├── cloudConfig.js        # Cloudinary configuration
├── schema.js             # Joi validation schemas
└── package.json          # NPM dependencies and scripts
```

## 🔗 Links

- **Live Site:** [Nivaas Luxe](https://nivaas-luxe.onrender.com)
- **Author:** [Pratik](https://github.com/pratiktawhare) (Update with your relevant links)

## 📄 License

This project is licensed under the [ISC License](LICENSE).
