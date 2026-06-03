# SmartShop Backend API - Project 2

## Overview
Complete Backend API for E-Commerce platform with User Authentication, Product Management, and Order Processing.

## Project Structure
```
project2/
├── server.js                 # Main Express server
├── routes/
│   ├── userRoutes.js        # User registration & login
│   ├── productRoutes.js     # Product CRUD operations
│   └── orderRoutes.js       # Order management
├── middleware/
│   └── validation.js        # Data validation functions
├── data/
│   ├── users.json          # User storage
│   ├── products.json       # Product storage
│   └── orders.json         # Order storage
└── package.json
```

## Installation & Setup

```bash
# Install dependencies
npm install

# Start server
npm start
```

Server runs on: `http://localhost:3000`

---

## API Endpoints

### 1. User Endpoints

#### Register User
```
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "pass123"
}

Response (201):
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login User
```
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "pass123"
}

Response (200):
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Get All Users
```
GET /api/users

Response (200):
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-05-30T10:00:00.000Z"
  }
]
```

---

### 2. Product Endpoints

#### Get All Products
```
GET /api/products

Response (200):
[
  {
    "id": 1,
    "name": "Running Shoes",
    "price": 5000,
    "category": "Electronics",
    "description": "High-quality running shoes",
    "stock": 50,
    "createdAt": "2026-05-30T10:00:00.000Z"
  }
]
```

#### Get Single Product
```
GET /api/products/:id
```

#### Create Product
```
POST /api/products
Content-Type: application/json

{
  "name": "Laptop",
  "price": 50000,
  "category": "Electronics",
  "description": "High performance laptop",
  "stock": 20
}

Response (201):
{
  "message": "Product created successfully",
  "product": {
    "id": 5,
    "name": "Laptop",
    "price": 50000,
    "category": "Electronics",
    "description": "High performance laptop",
    "stock": 20,
    "createdAt": "2026-05-30T10:00:00.000Z"
  }
}
```

#### Update Product
```
PUT /api/products/:id
Content-Type: application/json

{
  "name": "Updated Shoes",
  "price": 6000,
  "category": "Fashion",
  "description": "Updated description",
  "stock": 45
}

Response (200):
{
  "message": "Product updated successfully",
  "product": { ... }
}
```

#### Delete Product
```
DELETE /api/products/:id

Response (200):
{
  "message": "Product deleted successfully",
  "product": { ... }
}
```

---

### 3. Order Endpoints

#### Get All Orders
```
GET /api/orders
```

#### Get Orders by User
```
GET /api/orders/user/:userId
```

#### Create Order
```
POST /api/orders
Content-Type: application/json

{
  "userId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 5000
    }
  ],
  "totalPrice": 10000,
  "shippingAddress": "123 Main St, City"
}

Response (201):
{
  "message": "Order created successfully",
  "order": {
    "id": 1,
    "userId": 1,
    "items": [...],
    "totalPrice": 10000,
    "shippingAddress": "123 Main St, City",
    "status": "Pending",
    "createdAt": "2026-05-30T10:00:00.000Z"
  }
}
```

#### Update Order Status
```
PUT /api/orders/:id
Content-Type: application/json

{
  "status": "Shipped"
}
```

#### Delete Order
```
DELETE /api/orders/:id
```

---

## Data Validation

### User Validation
- ✅ Name required
- ✅ Valid email required
- ✅ Password minimum 4 characters

### Product Validation
- ✅ Name required
- ✅ Price must be > 0
- ✅ Category required
- ✅ Stock cannot be negative

### Order Validation
- ✅ User ID required
- ✅ At least 1 item required
- ✅ Total price must be > 0

---

## Testing with Postman

1. **Import Endpoints**: Copy API endpoints above
2. **Test Registration**:
   - POST `/api/users/register`
   - Body: `{ "name": "Test User", "email": "test@test.com", "password": "pass123" }`

3. **Test Products**:
   - GET `/api/products` - View all products
   - POST `/api/products` - Add new product

4. **Test Orders**:
   - POST `/api/orders` - Create order with userId and items

---

## Error Handling

All errors return proper status codes and error messages:

```json
{
  "errors": ["Field is required", "Invalid format"]
}
```

---

## Features Implemented ✅

✅ User Registration & Login  
✅ Product CRUD Operations  
✅ Order Management  
✅ Data Validation  
✅ JSON File Storage  
✅ Error Handling  
✅ RESTful API Design  

---

## Requirements Met (As Per PDF)

✅ GET APIs - Fetch data  
✅ POST APIs - Create data  
✅ PUT APIs - Update data  
✅ DELETE APIs - Remove data  
✅ User Input Handling  
✅ Validation  
✅ Error Responses  
✅ Backend Logic  

---

**Created**: May 30, 2026  
**Version**: 2.0.0
