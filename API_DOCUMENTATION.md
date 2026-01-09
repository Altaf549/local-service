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
            "status": "active"
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
```

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
            "availability_status": "available"
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
```

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
            "availability_status": "available"
        },
        "token": "4|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    }
}
```

**Note:** Brahmans can login even if their status is inactive. Only admin can change the status through the admin panel.

---

## 7. Get All Service Categories

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

## 8. Get All Services

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

## 9. Get All Puja Types

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

## 10. Get All Pujas

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

## 11. Get All Servicemen (Active)

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

## 12. Get All Brahmans (Active)

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

## 13. Home API

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

## 14. Get Service Category Details

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

## 15. Get Puja Type Details

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

## 16. Get Service Details

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
```

---

## 17. Get Puja Details

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
```

---

## 18. Serviceman Profile Update

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

## 19. Brahman Profile Update

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

## 20. Update Service Price (Serviceman-wise)

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
    "price": 750.00
}
```

**Note:** Make sure to set the `Content-Type: application/json` header when sending the request.

**Response (200):**
```json
{
    "success": true,
    "message": "Serviceman service price updated successfully",
    "data": {
        "id": 1,
        "serviceman_id": 1,
        "service_id": 1,
        "price": "750.00",
        "serviceman": {
            "id": 1,
            "name": "Service Provider"
        },
        "service": {
            "id": 1,
            "service_name": "Plumbing"
        }
    }
}
```

**Error Responses:**

**403 - Not a Serviceman:**
```json
{
    "success": false,
    "message": "Only servicemen can update service prices."
}
```

**403 - Inactive Account:**
```json
{
    "success": false,
    "message": "Your account is inactive. You cannot update service prices. Please contact support."
}
```

**Note:** 
- The `serviceman_id` is automatically taken from the authenticated serviceman's token.
- Only servicemen can update service prices (not regular users or brahmans).
- Only active servicemen can update prices. Inactive servicemen will receive an error.
- This creates or updates a serviceman-specific price for the service. Each serviceman can have their own price for the same service.

---

## 21. Update Puja Price (Brahman-wise) and Material File

Update puja price for the authenticated brahman and upload material file.

**Endpoint:** `POST /api/pujas/price/update/{id}`

**Authentication:** Required (Brahman token)

**Request Body (multipart/form-data):**
```
price: 1500.00
material_file: [file] (pdf, doc, docx, max 10MB) (optional)
```

**Response (200):**
```json
{
    "success": true,
    "message": "Brahman puja price and material file updated successfully",
    "data": {
        "id": 1,
        "brahman_id": 1,
        "puja_id": 1,
        "price": "1500.00",
        "material_file": "pujas/materials/file.pdf",
        "brahman": {
            "id": 1,
            "name": "Brahman Name"
        },
        "puja": {
            "id": 1,
            "puja_name": "Ganesh Puja"
        }
    }
}
```

**Error Responses:**

**403 - Not a Brahman:**
```json
{
    "success": false,
    "message": "Only brahmans can update puja prices."
}
```

**403 - Inactive Account:**
```json
{
    "success": false,
    "message": "Your account is inactive. You cannot update puja prices. Please contact support."
}
```

**Note:** 
- The `brahman_id` is automatically taken from the authenticated brahman's token.
- Only brahmans can update puja prices (not regular users or servicemen).
- Only active brahmans can update prices. Inactive brahmans will receive an error.
- This creates or updates a brahman-specific price and material file for the puja. Each brahman can have their own price and material file for the same puja.
- The `material_file` is optional and stored in the `brahman_puja_prices` table (not on the puja table), allowing each brahman to have their own material file for each puja.

---

## 22. User Profile Update

Update user profile information.

**Endpoint:** `POST /api/user/profile/update`

**Authentication:** Required (User token)

**Request Body (multipart/form-data):**
```
current_password: "currentpassword123" (required)
name: "John Updated" (optional)
email: "johnupdated@example.com" (optional)
mobile_number: "1234567891" (optional)
address: "123 Main Street, City, State, ZIP" (optional)
new_password: "newpassword123" (optional)
profile_photo: [file] (image, max 2MB) (optional)
```

**Request Body (JSON - without image):**
```json
{
    "current_password": "currentpassword123",
    "name": "John Updated",
    "email": "johnupdated@example.com",
    "mobile_number": "1234567891",
    "address": "123 Main Street, City, State, ZIP",
    "new_password": "newpassword123"
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Profile updated successfully",
    "data": {
        "id": 1,
        "name": "John Updated",
        "email": "johnupdated@example.com",
        "mobile_number": "1234567891",
        "address": "123 Main Street, City, State, ZIP",
        "profile_photo": "users/profiles/photo.jpg",
        "profile_photo_url": "http://your-domain.com/storage/users/profiles/photo.jpg"
    }
}
```

**Error Response (422):**
```json
{
    "success": false,
    "message": "Current password is incorrect."
}
```

**Note:**
- `current_password` is **required** for all profile updates (including image uploads).
- All other fields are optional. Only include the fields you want to update.
- Use `new_password` to change the password (not `password`).
- When uploading a profile photo, use `multipart/form-data` content type.
- The old profile photo will be automatically deleted when a new one is uploaded.
- Supported image formats: JPEG, PNG, JPG (Max 2MB).

---

## 23. Add Serviceman Experience

Add a new experience entry to serviceman profile.

**Endpoint:** `POST /api/serviceman/experience/add`

**Authentication:** Required (Serviceman token)

**Request Body:**
```json
{
    "title": "Senior Plumber",
    "description": "Worked as senior plumber for 5 years",
    "years": 5,
    "company": "ABC Plumbing Services",
    "start_date": "2019-01-01",
    "end_date": "2024-01-01",
    "is_current": false
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
        "title": "Senior Plumber",
        "description": "Worked as senior plumber for 5 years",
        "years": 5,
        "company": "ABC Plumbing Services",
        "start_date": "2019-01-01",
        "end_date": "2024-01-01",
        "is_current": false,
        "created_at": "2026-01-07T10:00:00.000000Z",
        "updated_at": "2026-01-07T10:00:00.000000Z"
    }
}
```

**Note:**
- All fields except `serviceman_id` are optional.
- Multiple experience entries can be added.
- `is_current` should be `true` if the experience is ongoing (in which case `end_date` can be null).

---

## 24. Add Brahman Experience

Add a new experience entry to brahman profile.

**Endpoint:** `POST /api/brahman/experience/add`

**Authentication:** Required (Brahman token)

**Request Body:**
```json
{
    "title": "Vedic Scholar",
    "description": "Specialized in Vedic rituals and ceremonies",
    "years": 12,
    "organization": "Temple Trust",
    "start_date": "2012-01-01",
    "end_date": "2024-01-01",
    "is_current": false
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
        "title": "Vedic Scholar",
        "description": "Specialized in Vedic rituals and ceremonies",
        "years": 12,
        "organization": "Temple Trust",
        "start_date": "2012-01-01",
        "end_date": "2024-01-01",
        "is_current": false,
        "created_at": "2026-01-07T10:00:00.000000Z",
        "updated_at": "2026-01-07T10:00:00.000000Z"
    }
}
```

**Note:**
- All fields except `brahman_id` are optional.
- Multiple experience entries can be added.
- `is_current` should be `true` if the experience is ongoing (in which case `end_date` can be null).

---

## 25. Add Serviceman Achievement

Add a new achievement entry to serviceman profile.

**Endpoint:** `POST /api/serviceman/achievement/add`

**Authentication:** Required (Serviceman token)

**Request Body:**
```json
{
    "title": "Best Service Provider 2024",
    "description": "Awarded for outstanding service quality",
    "achieved_date": "2024-12-31"
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
        "title": "Best Service Provider 2024",
        "description": "Awarded for outstanding service quality",
        "achieved_date": "2024-12-31",
        "created_at": "2026-01-07T10:00:00.000000Z",
        "updated_at": "2026-01-07T10:00:00.000000Z"
    }
}
```

**Note:**
- `title` is required.
- `description` and `achieved_date` are optional.
- Multiple achievement entries can be added.

---

## 26. Add Brahman Achievement

Add a new achievement entry to brahman profile.

**Endpoint:** `POST /api/brahman/achievement/add`

**Authentication:** Required (Brahman token)

**Request Body:**
```json
{
    "title": "Vedic Scholar Award 2024",
    "description": "Recognized for excellence in Vedic rituals",
    "achieved_date": "2024-12-31"
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
        "title": "Vedic Scholar Award 2024",
        "description": "Recognized for excellence in Vedic rituals",
        "achieved_date": "2024-12-31",
        "created_at": "2026-01-07T10:00:00.000000Z",
        "updated_at": "2026-01-07T10:00:00.000000Z"
    }
}
```

**Note:**
- `title` is required.
- `description` and `achieved_date` are optional.
- Multiple achievement entries can be added.

---

## 27. Get Serviceman Experiences

Get all experiences for the authenticated serviceman.

**Endpoint:** `GET /api/serviceman/experiences`

**Authentication:** Required (Serviceman token)

**Response (200):**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "title": "Senior Plumber",
            "description": "Worked as senior plumber for 5 years",
            "years": 5,
            "company": "ABC Plumbing Services",
            "start_date": "2019-01-01",
            "end_date": "2024-01-01",
            "is_current": false
        },
        {
            "id": 2,
            "title": "Lead Technician",
            "description": "Currently working as lead technician",
            "years": 2,
            "company": "XYZ Services",
            "start_date": "2024-01-01",
            "end_date": null,
            "is_current": true
        }
    ]
}
```

**Note:**
- Returns all experiences for the authenticated serviceman.
- Results are ordered by `start_date` in descending order (most recent first).

---

## 28. Get Serviceman Achievements

Get all achievements for the authenticated serviceman.

**Endpoint:** `GET /api/serviceman/achievements`

**Authentication:** Required (Serviceman token)

**Response (200):**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "title": "Best Service Provider 2024",
            "description": "Awarded for outstanding service quality",
            "achieved_date": "2024-12-31"
        },
        {
            "id": 2,
            "title": "Customer Excellence Award",
            "description": "Recognized for exceptional customer service",
            "achieved_date": "2023-06-15"
        }
    ]
}
```

**Note:**
- Returns all achievements for the authenticated serviceman.
- Results are ordered by `achieved_date` in descending order (most recent first).

---

## 29. Update Serviceman Experience

Update an existing experience entry for the authenticated serviceman.

**Endpoint:** `PUT /api/serviceman/experience/{id}`

**Authentication:** Required (Serviceman token)

**URL Parameters:**
- `id` (integer, required): The ID of the experience to update

**Request Body:**
```json
{
    "title": "Senior Plumber",
    "description": "Updated description",
    "years": 6,
    "company": "ABC Plumbing Services",
    "start_date": "2019-01-01",
    "end_date": "2025-01-01",
    "is_current": false
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
        "title": "Senior Plumber",
        "description": "Updated description",
        "years": 6,
        "company": "ABC Plumbing Services",
        "start_date": "2019-01-01",
        "end_date": "2025-01-01",
        "is_current": false,
        "created_at": "2026-01-07T10:00:00.000000Z",
        "updated_at": "2026-01-07T11:00:00.000000Z"
    }
}
```

**Error Responses:**
- `404`: Experience not found or does not belong to the authenticated serviceman
- `422`: Validation error

**Note:**
- All fields are optional.
- Only experiences belonging to the authenticated serviceman can be updated.
- Use `PUT` method for this endpoint.

---

## 30. Update Serviceman Achievement

Update an existing achievement entry for the authenticated serviceman.

**Endpoint:** `PUT /api/serviceman/achievement/{id}`

**Authentication:** Required (Serviceman token)

**URL Parameters:**
- `id` (integer, required): The ID of the achievement to update

**Request Body:**
```json
{
    "title": "Best Service Provider 2024",
    "description": "Updated description",
    "achieved_date": "2024-12-31"
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
        "title": "Best Service Provider 2024",
        "description": "Updated description",
        "achieved_date": "2024-12-31",
        "created_at": "2026-01-07T10:00:00.000000Z",
        "updated_at": "2026-01-07T11:00:00.000000Z"
    }
}
```

**Error Responses:**
- `404`: Achievement not found or does not belong to the authenticated serviceman
- `422`: Validation error (title is required)

**Note:**
- `title` is required.
- Only achievements belonging to the authenticated serviceman can be updated.
- Use `PUT` method for this endpoint.

---

## 31. Get Brahman Experiences

Get all experiences for the authenticated brahman.

**Endpoint:** `GET /api/brahman/experiences`

**Authentication:** Required (Brahman token)

**Response (200):**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "title": "Vedic Scholar",
            "description": "Specialized in Vedic rituals and ceremonies",
            "years": 12,
            "organization": "Temple Trust",
            "start_date": "2012-01-01",
            "end_date": "2024-01-01",
            "is_current": false
        },
        {
            "id": 2,
            "title": "Senior Priest",
            "description": "Currently serving as senior priest",
            "years": 3,
            "organization": "Shiva Temple",
            "start_date": "2023-01-01",
            "end_date": null,
            "is_current": true
        }
    ]
}
```

**Note:**
- Returns all experiences for the authenticated brahman.
- Results are ordered by `start_date` in descending order (most recent first).

---

## 32. Get Brahman Achievements

Get all achievements for the authenticated brahman.

**Endpoint:** `GET /api/brahman/achievements`

**Authentication:** Required (Brahman token)

**Response (200):**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "title": "Vedic Scholar Award 2024",
            "description": "Recognized for excellence in Vedic rituals",
            "achieved_date": "2024-12-31"
        },
        {
            "id": 2,
            "title": "Excellence in Rituals",
            "description": "Awarded for outstanding performance in religious ceremonies",
            "achieved_date": "2023-08-20"
        }
    ]
}
```

**Note:**
- Returns all achievements for the authenticated brahman.
- Results are ordered by `achieved_date` in descending order (most recent first).

---

## 33. Update Brahman Experience

Update an existing experience entry for the authenticated brahman.

**Endpoint:** `PUT /api/brahman/experience/{id}`

**Authentication:** Required (Brahman token)

**URL Parameters:**
- `id` (integer, required): The ID of the experience to update

**Request Body:**
```json
{
    "title": "Vedic Scholar",
    "description": "Updated description",
    "years": 13,
    "organization": "Temple Trust",
    "start_date": "2012-01-01",
    "end_date": "2025-01-01",
    "is_current": false
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
        "title": "Vedic Scholar",
        "description": "Updated description",
        "years": 13,
        "organization": "Temple Trust",
        "start_date": "2012-01-01",
        "end_date": "2025-01-01",
        "is_current": false,
        "created_at": "2026-01-07T10:00:00.000000Z",
        "updated_at": "2026-01-07T11:00:00.000000Z"
    }
}
```

**Error Responses:**
- `404`: Experience not found or does not belong to the authenticated brahman
- `422`: Validation error

**Note:**
- All fields are optional.
- Only experiences belonging to the authenticated brahman can be updated.
- Use `PUT` method for this endpoint.

---

## 34. Update Brahman Achievement

Update an existing achievement entry for the authenticated brahman.

**Endpoint:** `PUT /api/brahman/achievement/{id}`

**Authentication:** Required (Brahman token)

**URL Parameters:**
- `id` (integer, required): The ID of the achievement to update

**Request Body:**
```json
{
    "title": "Vedic Scholar Award 2024",
    "description": "Updated description",
    "achieved_date": "2024-12-31"
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
        "title": "Vedic Scholar Award 2024",
        "description": "Updated description",
        "achieved_date": "2024-12-31",
        "created_at": "2026-01-07T10:00:00.000000Z",
        "updated_at": "2026-01-07T11:00:00.000000Z"
    }
}
```

**Error Responses:**
- `404`: Achievement not found or does not belong to the authenticated brahman
- `422`: Validation error (title is required)

**Note:**
- `title` is required.
- Only achievements belonging to the authenticated brahman can be updated.
- Use `PUT` method for this endpoint.

---

## 35. Delete Serviceman Experience

Delete an experience entry for the authenticated serviceman.

**Endpoint:** `DELETE /api/serviceman/experience/{id}`

**Authentication:** Required (Serviceman token)

**URL Parameters:**
- `id` (integer, required): The ID of the experience to delete

**Response (200):**
```json
{
    "success": true,
    "message": "Experience deleted successfully"
}
```

**Error Responses:**
- `404`: Experience not found or does not belong to the authenticated serviceman

**Note:**
- Only experiences belonging to the authenticated serviceman can be deleted.
- Use `DELETE` method for this endpoint.

---

## 36. Delete Serviceman Achievement

Delete an achievement entry for the authenticated serviceman.

**Endpoint:** `DELETE /api/serviceman/achievement/{id}`

**Authentication:** Required (Serviceman token)

**URL Parameters:**
- `id` (integer, required): The ID of the achievement to delete

**Response (200):**
```json
{
    "success": true,
    "message": "Achievement deleted successfully"
}
```

**Error Responses:**
- `404`: Achievement not found or does not belong to the authenticated serviceman

**Note:**
- Only achievements belonging to the authenticated serviceman can be deleted.
- Use `DELETE` method for this endpoint.

---

## 37. Delete Brahman Experience

Delete an experience entry for the authenticated brahman.

**Endpoint:** `DELETE /api/brahman/experience/{id}`

**Authentication:** Required (Brahman token)

**URL Parameters:**
- `id` (integer, required): The ID of the experience to delete

**Response (200):**
```json
{
    "success": true,
    "message": "Experience deleted successfully"
}
```

**Error Responses:**
- `404`: Experience not found or does not belong to the authenticated brahman

**Note:**
- Only experiences belonging to the authenticated brahman can be deleted.
- Use `DELETE` method for this endpoint.

---

## 38. Delete Brahman Achievement

Delete an achievement entry for the authenticated brahman.

**Endpoint:** `DELETE /api/brahman/achievement/{id}`

**Authentication:** Required (Brahman token)

**URL Parameters:**
- `id` (integer, required): The ID of the achievement to delete

**Response (200):**
```json
{
    "success": true,
    "message": "Achievement deleted successfully"
}
```

**Error Responses:**
- `404`: Achievement not found or does not belong to the authenticated brahman

**Note:**
- Only achievements belonging to the authenticated brahman can be deleted.
- Use `DELETE` method for this endpoint.

---

## Logout

Logout and revoke current access token.

**Endpoint:** `POST /api/logout`

**Authentication:** Required

**Response (200):**
```json
{
    "success": true,
    "message": "Logged out successfully"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
    "success": false,
    "message": "Invalid request"
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
    "success": false,
    "message": "Your account is inactive. Please contact support."
}
```

### 404 Not Found
```json
{
    "success": false,
    "message": "Resource not found"
}
```

### 422 Validation Error
```json
{
    "message": "The given data was invalid.",
    "errors": {
        "email": ["The email field is required."],
        "password": ["The password must be at least 6 characters."]
    }
}
```

### 500 Server Error
```json
{
    "success": false,
    "message": "An error occurred"
}
```

---

## 32. Get Brahman Details (Full Profile)

Get complete brahman profile including experiences, achievements, and services with pricing.

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
        "availability_status": "available",
        "government_id": "PAN123456",
        "address": "456 Temple Street, City, State",
        "profile_photo": "http://your-domain.com/storage/brahmans/profiles/photo.jpg",
        "id_proof_image": "http://your-domain.com/storage/brahmans/id-proofs/image.jpg",
        "experiences": [
            {
                "id": 1,
                "title": "Vedic Scholar",
                "description": "Specialized in Vedic rituals and ceremonies",
                "years": 12,
                "organization": "Temple Trust",
                "start_date": "2012-01-01",
                "end_date": "2024-01-01",
                "is_current": false
            }
        ],
        "achievements": [
            {
                "id": 1,
                "title": "Vedic Scholar Award 2024",
                "description": "Recognized for excellence in Vedic rituals",
                "achieved_date": "2024-12-31"
            }
        ],
       "services": [
            {
                "id": 2,
                "puja_id": 2,
                "puja_name": "Griha Pravesh Puja",
                "image": "http://192.168.1.36:8000/storage/pujas/yjAEory35SdU3XDtWACzu0rOIB8zhTwYwdokdJrU.jpg",
                "puja_type": "Home Puja",
                "duration": "2hr",
                "price": "16300.00",
                "description": "Griha Pravesh Puja",
                "material_file": "http://192.168.1.36:8000/storage/pujas/materials/5kUGNpPttTDhUIboohCbawzgaxDEwCkJKZtdjKIH.pdf"
            }
        ]
    }
}
```

**Note:**
- Returns complete profile information for the specified brahman.
- Includes all experiences and achievements.
- Includes all services/pujas the brahman offers with their specific pricing.
- Only returns brahmans with `status: "active"`.

---

## 33. Get Pujas by Type

Get all pujas belonging to a specific puja type.

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
            "puja_type": "Festival",
            "duration": "2 hours",
            "price": "1000.00",
            "description": "Ganesh Puja description",
            "image": "http://your-domain.com/storage/pujas/image.jpg"
        },
        {
            "id": 2,
            "puja_name": "Lakshmi Puja",
            "puja_type": "Festival",
            "duration": "1.5 hours",
            "price": "800.00",
            "description": "Lakshmi Puja description",
            "image": "http://your-domain.com/storage/pujas/image2.jpg"
        }
    ]
}
```

**Note:**
- Returns all active pujas for the specified puja type.
- Only returns pujas with `status: "active"`.

---

## 34. Get Puja Types

Get all available puja types.

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
            "description": "Festival special pujas and ceremonies"
        },
        {
            "id": 2,
            "type_name": "Daily",
            "description": "Daily worship and regular pujas"
        },
        {
            "id": 3,
            "type_name": "Special Occasion",
            "description": "Weddings, birthdays, and other special occasions"
        }
    ]
}
```

**Note:**
- Returns all active puja types.
- Only returns puja types with `status: "active"`.

---

## 35. Get Serviceman Details (Full Profile)

Get complete serviceman profile including experiences, achievements, and services with pricing.

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
        "phone": "9876543210",
        "mobile_number": "9876543210",
        "category": {
            "id": 1,
            "category_name": "Home Services"
        },
        "experience": 5,
        "availability_status": "available",
        "government_id": "AADHAAR123456",
        "address": "123 Main Street, City, State",
        "profile_photo": "http://your-domain.com/storage/servicemen/profiles/photo.jpg",
        "id_proof_image": "http://your-domain.com/storage/servicemen/id-proofs/image.jpg",
        "experiences": [
            {
                "id": 1,
                "title": "Senior Plumber",
                "description": "Worked as senior plumber for 5 years",
                "years": 5,
                "company": "ABC Plumbing Services",
                "start_date": "2019-01-01",
                "end_date": "2024-01-01",
                "is_current": false
            }
        ],
        "achievements": [
            {
                "id": 1,
                "title": "Best Service Provider 2024",
                "description": "Awarded for outstanding service quality",
                "achieved_date": "2024-12-31"
            }
        ],
        "services": [
            {
                "id": 1,
                "service_id": 1,
                "service_name": "Plumbing",
                "category": {
                    "id": 1,
                    "category_name": "Home Services"
                },
                "duration": "Professional plumbing services",
                "price": "750.00",
                "description": "Professional plumbing services",
                "image": "http://your-domain.com/storage/services/image.jpg"
            }
        ]
    }
}
```

**Note:**
- Returns complete profile information for the specified serviceman.
- Includes all experiences and achievements.
- Includes all services the serviceman offers with their specific pricing.
- Only returns servicemen with `status: "active"`.

---

## 36. Get Services by Category

Get all services belonging to a specific service category.

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
            "category": {
                "id": 1,
                "category_name": "Home Services"
            },
            "price": "500.00",
            "description": "Professional plumbing services",
            "image": "http://your-domain.com/storage/services/image.jpg"
        },
        {
            "id": 2,
            "service_name": "Electrical Work",
            "category": {
                "id": 1,
                "category_name": "Home Services"
            },
            "price": "600.00",
            "description": "Professional electrical services",
            "image": "http://your-domain.com/storage/services/image2.jpg"
        }
    ]
}
```

**Note:**
- Returns all active services for the specified category.
- Only returns services with `status: "active"`.

---

## Notes

1. **File Uploads**: For image uploads, use `multipart/form-data` content type. Supported formats:
   - Images: JPEG, PNG, JPG (max 2MB)
   - Material Files: PDF, DOC, DOCX (max 10MB)

2. **Authentication**: Include the token in the Authorization header for protected endpoints:
   ```
   Authorization: Bearer {your_token_here}
   ```

3. **Status Values**:
   - User/Serviceman/Brahman: `active`, `inactive`
   - Service/Puja/Category: `active`, `inactive`
   - Availability: `available`, `unavailable`

4. **Image URLs**: All image URLs are returned as full URLs using `asset('storage/...')` helper.

5. **Pagination**: Currently, all list endpoints return all records. Pagination can be added if needed.

6. **Rate Limiting**: API endpoints may be rate-limited. Check response headers for rate limit information.

---

## Testing with cURL Examples

### User Registration
```bash
curl -X POST http://your-domain.com/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "mobile_number": "1234567890",
    "password": "password123"
  }'
```

### User Login
```bash
curl -X POST http://your-domain.com/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Home Data
```bash
curl -X GET http://your-domain.com/api/home \
  -H "Content-Type: application/json"
```

### Update Profile (with file)
```bash
curl -X POST http://your-domain.com/api/serviceman/profile/update \
  -H "Authorization: Bearer {token}" \
  -F "government_id=AADHAAR123456" \
  -F "address=123 Main Street" \
  -F "id_proof_image=@/path/to/image.jpg" \
  -F "profile_photo=@/path/to/photo.jpg"
```

---

## Support

For API support or questions, please contact the development team.

