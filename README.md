Here’s a README template for the `ride-booking-backend` project based on the provided API endpoints:

---

# ride-booking-backend

## Introduction

The `ride-booking-backend` is a RESTful API that enables users to register, log in, and request or manage rides. It serves as the backend for a ride-booking application, allowing riders and drivers to interact with each other through various routes. Admins have the ability to manage users and rides on the platform. This project supports different roles, including rider, driver, and admin, with different endpoints for each role.

## Table of Contents

1. [API Endpoints](#api-endpoints)

   * [Authentication](#authentication)
   * [Rider Routes](#rider-routes)
   * [Driver Routes](#driver-routes)
   * [Admin Routes](#admin-routes)
   * [Error Handling](#error-handling)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Dependencies](#dependencies)
5. [License](#license)

## API Endpoints

### Authentication

#### `POST /auth/register`

* **Description:** Registers a new user (admin, rider, or driver).
* **Body:**

  ```json
  {
    "email": "newRider@example.com",
    "password": "password123",
    "role": "rider"
  }
  ```
* **Response:**

  ```json
  {
    "message": "User registered successfully",
    "user": {
        "email": "newRider@example.com",
        "password": "$2b$10$z/0575WA5wXj0/XqEPWLhuc9vGiRop85TZuavE68pMEWiptnCHeYe",
        "role": "rider",
        "isActive": true,
        "isDeleted": false,
        "isBlocked": false,
        "isOnline": false,
        "cost": 0,
        "earning": 0,
        "rides": [],
        "_id": "688a1cc852e9c4b2c1799a4a",
        "createdAt": "2025-07-30T13:23:20.796Z",
        "updatedAt": "2025-07-30T13:23:20.796Z",
        "__v": 0
    }
  }
  ```

#### `POST /auth/login`

* **Description:** Logs in to obtain a JWT token.
* **Body:**

  ```json
  {
    "email": "newRider@example.com",
    "password": "password123"
  }
  ```
* **Response:**

  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODhhMWNjODUyZTljNGIyYzE3OTlhNGEiLCJyb2xlIjoicmlkZXIiLCJpYXQiOjE3NTM4ODIxMTIsImV4cCI6MTc1Mzk2ODUxMn0.d2-O5ZknjLv4HWp-bMjmx5kQosTh99y5BAMXqddWzn0"
  }
  ```

### Rider Routes

#### `POST /ride/request`

* **Description:** Rider requests a ride with pickup and destination locations.
* **Body:**

  ```json
  {
    "pickupLocation": "Dhaka",
    "destination": "Hong Kong"
  }
  ```
* **Response:**

  ```json
  {
    "message": "Ride requested successfully",
    "ride": {
      "riderId": "688a1cc852e9c4b2c1799a4a",
      "pickupLocation": "Dhaka",
      "destination": "Hong Kong",
      "status": "requested",
      "rideCost": 0,
      "earnings": 0,
      "_id": "688a1ea1e092f26e5efdfa51",
      "createdAt": "2025-07-30T13:31:13.762Z",
      "updatedAt": "2025-07-30T13:31:13.763Z"
    }
  }
  ```

#### `GET /ride/me`

* **Description:** Retrieves all rides for the authenticated rider (requires authorization token).
* **Response:**

  ```json
  {
    "rides": [
      {
        "status": "requested",
        "pickupLocation": "Location A",
        "destination": "Location B",
        "createdAt": "2025-07-30T12:00:00Z"
      }
    ]
  }
  ```

#### `POST /ride/:id/cancel`

* **Description:** Rider cancels a ride using the ride ID.
* **Params:** `id` (ride ID)
* **Response:**

  ```json
  {
    "message": "Ride canceled",
    "ride": { ... }
  }
  ```

### Driver Routes

#### `PATCH /ride/:id/status`

* **Description:** Driver updates the ride status (e.g., "picked\_up", "in\_transit", "completed").
* **Params:** `id` (ride ID)
* **Body:**

  ```json
  {
    "status": "accepted"
  }
  ```

#### `GET /ride/earnings`

* **Description:** Retrieves total earnings for a driver from completed rides.
* **Response:**

  ```json
  {
    "earnings": 150.0
  }
  ```

#### `POST /ride/:id/online`

* **Description:** Sets the driver to online (accessible by driver or admin).
* **Params:** `id` (driver ID)

#### `POST /ride/:id/offline`

* **Description:** Sets the driver to offline (accessible by driver or admin).
* **Params:** `id` (driver ID)

### Admin Routes

#### `PATCH /user/:id/block`

* **Description:** Admin can block a user.
* **Params:** `id` (user ID)
* **Response:**

  ```json
  {
    "message": "User has been blocked successfully",
    "data": { ... }
  }
  ```

#### `PATCH /user/:id/unblock`

* **Description:** Admin can unblock a user.
* **Params:** `id` (user ID)
* **Response:**

  ```json
  {
    "message": "User has been unblocked successfully",
    "data": { ... }
  }
  ```

### Error Handling

* **Format:**

  ```json
  {
    "status": "error",
    "message": "Error message here"
  }
  ```

## Installation

To install and run this backend API, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/ride-booking-backend.git
   ```

2. Navigate into the project directory:

   ```bash
   cd ride-booking-backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables (e.g., database URL, JWT secret) in a `.env` file.

5. Run the application:

   ```bash
   npm start
   ```

## Usage

Once the backend is up and running, you can interact with the API through the following routes, using tools like Postman or cURL to test:

* Register a new user.
* Log in to get a JWT token.
* Request and manage rides as a rider.
* Update ride status and manage earnings as a driver.
* Block and unblock users as an admin.

## Dependencies

This project is built using the following technologies:

* Node.js
* Express.js
* MongoDB
* JWT (JSON Web Tokens)
* Bcrypt.js (for password hashing)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Let me know if you need any more specific information or adjustments!
