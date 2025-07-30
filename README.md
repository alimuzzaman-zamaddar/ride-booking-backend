# ride-booking-backend



API Endpoints
Authentication
POST /auth/register
Description: Register a new user (admin, rider, or driver).

Body:

json
Copy
Edit
{
  "email": "newRider@example.com",
  "password": "password123",
  "role": "rider"
}


Response:

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



POST /auth/login
Description: Login to get a JWT token.

Body:

json
Copy
Edit
{
  "email": "newRider@example.com",
  "password": "password123"
}

Response:

json
Copy
Edit
{
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODhhMWNjODUyZTljNGIyYzE3OTlhNGEiLCJyb2xlIjoicmlkZXIiLCJpYXQiOjE3NTM4ODIxMTIsImV4cCI6MTc1Mzk2ODUxMn0.d2-O5ZknjLv4HWp-bMjmx5kQosTh99y5BAMXqddWzn0"
}


Rider Routes
POST /ride/request

Description: Rider requests a ride with pickup and destination.

Body:

json
Copy
Edit
{
  "pickupLocation": "Dhaka",
  "destination": "Hong Kong"
}

Response:

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


GET /ride/me
Description: Get all rides for the authenticated rider, needs an authorization bearer token.

Response:

json
Copy
Edit
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
POST /ride/:id/cancel
Description: Rider cancels a ride.

Params: id (ride ID)

Response:

json
Copy
Edit
{
  "message": "Ride canceled",
  "ride": { ... }
}
Driver Routes
PATCH /ride/:id/status
Description: Driver updates the ride status (e.g., "picked_up", "in_transit", "completed").

Params: id (ride ID)

Body:

json
Copy
Edit
{
  "status": "accepted"
}
GET /ride/earnings
Description: Get total earnings for a driver from completed rides.

Response:

json
Copy
Edit
{
  "earnings": 150.0
}
POST /ride/:id/online
Description: Set driver to online (only accessible by driver or admin).

Params: id (driver ID)

POST /ride/:id/offline
Description: Set driver to offline (only accessible by driver or admin).

Params: id (driver ID)

Admin Routes
PATCH /user/:id/block
Description: Admin can block a user.

Params: id (user ID)

Response:

json
Copy
Edit
{
  "message": "User has been blocked successfully",
  "data": { ... }
}
PATCH /user/:id/unblock
Description: Admin can unblock a user.

Params: id (user ID)

Response:

json
Copy
Edit
{
  "message": "User has been unblocked successfully",
  "data": { ... }
}
Error Handling
Errors are returned in the following format:

json
Copy
Edit
{
  "status": "error",
  "message": "Error message here"
}
