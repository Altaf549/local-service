# API Documentation

## Base URL
```
http://your-domain.com/api
```

## Authentication
Most endpoints use Laravel Sanctum for authentication. Include the token in the Authorization header:
```
Authorization: Bearer {token}
```

## Request Format
For POST/PUT requests with JSON body, ensure you set the `Content-Type` header:
```
Content-Type: application/json
```

Without this header, Laravel may not parse the JSON request body correctly.

---

## 1. User Registration

Register a new user account.

**Endpoint:** `POST /api/user/register`

**Authentication:** Not required

**Request Body:**
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "mobile_number": "1234567890",
    "password": "password123"
}
```

**Response (201):**
```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "mobile_number": "1234567890",
            "role": "user",
            "status": "active",
            "created_at": "2026-01-07T10:00:00.000000Z"
        },
        "token": "1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    }
}
```

**Validation Errors (422):**
```json
{
    "message": "The email has already been taken.",
    "errors": {
        "email": ["The email has already been taken."]
    }
}
```

---

## 2. User Login

Login with user credentials.

**Endpoint:** `POST /api/user/login`

**Authentication:** Not required

**Request Body:**
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "mobile_number": "1234567890",
            "role": "user",
            "status": "active",
            "profile_photo": "profile.jpg",
            "profile_photo_url": "http://your-domain.com/storage/profile.jpg"
        },
        "token": "2|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    }
}
```

**Error Response - Inactive User (403):**
```json
{
    "success": false,
    "message": "Your account is inactive. Please contact support."
}
```

**Error Response - Invalid Credentials (422):**
```json
{
    "message": "The provided credentials are incorrect.",
    "errors": {
        "email": ["The provided credentials are incorrect."]
    }
}
```

---

## 3. Serviceman Registration

Register a new serviceman account.

**Endpoint:** `POST /api/serviceman/register`

**Authentication:** Not required

**Request Body:**
```json
{
    "name": "Service Provider",
    "email": "serviceman@example.com",
    "mobile_number": "9876543210",
    "password": "password123"
}
```

**Response (201):**
```json
{
    "success": true,
    "message": "Serviceman registered successfully",
    "data": {
        "id": 1,
        "name": "Service Provider",
        "email": "serviceman@example.com",
        "mobile_number": "9876543210",
        "status": "inactive",
        "availability_status": "available",
        "created_at": "2026-01-07T10:00:00.000000Z"
    }
}
```

**Note:** New servicemen are registered with `status: "inactive"`. They can login, but only admin can activate their account through the admin panel.

---

## 4. Serviceman Login

Login with serviceman credentials.

**Endpoint:** `POST /api/serviceman/login`

**Authentication:** Not required

**Request Body:**
```json
{
    "email": "serviceman@example.com",
    "password": "password123"
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "serviceman": {
            "id": 1,
            "name": "Service Provider",
            "email": "serviceman@example.com",
            "mobile_number": "9876543210",
            "status": "inactive",
            "availability_status": "available",
            "profile_photo": "serviceman.jpg",
            "profile_photo_url": "http://your-domain.com/storage/serviceman.jpg",
            "id_proof_image": "id_proof.jpg",
            "id_proof_image_url": "http://your-domain.com/storage/id_proof.jpg"
        },
        "token": "3|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    }
}
```

**Note:** Servicemen can login even if their status is inactive. Only admin can change the status through the admin panel.

---

## 5. Brahman Registration

Register a new brahman account.

**Endpoint:** `POST /api/brahman/register`

**Authentication:** Not required

**Request Body:**
```json
{
    "name": "Brahman Name",
    "email": "brahman@example.com",
    "mobile_number": "9876543211",
    "password": "password123"
}
```

**Response (201):**
```json
{
    "success": true,
    "message": "Brahman registered successfully",
    "data": {
        "id": 1,
        "name": "Brahman Name",
        "email": "brahman@example.com",
        "mobile_number": "9876543211",
        "status": "inactive",
        "availability_status": "available",
        "created_at": "2026-01-07T10:00:00.000000Z"
    }
}
```

**Note:** New brahmans are registered with `status: "inactive"`. They can login, but only admin can activate their account through the admin panel.

---

## 6. Brahman Login

Login with brahman credentials.

**Endpoint:** `POST /api/brahman/login`

**Authentication:** Not required

**Request Body:**
```json
{
    "email": "brahman@example.com",
    "password": "password123"
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "brahman": {
            "id": 1,
            "name": "Brahman Name",
            "email": "brahman@example.com",
            "mobile_number": "9876543211",
            "status": "inactive",
            "availability_status": "available",
            "profile_photo": "brahman.jpg",
            "profile_photo_url": "http://your-domain.com/storage/brahman.jpg",
            "id_proof_image": "brahman_id.jpg",
            "id_proof_image_url": "http://your-domain.com/storage/brahman_id.jpg"
        },
        "token": "4|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    }
}
```

**Note:** Brahmans can login even if their status is inactive. Only admin can change the status through the admin panel.

---

## 7. Logout

Logout the authenticated user and revoke the token.

**Endpoint:** `POST /api/logout`

**Authentication:** Required

**Response (200):**
```json
{
    "success": true,
    "message": "Logged out successfully"
}
```

**Error Response (401):**
```json
{
    "message": "Unauthenticated."
}
```

---

## 8. Get All Service Categories

Get list of all active service categories.

**Endpoint:** `GET /api/service-categories`

**Authentication:** Not required

**Response (200):**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "category_name": "Home Services",
            "image": "http://your-domain.com/storage/service-categories/image.jpg",
            "status": "active",
            "services_count": 5
        },
        {
            "id": 2,
            "category_name": "Cleaning",
            "image": "http://your-domain.com/storage/service-categories/image2.jpg",
            "status": "active",
            "services_count": 3
        }
    ]
}
```

---

## 9. Get All Services

Get list of all active services.

**Endpoint:** `GET /api/services`

**Authentication:** Not required

**Response (200):**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "service_name": "Plumbing",
            "category_id": 1,
            "category_name": "Home Services",
            "price": "500.00",
            "description": "Professional plumbing services",
            "image": "http://your-domain.com/storage/services/image.jpg",
            "status": "active"
        }
    ]
}
```

---

## 10. Get All Puja Types

Get list of all active puja types.

**Endpoint:** `GET /api/puja-types`

**Authentication:** Not required

**Response (200):**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "type_name": "Festival",
            "image": "http://your-domain.com/storage/puja-types/image.jpg",
            "status": "active",
            "pujas_count": 3
        }
    ]
}
```

---

## 11. Get All Pujas

Get list of all active pujas.

**Endpoint:** `GET /api/pujas`

**Authentication:** Not required

**Response (200):**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "puja_name": "Ganesh Puja",
            "puja_type_id": 1,
            "puja_type_name": "Festival",
            "duration": "2 hours",
            "price": "1000.00",
            "description": "Ganesh Puja description",
            "image": "http://your-domain.com/storage/pujas/image.jpg",
            "material_file": "http://your-domain.com/storage/pujas/materials/file.pdf",
            "status": "active"
        }
    ]
}
```

---

## 12. Get All Servicemen (Active)

Get list of all active and available servicemen.

**Endpoint:** `GET /api/servicemen`

**Authentication:** Not required

**Response (200):**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Service Provider",
            "phone": "9876543210",
            "email": "serviceman@example.com",
            "mobile_number": "9876543210",
            "category": {
                "id": 1,
                "category_name": "Home Services"
            },
            "experience": 5,
            "profile_photo": "http://your-domain.com/storage/servicemen/profiles/photo.jpg",
            "availability_status": "available"
        }
    ]
}
```

---

## 13. Get All Brahmans (Active)

Get list of all active and available brahmans.

**Endpoint:** `GET /api/brahmans`

**Authentication:** Not required

**Response (200):**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Brahman Name",
            "email": "brahman@example.com",
            "mobile_number": "9876543211",
            "specialization": "Vedic Rituals",
            "languages": "Hindi, English",
            "experience": 10,
            "charges": "2000.00",
            "profile_photo": "http://your-domain.com/storage/brahmans/profiles/photo.jpg",
            "availability_status": "available"
        }
    ]
}
```

---

## 14. Home API

Get home page data including banners, categories, services, servicemen, puja types, pujas, and brahmans (limited to 5 each).

**Endpoint:** `GET /api/home`

**Authentication:** Not required

**Response (200):**
```json
{
    "success": true,
    "data": {
        "banners": [
            {
                "id": 1,
                "title": "Banner Title",
                "image": "http://your-domain.com/storage/banners/image.jpg",
                "status": "active"
            }
        ],
        "service_categories": [
            {
                "id": 1,
                "category_name": "Home Services",
                "image": "http://your-domain.com/storage/service-categories/image.jpg"
            }
        ],
        "services": [
            {
                "id": 1,
                "service_name": "Plumbing",
                "category_name": "Home Services",
                "price": "500.00",
                "image": "http://your-domain.com/storage/services/image.jpg"
            }
        ],
        "servicemen": [
            {
                "id": 1,
                "name": "Service Provider",
                "profile_photo": "http://your-domain.com/storage/servicemen/profiles/photo.jpg"
            }
        ],
        "puja_types": [
            {
                "id": 1,
                "type_name": "Festival",
                "image": "http://your-domain.com/storage/puja-types/image.jpg"
            }
        ],
        "pujas": [
            {
                "id": 1,
                "puja_name": "Ganesh Puja",
                "puja_type_name": "Festival",
                "price": "1000.00",
                "image": "http://your-domain.com/storage/pujas/image.jpg"
            }
        ],
        "brahmans": [
            {
                "id": 1,
                "name": "Brahman Name",
                "profile_photo": "http://your-domain.com/storage/brahmans/profiles/photo.jpg"
            }
        ]
    }
}
```

---

## 15. Get Service Category Details

Get service category details with all associated services.

**Endpoint:** `GET /api/service-categories/{id}`

**Authentication:** Not required

**Response (200):**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "category_name": "Home Services",
        "image": "http://your-domain.com/storage/service-categories/image.jpg",
        "status": "active",
        "services": [
            {
                "id": 1,
                "service_name": "Plumbing",
                "price": "500.00",
                "description": "Professional plumbing services",
                "image": "http://your-domain.com/storage/services/image.jpg",
                "status": "active"
            }
        ]
    }
}
```

---

## 16. Get Puja Type Details

Get puja type details with all associated pujas.

**Endpoint:** `GET /api/puja-types/{id}`

**Authentication:** Not required

**Response (200):**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "type_name": "Festival",
        "image": "http://your-domain.com/storage/puja-types/image.jpg",
        "status": "active",
        "pujas": [
            {
                "id": 1,
                "puja_name": "Ganesh Puja",
                "duration": "2 hours",
                "price": "1000.00",
                "description": "Ganesh Puja description",
                "image": "http://your-domain.com/storage/pujas/image.jpg",
                "status": "active"
            }
        ]
    }
}
```

---

## 17. Get Service Details

Get service details with all associated servicemen.

**Endpoint:** `GET /api/services/{id}`

**Authentication:** Not required

**Response (200):**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "service_name": "Plumbing",
        "category": {
            "id": 1,
            "category_name": "Home Services"
        },
        "price": "500.00",
        "description": "Professional plumbing services",
        "image": "http://your-domain.com/storage/services/image.jpg",
        "status": "active",
        "servicemen": [
            {
                "id": 1,
                "name": "Service Provider",
                "phone": "9876543210",
                "experience": 5,
                "profile_photo": "http://your-domain.com/storage/servicemen/profiles/photo.jpg",
                "availability_status": "available",
                "price": "750.00",
                "custom_price": true
            }
        ]
    }
}
```

**Note:** Each serviceman includes:
- `price`: Serviceman-specific price if set, otherwise the default service price
- `custom_price`: Boolean indicating if a custom price is set for this serviceman

---

## 18. Get Puja Details

Get puja details with all associated brahmans.

**Endpoint:** `GET /api/pujas/{id}`

**Authentication:** Not required

**Response (200):**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "puja_name": "Ganesh Puja",
        "puja_type": {
            "id": 1,
            "type_name": "Festival"
        },
        "duration": "2 hours",
        "price": "1000.00",
        "description": "Ganesh Puja description",
        "image": "http://your-domain.com/storage/pujas/image.jpg",
        "material_file": "http://your-domain.com/storage/pujas/materials/file.pdf",
        "status": "active",
        "brahmans": [
            {
                "id": 1,
                "name": "Brahman Name",
                "specialization": "Vedic Rituals",
                "languages": "Hindi, English",
                "experience": 10,
                "charges": "2000.00",
                "profile_photo": "http://your-domain.com/storage/brahmans/profiles/photo.jpg",
                "availability_status": "available",
                "price": "1500.00",
                "custom_price": true,
                "material_file": "http://your-domain.com/storage/pujas/materials/brahman-specific-file.pdf"
            }
        ]
    }
}
```

**Note:** Each brahman includes:
- `price`: Brahman-specific price if set, otherwise the default puja price
- `custom_price`: Boolean indicating if a custom price is set for this brahman
- `material_file`: Brahman-specific material file if set, otherwise the default puja material file (or null)

---

## 19. Get Services by Category

Get list of services belonging to a specific category.

**Endpoint:** `GET /api/services/by-category/{categoryId}`

**Authentication:** Not required

**Response (200):**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "service_name": "Plumbing",
            "category_id": 1,
            "category_name": "Home Services",
            "price": "500.00",
            "description": "Professional plumbing services",
            "image": "http://your-domain.com/storage/services/image.jpg",
            "status": "active"
        },
        {
            "id": 2,
            "service_name": "Electrical",
            "category_id": 1,
            "category_name": "Home Services",
            "price": "600.00",
            "description": "Professional electrical services",
            "image": "http://your-domain.com/storage/services/electrical.jpg",
            "status": "active"
        }
    ]
}
```

---

## 20. Get Pujas by Type

Get list of pujas belonging to a specific type.

**Endpoint:** `GET /api/pujas/by-type/{typeId}`

**Authentication:** Not required

**Response (200):**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "puja_name": "Ganesh Puja",
            "puja_type_id": 1,
            "puja_type_name": "Festival",
            "duration": "2 hours",
            "price": "1000.00",
            "description": "Ganesh Puja description",
            "image": "http://your-domain.com/storage/pujas/image.jpg",
            "material_file": "http://your-domain.com/storage/pujas/materials/file.pdf",
            "status": "active"
        }
    ]
}
```

---

## 21. Get Serviceman Details

Get detailed information about a specific serviceman including their services.

**Endpoint:** `GET /api/servicemen/details/{id}`

**Authentication:** Not required

**Response (200):**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "Service Provider",
        "email": "serviceman@example.com",
        "mobile_number": "9876543210",
        "phone": "9876543210",
        "category": {
            "id": 1,
            "category_name": "Home Services"
        },
        "experience": 5,
        "profile_photo": "http://your-domain.com/storage/servicemen/profiles/photo.jpg",
        "id_proof_image": "http://your-domain.com/storage/servicemen/id-proofs/photo.jpg",
        "government_id": "AADHAAR123456",
        "address": "123 Main Street, City, State",
        "availability_status": "available",
        "status": "active",
        "services": [
            {
                "id": 1,
                "service_name": "Plumbing",
                "price": "750.00",
                "custom_price": true
            }
        ]
    }
}
```

---

## 22. Get Brahman Details

Get detailed information about a specific brahman including their pujas.

**Endpoint:** `GET /api/brahmans/details/{id}`

**Authentication:** Not required

**Response (200):**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "Brahman Name",
        "email": "brahman@example.com",
        "mobile_number": "9876543211",
        "specialization": "Vedic Rituals",
        "languages": "Hindi, English",
        "experience": 10,
        "charges": "2000.00",
        "profile_photo": "http://your-domain.com/storage/brahmans/profiles/photo.jpg",
        "id_proof_image": "http://your-domain.com/storage/brahmans/id-proofs/photo.jpg",
        "government_id": "PAN123456",
        "address": "456 Temple Street, City, State",
        "availability_status": "available",
        "status": "active",
        "pujas": [
            {
                "id": 1,
                "puja_name": "Ganesh Puja",
                "price": "1500.00",
                "custom_price": true,
                "material_file": "http://your-domain.com/storage/pujas/materials/brahman-specific-file.pdf"
            }
        ]
    }
}
```

---

## 23. Create Service Booking

Create a new service booking.

**Endpoint:** `POST /api/bookings/service`

**Authentication:** Required

**Note:** The `total_amount` is automatically calculated from the `serviceman_service_prices` table based on the selected serviceman and service combination. If no price is found, it defaults to 0.

**Validation:**
- User cannot book same service if they already have an active (pending/confirmed) booking for that service
- Error response format:
  ```json
  {
      "message": "You already book this service",
      "errors": {
          "service_id": ["You already book this service"]
      }
  }
  ```
- Serviceman must be available (availability_status = 'available')
- Booking date must be today or in the future

**Request Body:**
```json
{
    "service_id": 1,
    "serviceman_id": 1,
    "booking_date": "2024-12-25",
    "booking_time": "10:00 AM",
    "address": "123 Main St, City, State",
    "mobile_number": "9876543210",
    "notes": "Special instructions for service"
}
```

**Response (201):**
```json
{
    "success": true,
    "message": "Service booking created successfully",
    "data": {
        "booking": {
            "id": 1,
            "user_id": 1,
            "booking_type": "service",
            "service_id": 1,
            "serviceman_id": 1,
            "booking_date": "2024-12-25T00:00:00.000000Z",
            "booking_time": "10:00 AM",
            "address": "123 Main St, City, State",
            "mobile_number": "9876543210",
            "notes": "Special instructions for service",
            "status": "pending",
            "payment_status": "pending",
            "payment_method": "cod",
            "total_amount": "1500.00",
            "created_at": "2024-01-01T10:00:00.000000Z",
            "updated_at": "2024-01-01T10:00:00.000000Z",
            "user": {...},
            "service": {...},
            "serviceman": {...}
        }
    }
}
```

---

## 24. Create Puja Booking

Create a new puja booking.

**Endpoint:** `POST /api/bookings/puja`

**Authentication:** Required

**Note:** The `total_amount` is automatically calculated from `brahman_puja_prices` table based on the selected brahman and puja combination. If no price is found, it defaults to 0.

**Validation:**
- User cannot book same puja if they already have an active (pending/confirmed) booking for that puja
- Error response format:
  ```json
  {
      "message": "You already book this puja",
      "errors": {
          "puja_id": ["You already book this puja"]
      }
  }
  ```
- Brahman must be available (availability_status = 'available')
- Booking date must be today or in the future

**Request Body:**
```json
{
    "puja_id": 1,
    "brahman_id": 1,
    "booking_date": "2024-12-25",
    "booking_time": "10:00 AM",
    "address": "123 Main St, City, State",
    "mobile_number": "9876543210",
    "notes": "Special instructions for puja"
}
```

**Response (201):**
```json
{
    "success": true,
    "message": "Puja booking created successfully",
    "data": {
        "booking": {
            "id": 1,
            "user_id": 1,
            "booking_type": "puja",
            "puja_id": 1,
            "brahman_id": 1,
            "booking_date": "2024-12-25T00:00:00.000000Z",
            "booking_time": "10:00 AM",
            "address": "123 Main St, City, State",
            "mobile_number": "9876543210",
            "notes": "Special instructions for puja",
            "status": "pending",
            "payment_status": "pending",
            "payment_method": "cod",
            "total_amount": "1500.00",
            "created_at": "2024-01-01T10:00:00.000000Z",
            "updated_at": "2024-01-01T10:00:00.000000Z",
            "user": {...},
            "puja": {...},
            "brahman": {...}
        }
    }
}
```

---

## 25. Get User Bookings

Get all bookings for the authenticated user.

**Endpoint:** `GET /api/bookings`

**Authentication:** Required

**Response (200):**
```json
{
    "success": true,
    "data": {
        "bookings": [
            {
                "id": 1,
                "booking_type": "service",
                "status": "pending",
                "booking_date": "2024-12-25T00:00:00.000000Z",
                "booking_time": "10:00 AM",
                "total_amount": "0.00",
                "user": {...},
                "service": {...},
                "serviceman": {...}
            }
        ]
    }
}
```

---

## 26. Get Booking Details

Get details of a specific booking.

**Endpoint:** `GET /api/bookings/{id}`

**Authentication:** Required

**Response (200):**
```json
{
    "success": true,
    "data": {
        "booking": {
            "id": 1,
            "user_id": 1,
            "booking_type": "service",
            "service_id": 1,
            "serviceman_id": 1,
            "booking_date": "2024-12-25T00:00:00.000000Z",
            "booking_time": "10:00 AM",
            "address": "123 Main St, City, State",
            "mobile_number": "9876543210",
            "notes": "Special instructions",
            "status": "pending",
            "payment_status": "pending",
            "payment_method": "cod",
            "total_amount": "1500.00",
            "created_at": "2024-01-01T10:00:00.000000Z",
            "updated_at": "2024-01-01T10:00:00.000000Z",
            "user": {...},
            "service": {...},
            "puja": {...},
            "serviceman": {...},
            "brahman": {...}
        }
    }
}
```

---

## 27. Update Booking

Update an existing booking (only pending bookings can be updated).

**Endpoint:** `PUT /api/bookings/{id}`

**Authentication:** Required

**Request Body:**
```json
{
    "booking_date": "2024-12-26",
    "booking_time": "11:00 AM",
    "address": "456 New Address, City, State",
    "mobile_number": "9876543211",
    "notes": "Updated notes"
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Booking updated successfully",
    "data": {
        "booking": {
            "id": 1,
            "booking_date": "2024-12-26T00:00:00.000000Z",
            "booking_time": "11:00 AM",
            "address": "456 New Address, City, State",
            "mobile_number": "9876543211",
            "notes": "Updated notes",
            "status": "pending",
            "user": {...},
            "service": {...},
            "serviceman": {...}
        }
    }
}
```

---

## 28. Cancel Booking

Cancel an existing booking (only pending or confirmed bookings can be cancelled).

**Endpoint:** `PUT /api/bookings/cancel/{id}`

**Authentication:** Required

**Request Body:**
```json
{
    "cancellation_reason": "Need to reschedule due to emergency"
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Booking cancelled successfully",
    "data": {
        "booking": {
            "id": 1,
            "status": "cancelled",
            "notes": "Original notes\n\nCancellation Reason: Need to reschedule due to emergency",
            "user": {...},
            "service": {...},
            "serviceman": {...}
        }
    }
}
```

**Note:**
- Only pending or confirmed bookings can be cancelled
- Cancellation reason is optional but recommended
- Cancellation reason will be appended to notes field

---

## 29. Accept Booking

Accept a pending booking (for assigned serviceman or brahman).

**Endpoint:** `PUT /api/bookings/accept/{id}`

**Authentication:** Required

**Request Body:** (Empty)

**Response (200):**
```json
{
    "success": true,
    "message": "Booking accepted successfully",
    "data": {
        "booking": {
            "id": 1,
            "status": "confirmed",
            "user": {...},
            "service": {...},
            "serviceman": {...}
        }
    }
}
```

**Note:**
- Only the assigned serviceman or brahman can accept the booking
- Booking status changes from "pending" to "confirmed"
- Empty request body - only booking ID in URL is needed

---

## 30. Complete Booking

Mark a confirmed booking as completed (for assigned serviceman or brahman).

**Endpoint:** `PUT /api/bookings/complete/{id}`

**Authentication:** Required

**Request Body:** (Empty)

**Response (200):**
```json
{
    "success": true,
    "message": "Booking completed successfully",
    "data": {
        "booking": {
            "id": 1,
            "status": "completed",
            "user": {...},
            "service": {...},
            "serviceman": {...}
        }
    }
}
```

**Note:**
- Only the assigned serviceman or brahman can complete the booking
- Booking status changes from "confirmed" to "completed"
- Empty request body - only booking ID in URL is needed

---

## 31. Get All Bookings (Admin)

Get all bookings in the system (admin only).

**Endpoint:** `GET /api/admin/bookings`

**Authentication:** Required (Admin)

**Response (200):**
```json
{
    "success": true,
    "data": {
        "bookings": [
            {
                "id": 1,
                "booking_type": "service",
                "status": "pending",
                "booking_date": "2024-12-25T00:00:00.000000Z",
                "booking_time": "10:00 AM",
                "total_amount": "1500.00",
                "user": {...},
                "service": {...},
                "serviceman": {...}
            }
        ]
    }
}
```

---

## 32. Update Booking Status (Admin)

Update booking status (admin only).

**Endpoint:** `PUT /api/admin/bookings/{id}/status`

**Authentication:** Required (Admin)

**Request Body:**
```json
{
    "status": "confirmed"
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Booking status updated successfully",
    "data": {
        "booking": {
            "id": 1,
            "status": "confirmed",
            "user": {...},
            "service": {...},
            "serviceman": {...}
        }
    }
}
```

**Note:**
- Only admin can access this endpoint
- Valid statuses: pending, confirmed, completed, cancelled

---

## 33. Update User Profile

Update authenticated user's profile information.

**Endpoint:** `POST /api/user/profile/update`

**Authentication:** Required (User token)

**Request Body (multipart/form-data):**
```
current_password: "current_password123"
name: "John Doe"
email: "john@example.com"
mobile_number: "1234567890"
address: "123 Main St, City, State"
new_password: "newpassword123" (optional)
profile_photo: [file] (optional)
```

**Response (200):**
```json
{
    "success": true,
    "message": "Profile updated successfully",
    "data": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "mobile_number": "1234567890",
        "address": "123 Main St, City, State",
        "role": "user",
        "status": "active",
        "profile_photo": "users/profiles/filename.jpg",
        "profile_photo_url": "http://localhost:8000/storage/users/profiles/filename.jpg",
        "created_at": "2024-01-01T10:00:00.000000Z",
        "updated_at": "2024-01-01T10:00:00.000000Z"
    }
}
```

**Error Response (422):**
```json
{
    "message": "Current password is incorrect",
    "errors": {
        "current_password": ["Current password is incorrect"]
    }
}
```

**Note:**
- `current_password` is mandatory for security
- `new_password` is optional - only updates if provided
- `profile_photo` should be jpeg, png, or jpg (max 2MB)
- Email and mobile number must be unique among users

---

## 34. Update Serviceman Profile (Simple)

Update authenticated serviceman's basic profile information.

**Endpoint:** `POST /api/serviceman/simple-profile/update`

**Authentication:** Required (Serviceman token)

**Request Body (multipart/form-data):**
```
current_password: "current_password123"
name: "John Doe"
email: "john@example.com"
mobile_number: "9876543210"
address: "123 Main St, City, State"
new_password: "newpassword123" (optional)
profile_photo: [file] (optional)
```

**Response (200):**
```json
{
    "success": true,
    "message": "Serviceman profile updated successfully",
    "data": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "mobile_number": "9876543210",
        "address": "123 Main St, City, State",
        "profile_photo": "servicemen/profiles/filename.jpg",
        "profile_photo_url": "http://localhost:8000/storage/servicemen/profiles/filename.jpg",
        "created_at": "2024-01-01T10:00:00.000000Z",
        "updated_at": "2024-01-01T10:00:00.000000Z"
    }
}
```

**Error Response (422):**
```json
{
    "message": "Current password is incorrect",
    "errors": {
        "current_password": ["Current password is incorrect"]
    }
}
```

**Note:**
- `current_password` is mandatory for security
- `new_password` is optional - only updates if provided
- `profile_photo` should be jpeg, png, or jpg (max 2MB)
- Email and mobile number must be unique among servicemen

---

## 35. Update Brahman Profile (Simple)

Update authenticated brahman's basic profile information.

**Endpoint:** `POST /api/brahman/simple-profile/update`

**Authentication:** Required (Brahman token)

**Request Body (multipart/form-data):**
```
current_password: "current_password123"
name: "Rajesh Sharma"
email: "rajesh@example.com"
mobile_number: "9876543210"
address: "123 Temple Road, City, State"
new_password: "newpassword123" (optional)
profile_photo: [file] (optional)
```

**Response (200):**
```json
{
    "success": true,
    "message": "Brahman profile updated successfully",
    "data": {
        "id": 1,
        "name": "Rajesh Sharma",
        "email": "rajesh@example.com",
        "mobile_number": "9876543210",
        "address": "123 Temple Road, City, State",
        "profile_photo": "brahmans/profiles/filename.jpg",
        "profile_photo_url": "http://localhost:8000/storage/brahmans/profiles/filename.jpg",
        "created_at": "2024-01-01T10:00:00.000000Z",
        "updated_at": "2024-01-01T10:00:00.000000Z"
    }
}
```

**Error Response (422):**
```json
{
    "message": "Current password is incorrect",
    "errors": {
        "current_password": ["Current password is incorrect"]
    }
}
```

**Note:**
- `current_password` is mandatory for security
- `new_password` is optional - only updates if provided
- `profile_photo` should be jpeg, png, or jpg (max 2MB)
- Email and mobile number must be unique among brahmans

---

## 36. Get Serviceman Profile Data

Get authenticated serviceman's profile data including verification information.

**Endpoint:** `GET /api/serviceman/profile-data`

**Authentication:** Required (Serviceman token)

**Response (200):**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "mobile_number": "9876543210",
        "government_id": "AADHAAR123456",
        "address": "123 Main Street, City, State",
        "profile_photo": "http://localhost:8000/storage/servicemen/profiles/filename.jpg",
        "id_proof_image": "http://localhost:8000/storage/servicemen/id-proofs/filename.jpg"
    }
}
```

**Note:**
- Returns the same data that can be updated via the profile update endpoint
- File URLs are complete and accessible
- Returns null for profile_photo and id_proof_image if no files exist

---

## 37. Get Brahman Profile Data

Get authenticated brahman's profile data including verification information.

**Endpoint:** `GET /api/brahman/profile-data`

**Authentication:** Required (Brahman token)

**Response (200):**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "Rajesh Sharma",
        "email": "rajesh@example.com",
        "mobile_number": "9876543210",
        "government_id": "AADHAAR123456",
        "address": "123 Temple Road, City, State",
        "profile_photo": "http://localhost:8000/storage/brahmans/profiles/filename.jpg",
        "id_proof_image": "http://localhost:8000/storage/brahmans/id-proofs/filename.jpg"
    }
}
```

**Note:**
- Returns the same data that can be updated via the profile update endpoint
- File URLs are complete and accessible
- Returns null for profile_photo and id_proof_image if no files exist

---

## 38. Update Serviceman Profile (Verification)

Update serviceman profile with Government ID, ID Proof Image, Address, and Profile Photo.

**Endpoint:** `POST /api/serviceman/profile/update`

**Authentication:** Required (Serviceman token)

**Request Body (multipart/form-data):**
```
government_id: "AADHAAR123456"
id_proof_image: [file] (image, max 2MB)
address: "123 Main Street, City, State"
profile_photo: [file] (image, max 2MB)
```

**Response (200):**
```json
{
    "success": true,
    "message": "Profile updated successfully",
    "data": {
        "id": 1,
        "name": "Service Provider",
        "government_id": "AADHAAR123456",
        "id_proof_image": "servicemen/id-proofs/image.jpg",
        "address": "123 Main Street, City, State",
        "profile_photo": "servicemen/profiles/photo.jpg"
    }
}
```

---

## 39. Update Brahman Profile (Verification)

Update brahman profile with Government ID, ID Proof Image, Address, and Profile Photo.

**Endpoint:** `POST /api/brahman/profile/update`

**Authentication:** Required (Brahman token)

**Request Body (multipart/form-data):**
```
government_id: "PAN123456"
id_proof_image: [file] (image, max 2MB)
address: "456 Temple Street, City, State"
profile_photo: [file] (image, max 2MB)
```

**Response (200):**
```json
{
    "success": true,
    "message": "Profile updated successfully",
    "data": {
        "id": 1,
        "name": "Brahman Name",
        "government_id": "PAN123456",
        "id_proof_image": "brahmans/id-proofs/image.jpg",
        "address": "456 Temple Street, City, State",
        "profile_photo": "brahmans/profiles/photo.jpg"
    }
}
```

---

## 40. Update Service Price (Serviceman-wise)

Update service price for the authenticated serviceman.

**Endpoint:** `POST /api/services/price/update/{id}`

**Authentication:** Required (Serviceman token)

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {serviceman_token}
```

**Request Body:**
```json
{
    "price": "750.00"
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Service price updated successfully",
    "data": {
        "id": 1,
        "serviceman_id": 1,
        "service_id": 1,
        "price": "750.00",
        "created_at": "2024-01-01T10:00:00.000000Z",
        "updated_at": "2024-01-01T10:00:00.000000Z"
    }
}
```

**Note:**
- Only the authenticated serviceman can update their own prices
- Price must be a valid decimal number
- This creates or updates a record in serviceman_service_prices table

---

## 41. Update Puja Price and Material File (Brahman-wise)

Update puja price and material file for the authenticated brahman.

**Endpoint:** `POST /api/pujas/price/update/{id}`

**Authentication:** Required (Brahman token)

**Headers:**
```
Content-Type: multipart/form-data
Authorization: Bearer {brahman_token}
```

**Request Body (multipart/form-data):**
```
price: "1500.00"
material_file: [file] (optional, PDF, max 5MB)
```

**Response (200):**
```json
{
    "success": true,
    "message": "Puja price updated successfully",
    "data": {
        "id": 1,
        "brahman_id": 1,
        "puja_id": 1,
        "price": "1500.00",
        "material_file": "pujas/materials/brahman-specific-file.pdf",
        "material_file_url": "http://localhost:8000/storage/pujas/materials/brahman-specific-file.pdf",
        "created_at": "2024-01-01T10:00:00.000000Z",
        "updated_at": "2024-01-01T10:00:00.000000Z"
    }
}
```

**Note:**
- Only the authenticated brahman can update their own prices
- Price must be a valid decimal number
- Material file is optional - only updates if provided
- Material file should be PDF format (max 5MB)
- This creates or updates a record in brahman_puja_prices table

---

## 42. Get Serviceman Experiences

Get list of all experiences for the authenticated serviceman.

**Endpoint:** `GET /api/serviceman/experiences`

**Authentication:** Required (Serviceman token)

**Response (200):**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "title": "Senior Plumbing Technician",
            "company": "ABC Plumbing Services",
            "description": "Handled residential and commercial plumbing projects",
            "years": 5,
            "start_date": "2019-01-01",
            "end_date": "2024-01-01",
            "created_at": "2024-01-01T10:00:00.000000Z",
            "updated_at": "2024-01-01T10:00:00.000000Z"
        }
    ]
}
```

---

## 43. Add Serviceman Experience

Add a new experience entry for the authenticated serviceman.

**Endpoint:** `POST /api/serviceman/experience/add`

**Authentication:** Required (Serviceman token)

**Request Body:**
```json
{
    "title": "Senior Plumbing Technician",
    "company": "ABC Plumbing Services",
    "description": "Handled residential and commercial plumbing projects",
    "years": 5,
    "start_date": "2019-01-01",
    "end_date": "2024-01-01"
}
```

**Response (201):**
```json
{
    "success": true,
    "message": "Experience added successfully",
    "data": {
        "id": 1,
        "serviceman_id": 1,
        "title": "Senior Plumbing Technician",
        "company": "ABC Plumbing Services",
        "description": "Handled residential and commercial plumbing projects",
        "years": 5,
        "start_date": "2019-01-01",
        "end_date": "2024-01-01",
        "created_at": "2024-01-01T10:00:00.000000Z",
        "updated_at": "2024-01-01T10:00:00.000000Z"
    }
}
```

---

## 44. Update Serviceman Experience

Update an existing experience entry.

**Endpoint:** `PUT /api/serviceman/experience/{id}`

**Authentication:** Required (Serviceman token)

**Request Body:**
```json
{
    "title": "Master Plumbing Technician",
    "company": "XYZ Plumbing Solutions",
    "description": "Led team of 10 plumbers for large-scale projects",
    "years": 6,
    "start_date": "2018-01-01",
    "end_date": "2024-01-01"
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Experience updated successfully",
    "data": {
        "id": 1,
        "serviceman_id": 1,
        "title": "Master Plumbing Technician",
        "company": "XYZ Plumbing Solutions",
        "description": "Led team of 10 plumbers for large-scale projects",
        "years": 6,
        "start_date": "2018-01-01",
        "end_date": "2024-01-01",
        "created_at": "2024-01-01T10:00:00.000000Z",
        "updated_at": "2024-01-01T11:00:00.000000Z"
    }
}
```

---

## 45. Delete Serviceman Experience

Delete an experience entry.

**Endpoint:** `DELETE /api/serviceman/experience/{id}`

**Authentication:** Required (Serviceman token)

**Response (200):**
```json
{
    "success": true,
    "message": "Experience deleted successfully"
}
```

---

## 46. Get Serviceman Achievements

Get list of all achievements for the authenticated serviceman.

**Endpoint:** `GET /api/serviceman/achievements`

**Authentication:** Required (Serviceman token)

**Response (200):**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "title": "Best Service Provider 2023",
            "description": "Awarded for exceptional customer service",
            "date": "2023-12-01",
            "organization": "Local Business Association",
            "created_at": "2024-01-01T10:00:00.000000Z",
            "updated_at": "2024-01-01T10:00:00.000000Z"
        }
    ]
}
```

---

## 47. Add Serviceman Achievement

Add a new achievement entry for the authenticated serviceman.

**Endpoint:** `POST /api/serviceman/achievement/add`

**Authentication:** Required (Serviceman token)

**Request Body:**
```json
{
    "title": "Best Service Provider 2023",
    "description": "Awarded for exceptional customer service",
    "date": "2023-12-01",
    "organization": "Local Business Association"
}
```

**Response (201):**
```json
{
    "success": true,
    "message": "Achievement added successfully",
    "data": {
        "id": 1,
        "serviceman_id": 1,
        "title": "Best Service Provider 2023",
        "description": "Awarded for exceptional customer service",
        "date": "2023-12-01",
        "organization": "Local Business Association",
        "created_at": "2024-01-01T10:00:00.000000Z",
        "updated_at": "2024-01-01T10:00:00.000000Z"
    }
}
```

---

## 48. Update Serviceman Achievement

Update an existing achievement entry.

**Endpoint:** `PUT /api/serviceman/achievement/{id}`

**Authentication:** Required (Serviceman token)

**Request Body:**
```json
{
    "title": "Excellence in Service 2023",
    "description": "Recognized for outstanding performance",
    "date": "2023-12-15",
    "organization": "City Chamber of Commerce"
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Achievement updated successfully",
    "data": {
        "id": 1,
        "serviceman_id": 1,
        "title": "Excellence in Service 2023",
        "description": "Recognized for outstanding performance",
        "date": "2023-12-15",
        "organization": "City Chamber of Commerce",
        "created_at": "2024-01-01T10:00:00.000000Z",
        "updated_at": "2024-01-01T11:00:00.000000Z"
    }
}
```

---

## 49. Delete Serviceman Achievement

Delete an achievement entry.

**Endpoint:** `DELETE /api/serviceman/achievement/{id}`

**Authentication:** Required (Serviceman token)

**Response (200):**
```json
{
    "success": true,
    "message": "Achievement deleted successfully"
}
```

---

## 50. Get Brahman Experiences

Get list of all experiences for the authenticated brahman.

**Endpoint:** `GET /api/brahman/experiences`

**Authentication:** Required (Brahman token)

**Response (200):**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "title": "Head Priest",
            "company": "Shiva Temple",
            "description": "Led daily rituals and special ceremonies",
            "years": 10,
            "start_date": "2014-01-01",
            "end_date": "2024-01-01",
            "created_at": "2024-01-01T10:00:00.000000Z",
            "updated_at": "2024-01-01T10:00:00.000000Z"
        }
    ]
}
```

---

## 51. Add Brahman Experience

Add a new experience entry for the authenticated brahman.

**Endpoint:** `POST /api/brahman/experience/add`

**Authentication:** Required (Brahman token)

**Request Body:**
```json
{
    "title": "Head Priest",
    "company": "Shiva Temple",
    "description": "Led daily rituals and special ceremonies",
    "years": 10,
    "start_date": "2014-01-01",
    "end_date": "2024-01-01"
}
```

**Response (201):**
```json
{
    "success": true,
    "message": "Experience added successfully",
    "data": {
        "id": 1,
        "brahman_id": 1,
        "title": "Head Priest",
        "company": "Shiva Temple",
        "description": "Led daily rituals and special ceremonies",
        "years": 10,
        "start_date": "2014-01-01",
        "end_date": "2024-01-01",
        "created_at": "2024-01-01T10:00:00.000000Z",
        "updated_at": "2024-01-01T10:00:00.000000Z"
    }
}
```

---

## 52. Update Brahman Experience

Update an existing experience entry.

**Endpoint:** `PUT /api/brahman/experience/{id}`

**Authentication:** Required (Brahman token)

**Request Body:**
```json
{
    "title": "Senior Head Priest",
    "company": "Vishnu Temple",
    "description": "Managed team of 5 priests for major festivals",
    "years": 12,
    "start_date": "2012-01-01",
    "end_date": "2024-01-01"
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Experience updated successfully",
    "data": {
        "id": 1,
        "brahman_id": 1,
        "title": "Senior Head Priest",
        "company": "Vishnu Temple",
        "description": "Managed team of 5 priests for major festivals",
        "years": 12,
        "start_date": "2012-01-01",
        "end_date": "2024-01-01",
        "created_at": "2024-01-01T10:00:00.000000Z",
        "updated_at": "2024-01-01T11:00:00.000000Z"
    }
}
```

---

## 53. Delete Brahman Experience

Delete an experience entry.

**Endpoint:** `DELETE /api/brahman/experience/{id}`

**Authentication:** Required (Brahman token)

**Response (200):**
```json
{
    "success": true,
    "message": "Experience deleted successfully"
}
```

---

## 54. Get Brahman Achievements

Get list of all achievements for the authenticated brahman.

**Endpoint:** `GET /api/brahman/achievements`

**Authentication:** Required (Brahman token)

**Response (200):**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "title": "Best Priest 2023",
            "description": "Awarded for exceptional ritual performance",
            "date": "2023-12-01",
            "organization": "Religious Council",
            "created_at": "2024-01-01T10:00:00.000000Z",
            "updated_at": "2024-01-01T10:00:00.000000Z"
        }
    ]
}
```

---

## 55. Add Brahman Achievement

Add a new achievement entry for the authenticated brahman.

**Endpoint:** `POST /api/brahman/achievement/add`

**Authentication:** Required (Brahman token)

**Request Body:**
```json
{
    "title": "Best Priest 2023",
    "description": "Awarded for exceptional ritual performance",
    "date": "2023-12-01",
    "organization": "Religious Council"
}
```

**Response (201):**
```json
{
    "success": true,
    "message": "Achievement added successfully",
    "data": {
        "id": 1,
        "brahman_id": 1,
        "title": "Best Priest 2023",
        "description": "Awarded for exceptional ritual performance",
        "date": "2023-12-01",
        "organization": "Religious Council",
        "created_at": "2024-01-01T10:00:00.000000Z",
        "updated_at": "2024-01-01T10:00:00.000000Z"
    }
}
```

---

## 56. Update Brahman Achievement

Update an existing achievement entry.

**Endpoint:** `PUT /api/brahman/achievement/{id}`

**Authentication:** Required (Brahman token)

**Request Body:**
```json
{
    "title": "Excellence in Rituals 2023",
    "description": "Recognized for outstanding ceremonial performance",
    "date": "2023-12-15",
    "organization": "Temple Association"
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Achievement updated successfully",
    "data": {
        "id": 1,
        "brahman_id": 1,
        "title": "Excellence in Rituals 2023",
        "description": "Recognized for outstanding ceremonial performance",
        "date": "2023-12-15",
        "organization": "Temple Association",
        "created_at": "2024-01-01T10:00:00.000000Z",
        "updated_at": "2024-01-01T11:00:00.000000Z"
    }
}
```

---

## 57. Delete Brahman Achievement

Delete an achievement entry.

**Endpoint:** `DELETE /api/brahman/achievement/{id}`

**Authentication:** Required (Brahman token)

**Response (200):**
```json
{
    "success": true,
    "message": "Achievement deleted successfully"
}
```

---

## 58. Delete User Account

Permanently delete the authenticated user's account and all associated data.

**Endpoint:** `DELETE /api/user/delete-account`

**Authentication:** Required

**Response (200):**
```json
{
    "success": true,
    "message": "User account deleted successfully"
}
```

**Note:**
- This action is irreversible
- All user tokens will be revoked
- All related data will be deleted:
  - Bookings
  - Profile information
- User account will be permanently deleted

---

## 59. Delete Serviceman Account

Permanently delete the authenticated serviceman's account and all associated data.

**Endpoint:** `DELETE /api/serviceman/delete-account`

**Authentication:** Required

**Response (200):**
```json
{
    "success": true,
    "message": "Serviceman account deleted successfully"
}
```

**Note:**
- This action is irreversible
- All serviceman tokens will be revoked
- All related data will be deleted:
  - Service prices
  - Experiences
  - Achievements
  - Service associations
  - Bookings
- Serviceman account will be permanently deleted

---

## 60. Delete Brahman Account

Permanently delete the authenticated brahman's account and all associated data.

**Endpoint:** `DELETE /api/brahman/delete-account`

**Authentication:** Required

**Response (200):**
```json
{
    "success": true,
    "message": "Brahman account deleted successfully"
}
```

**Note:**
- This action is irreversible
- All brahman tokens will be revoked
- All related data will be deleted:
  - Puja prices
  - Material files
  - Experiences
  - Achievements
  - Bookings
- Brahman account will be permanently deleted

---

## Error Responses

### 400 Bad Request (Validation Errors)
```json
{
    "message": "You already book this service",
    "errors": {
        "service_id": ["You already book this service"]
    }
}
```

### 401 Unauthorized
```json
{
    "message": "Unauthenticated."
}
```

### 403 Forbidden
```json
{
    "message": "You are not assigned to this booking",
    "errors": {
        "booking_id": ["You are not assigned to this booking"]
    }
}
```

### 404 Not Found
```json
{
    "message": "Booking not found",
    "errors": {
        "booking_id": ["Booking not found"]
    }
}
```

**Note:** All error responses follow the same format with `message` and `errors` fields for consistency across the API.

---

## Support

For API support or questions, please contact the development team.
