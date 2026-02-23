# MongoDB Schema Design: Local Service & Rental Booking Application

This document outlines the database architecture for your Local Service and Rental Booking Application. The design is optimized for performance, scalability, and role-based access control.

---

## 1. Users Collection
Stores information for Customers, Service Providers, and Admins.

### Schema Details
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key |
| `name` | String | Full name of the user |
| `mobile` | String | Unique mobile number (Primary login identifier) |
| `email` | String | Optional email address |
| `password` | String | Hashed password |
| `role` | String | Enum: `customer`, `provider`, `admin` |
| `profileImage`| String | URL to profile picture |
| `address` | Object | Nested: `{ street, city, state, zip, location: { type: "Point", coordinates: [lng, lat] } }` |
| `providerInfo`| Object | (Optional) KYC details, experience, business name for providers |
| `status` | String | Enum: `active`, `suspended`, `pending_verification` |
| `createdAt` | Date | Timestamp |

### Example JSON
```json
{
  "_id": "65d8a1f...",
  "name": "Rajesh Kumar",
  "mobile": "9876543210",
  "role": "provider",
  "providerInfo": {
    "businessName": "RK Plumbing Services",
    "isVerified": true,
    "experience": 5
  },
  "address": {
    "city": "Chennai",
    "location": { "type": "Point", "coordinates": [80.2707, 13.0827] }
  },
  "status": "active",
  "createdAt": "2024-02-22T09:00:00Z"
}
```

---

## 2. Services Collection
Includes both one-time services (e.g., Plumbing) and rental-based items (e.g., Tools/Equipments).

### Schema Details
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key |
| `providerId` | ObjectId | Reference to `Users` collection |
| `title` | String | Name of the service or rental item |
| `description`| String | Detailed description |
| `type` | String | Enum: `service` (labor-based), `rental` (item-based) |
| `category` | String | e.g., "Plumbing", "Home Appliances", "Vehicle" |
| `pricing` | Object | `{ amount: Number, unit: "hour" | "day" | "visit" }` |
| `media` | Array | List of image/video URLs |
| `isAvailable` | Boolean | Global toggle for the provider to hide service |
| `rating` | Number | Average rating (calculated) |
| `reviewCount` | Number | Total number of reviews |

### Example JSON
```json
{
  "_id": "65d8b2a...",
  "providerId": "65d8a1f...",
  "title": "Drilling Machine for Rent",
  "type": "rental",
  "category": "Tools",
  "pricing": {
    "amount": 200,
    "unit": "day"
  },
  "media": ["url1.jpg", "url2.jpg"],
  "isAvailable": true,
  "rating": 4.5
}
```

---

## 3. Bookings Collection
Tracks the transaction between a Customer and a Provider.

### Schema Details
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key |
| `customerId` | ObjectId | Reference to `Users` (Customer) |
| `providerId` | ObjectId | Reference to `Users` (Provider) |
| `serviceId` | ObjectId | Reference to `Services` |
| `bookingDate` | Date | Date scheduled for the service/pickup |
| `timeSlot` | String | e.g., "10:00 AM - 12:00 PM" |
| `status` | String | Enum: `pending`, `accepted`, `in-progress`, `completed`, `cancelled` |
| `totalAmount` | Number | Final price including taxes |
| `payment` | Object | `{ status: "unpaid" | "paid", transactionId: String, method: String }` |
| `location` | Object | Address where the service is requested |

### Example JSON
```json
{
  "_id": "65d8c3b...",
  "customerId": "65d8d4e...",
  "providerId": "65d8a1f...",
  "serviceId": "65d8b2a...",
  "bookingDate": "2024-02-25T00:00:00Z",
  "status": "pending",
  "totalAmount": 200,
  "payment": {
    "status": "unpaid",
    "method": "Cash on Delivery"
  }
}
```

---

## 4. Platform Management (Admin)
Stores system-level configurations and auditing logs.

### Schema Details
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key |
| `configType` | String | e.g., "COMMISSION_SETTINGS", "APP_CATEGORIES" |
| `data` | Object | Dynamic payload (e.g., `{ platformFee: 10, taxRate: 5 }`) |
| `lastUpdatedBy`| ObjectId | Reference to `Users` (Admin) |

### Example JSON
```json
{
  "_id": "65d8e5f...",
  "configType": "APP_CATEGORIES",
  "data": {
    "categories": [
      { "name": "Plumbing", "icon": "wrench", "type": "service" },
      { "name": "Power Tools", "icon": "hammer", "type": "rental" }
    ]
  }
}
```

---

## Key Relationships
1.  **One-to-Many**: One Provider can have multiple Services/Rentals.
2.  **Many-to-Many**: Customers book many Services, and Services are booked by many Customers (linked via `Bookings`).
3.  **Indexing**: High-performance indexes should be created on `users.mobile`, `services.providerId`, and `bookings.status`.
