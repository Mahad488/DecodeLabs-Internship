# Project 2 - Backend API Setup Guide

## Quick Start

### 1. Start the Server
```bash
npm start
```

Server will run at: **http://localhost:3000**

### 2. Test in Postman

#### Method 1: Import Collection (Easy Way)
1. Open Postman
2. Click "Import" button
3. Select `SmartShop_API.postman_collection.json`
4. All endpoints ready to use!

#### Method 2: Manual Testing
1. Create new request in Postman
2. Use endpoints from README.md
3. Test each API one by one

### 3. Testing Flow

**Step 1: Create User**
```
POST /api/users/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123"
}
```

**Step 2: View All Products**
```
GET /api/products
```

**Step 3: Add New Product** (Optional)
```
POST /api/products
{
  "name": "Mobile Phone",
  "price": 25000,
  "category": "Electronics",
  "description": "Latest smartphone",
  "stock": 30
}
```

**Step 4: Create Order**
```
POST /api/orders
{
  "userId": 1,
  "items": [
    {"productId": 1, "quantity": 2, "price": 5000}
  ],
  "totalPrice": 10000,
  "shippingAddress": "123 Main Street, City"
}
```

---

## Project Structure ✅

```
├── server.js                    (Main server with Express)
├── routes/
│   ├── userRoutes.js           (User registration & login)
│   ├── productRoutes.js        (Product CRUD)
│   └── orderRoutes.js          (Order management)
├── middleware/
│   └── validation.js           (Data validation)
├── data/
│   ├── users.json             (User data storage)
│   ├── products.json          (Product data storage)
│   └── orders.json            (Order data storage)
├── README.md                   (Full API documentation)
└── SmartShop_API.postman_collection.json
```

---

## Features Implemented ✅

- ✅ User Registration & Login
- ✅ Product CRUD Operations (Create, Read, Update, Delete)
- ✅ Order Management
- ✅ Data Validation
- ✅ Error Handling
- ✅ RESTful API Design
- ✅ JSON Data Storage
- ✅ Postman Collection for Testing

---

## Validation Rules

### User Registration
- Name cannot be empty
- Email must be valid format
- Password minimum 4 characters
- Email cannot be duplicate

### Product Creation
- Name required
- Price must be > 0
- Category required
- Stock cannot be negative

### Order Creation
- User ID must exist
- At least 1 item required
- Total price must be > 0

---

## Sample API Responses

### Success Response
```json
{
  "message": "Operation successful",
  "data": {...}
}
```

### Error Response
```json
{
  "errors": ["Field validation failed"]
}
```

---

## Submission Checklist ✅

- ✅ All GET endpoints working
- ✅ All POST endpoints working
- ✅ All PUT endpoints working
- ✅ All DELETE endpoints working
- ✅ User input validation
- ✅ Error handling
- ✅ README documentation
- ✅ Postman collection
- ✅ Data validation rules
- ✅ RESTful API structure

---

**Ready for DecodeLabs Evaluation!** 🎉
