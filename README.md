
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

---

### `POST /api/v1/auth/register`

**Description:** Registers a new user (admin, rider, or driver).

**Request Body:**

```json
{
  "email": "newRider2@example.com",
  "password": "password123",
  "role": "rider"
}
```

**Response:**

```json
{
    "message": "User registered successfully",
    "user": {
        "email": "newRider2@example.com",
        "password": "$2b$10$RCTC4HuKIGiUsoDpUt1CSOM4PzOLDq3/oEbNNhOknjZijd11czfAW",
        "role": "rider",
        "isActive": true,
        "isDeleted": false,
        "isBlocked": false,
        "isOnline": false,
        "cost": 0,
        "earning": 0,
        "rides": [],
        "isApproved": false,
        "isSuspended": false,
        "vehicleInfo": "",
        "licenseNumber": "",
        "_id": "688b63032f59fe17affff681",
        "createdAt": "2025-07-31T12:35:15.556Z",
        "updatedAt": "2025-07-31T12:35:15.556Z"
    }
}
```



#### `POST api/v1/auth/login`

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

#### `POST api/v1/ride/request`

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

#### `GET api/v1/ride/me`

* **Description:** Retrieves all rides for the authenticated rider (requires authorization token).
* **Response:**

```json
{
    "rides": [
        {
            "_id": "688a1ea1e092f26e5efdfa51",
            "riderId": "688a1cc852e9c4b2c1799a4a",
            "pickupLocation": "Location Dhaka",
            "destination": "Location Hong Kong",
            "status": "requested",
            "rideCost": 0,
            "earnings": 0,
            "createdAt": "2025-07-30T13:31:13.762Z",
            "updatedAt": "2025-07-30T13:31:13.763Z"
        },
        {
            "_id": "688a213be092f26e5efdfa59",
            "riderId": "688a1cc852e9c4b2c1799a4a",
            "pickupLocation": " dhaka",
            "destination": "mawa",
            "status": "accepted",
            "rideCost": 0,
            "earnings": 0,
            "createdAt": "2025-07-30T13:42:19.126Z",
            "updatedAt": "2025-07-30T13:54:47.549Z",
            "driverId": "6888dd7def63c1df3f3db248"
        }
    ]
}
```



#### `POST api/v1/ride/:id/cancel`

* **Description:** Rider cancels a ride using the ride ID.
* **Params:** `id` (ride ID)
* **Response:**

```json
{
    "message": "Ride canceled",
    "ride": {
        "_id": "688b244cb9054f78e18e8796",
        "riderId": "688a1cc852e9c4b2c1799a4a",
        "pickupLocation": " dhaka gulshan",
        "destination": "mawa",
        "status": "canceled",
        "rideCost": 0,
        "earnings": 0,
        "createdAt": "2025-07-31T08:07:40.920Z",
        "updatedAt": "2025-07-31T08:13:24.726Z"
    }
}
```


### Driver Routes


Here is the properly formatted API documentation for both endpoints:

---

#### `PATCH api/v1/ride/:id/online`

**Description:** Updates the rider's status to "online."



```json
```

**Response:**

```json
{
    "statusCode": 200,
    "success": true,
    "message": "Rider is now offline",
    "data": {
        "_id": "6888e579b6b06275d80bd5ca",
        "email": "johndriver@example.com",
        "password": "$2b$10$GKz1GpCHMqiXnusI.OMLWemi2Uor3c7rZVqn47xsGWkfJOVQjaufS",
        "role": "driver",
        "isActive": true,
        "isDeleted": false,
        "isBlocked": false,
        "cost": 0,
        "earning": 0,
        "rides": [],
        "createdAt": "2025-07-29T15:15:05.489Z",
        "updatedAt": "2025-07-31T15:04:03.680Z",
        "__v": 0,
        "isOnline": true,
        "isApproved": false,
        "isSuspended": false,
        "licenseNumber": "",
        "vehicleInfo": ""
    }
}
```

---

#### `PATCH api/v1/ride/:id/offline`

**Description:** Updates the rider's status to "offline."

**Request Body:**

```json

```



```json
{
    "statusCode": 200,
    "success": true,
    "message": "Rider is now offline",
    "data": {
        "_id": "6888e579b6b06275d80bd5ca",
        "email": "johndriver@example.com",
        "password": "$2b$10$GKz1GpCHMqiXnusI.OMLWemi2Uor3c7rZVqn47xsGWkfJOVQjaufS",
        "role": "driver",
        "isActive": true,
        "isDeleted": false,
        "isBlocked": false,
        "cost": 0,
        "earning": 0,
        "rides": [],
        "createdAt": "2025-07-29T15:15:05.489Z",
        "updatedAt": "2025-07-31T15:04:03.680Z",
        "__v": 0,
        "isOnline": false,
        "isApproved": false,
        "isSuspended": false,
        "licenseNumber": "",
        "vehicleInfo": ""
    }
}
```

---






---

#### `PATCH api/v1/ride/:id/status`

**Description:** Driver updates the ride status (e.g., "picked\_up", "in\_transit", "completed").

**Params:**

* `id` (ride ID)

**Request Body:**

```json
{
  "status": "accepted"
}
```

**Response:**

```json
{
  "message": "Ride status updated",
  "ride": {
    "rideCost": 0,
    "_id": "6888b012dbc258e2d85ff66d",
    "riderId": "688789a6abd9d82beaa537f3",
    "pickupLocation": "Location A",
    "destination": "Location B",
    "status": "accepted",
    "earnings": 0,
    "createdAt": "2025-07-29T11:27:14.976Z",
    "updatedAt": "2025-07-31T08:36:50.676Z",
    "__v": 0,
    "driverId": "6888e579b6b06275d80bd5ca"
  }
}
```

**Example with status `completed`:**

**Request Body:**

```json
{
  "status": "completed"
}
```

**Response:**

```json
{
  "message": "Ride status updated",
  "ride": {
    "_id": "6888b012dbc258e2d85ff66d",
    "riderId": "688789a6abd9d82beaa537f3",
    "pickupLocation": "Location A",
    "destination": "Location B",
    "status": "completed",
    "earnings": 50,
    "createdAt": "2025-07-29T11:27:14.976Z",
    "updatedAt": "2025-07-31T08:38:07.378Z",
    "__v": 0,
    "driverId": "6888e579b6b06275d80bd5ca",
    "rideCost": 0
  }
}
```

---

#### `GET /api/v1/drivers/earnings

**Description:** Retrieves total earnings for a driver from completed rides.

**Response:**

```json
{
  "success": true,
  "message": "Your Total Earnings",
  "data": 150
}
```

---

Let me know if you need any further adjustments!


#### `POST api/v1/ride/:id/online`

* **Description:** Sets the driver to online (accessible by driver or admin).
* **Params:** `id` (driver ID)

#### `POST /ride/:id/offline`

* **Description:** Sets the driver to offline (accessible by driver or admin).
* **Params:** `id` (driver ID)

### Admin Routes


Here is the properly formatted API documentation for the **Admin Routes**:

---

### `GET /api/v1/users/getall`

**Description:** Retrieves a list of all users;  only the admin can see this.

**Response:**

```json
{
    "statusCode": 200,
    "success": true,
    "message": "All users fetched successfully",
    "data": [
        {
            "isOnline": false,
            "_id": "6888dd7def63c1df3f3db248",
            "email": "johnadmin@example.com",
            "password": "$2b$10$FGM0/Wwn4Gw5v5N8vOFUpOscMzzfwiE6Y81bkuYB0C6CisOkdwWZe",
            "role": "admin",
            "isActive": true,
            "isDeleted": false,
            "isBlocked": false,
            "cost": 0,
            "earning": 0,
            "rides": [],
            "createdAt": "2025-07-29T14:41:01.535Z",
            "updatedAt": "2025-07-29T14:41:01.535Z",
            "__v": 0
        },
        {
            "isOnline": false,
            "_id": "6888e36bc17ce33b37223cd7",
            "email": "johnrider@example.com",
            "password": "$2b$10$RshR51kFLIOZhlG183lGAOShFXu1rYAdpnW7JFqb3.I2Ml4RE03Ye",
            "role": "rider",
            "isActive": true,
            "isDeleted": false,
            "isBlocked": false,
            "cost": 0,
            "earning": 0,
            "rides": [],
            "createdAt": "2025-07-29T15:06:19.400Z",
            "updatedAt": "2025-07-29T15:06:19.400Z",
            "__v": 0
        }
    ]
}
```

---


#### `PATCH api/v1/user/block/:id`

**Description:** Admin can block a user.

**Params:**

* `id` (user ID)

**Response:**

```json
{
    "statusCode": 200,
    "success": true,
    "message": "User blocked successfully",
    "data": {
        "id": "688b72bb2e187f863f6cd272",
        "email": "newRider6@example.com",
        "role": "rider"
    }
}
```

---

#### `PATCH api/v1/users/unblock/:id`

**Description:** Admin can unblock a user.

**Params:**

* `id` (user ID)

**Response:**

```json
{
    "statusCode": 200,
    "success": true,
    "message": "User unblocked successfully",
    "data": {
        "id": "688b72bb2e187f863f6cd272",
        "email": "newRider6@example.com",
        "role": "rider"
    }
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

