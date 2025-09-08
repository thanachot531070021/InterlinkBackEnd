# File Upload APIs

## Overview

File Upload APIs handle file storage operations including uploading images, documents, and other files. The system supports both local storage and S3-compatible cloud storage with automatic file type validation and security measures.

**Base URL**: `/uploads`

## Authentication Required

All endpoints require JWT authentication with appropriate roles.

---

## File Types Supported

| Type | Extensions | Max Size | Use Case |
|------|------------|----------|----------|
| IMAGE | jpg, jpeg, png, gif, webp | 10MB | Product images, brand logos, store logos |
| AVATAR | jpg, jpeg, png | 5MB | User profile pictures |
| DOCUMENT | pdf, doc, docx, txt | 25MB | Documentation, manuals |
| VIDEO | mp4, mov, avi | 100MB | Product videos |

---

## Endpoints

### 1. Upload General File

Upload any type of file with custom parameters.

**Endpoint**: `POST /uploads/file`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN, STORE_ADMIN, STORE_STAFF  
**Content-Type**: `multipart/form-data`

#### Form Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| file | file | Yes | The file to upload |
| type | enum | Yes | File type: IMAGE, AVATAR, DOCUMENT, VIDEO |
| folder | string | No | Custom folder name |
| filename | string | No | Custom filename (without extension) |

#### Request Example
```bash
curl -X POST "http://localhost:3001/uploads/file" \
  -H "Authorization: Bearer <jwt-token>" \
  -F "file=@/path/to/image.jpg" \
  -F "type=IMAGE" \
  -F "folder=products" \
  -F "filename=iphone-15-pro-main"
```

#### Success Response (201 Created)
```json
{
  "id": "file-uuid-123",
  "originalName": "image.jpg",
  "filename": "iphone-15-pro-main.jpg",
  "mimeType": "image/jpeg",
  "size": 2048576,
  "type": "IMAGE",
  "folder": "products",
  "url": "https://example.com/uploads/products/iphone-15-pro-main.jpg",
  "publicUrl": "https://cdn.example.com/products/iphone-15-pro-main.jpg",
  "uploadedBy": "user-uuid-456",
  "uploadedAt": "2024-01-20T14:30:00.000Z",
  "metadata": {
    "width": 1024,
    "height": 768,
    "format": "jpeg",
    "hasAlpha": false
  }
}
```

#### Error Responses
```json
// 400 Bad Request - Invalid file type
{
  "statusCode": 400,
  "message": "File type not allowed. Allowed types: jpg, jpeg, png, gif, webp",
  "error": "Bad Request"
}

// 413 Payload Too Large - File too big
{
  "statusCode": 413,
  "message": "File too large. Maximum size for IMAGE is 10MB",
  "error": "Payload Too Large"
}

// 422 Unprocessable Entity - No file provided
{
  "statusCode": 422,
  "message": "No file provided",
  "error": "Unprocessable Entity"
}
```

---

### 2. Upload Product Image

Upload an image specifically for products.

**Endpoint**: `POST /uploads/product-image`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN, STORE_ADMIN  
**Content-Type**: `multipart/form-data`

#### Form Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| file | file | Yes | Image file to upload |

#### Request Example
```bash
curl -X POST "http://localhost:3001/uploads/product-image" \
  -H "Authorization: Bearer <admin-jwt-token>" \
  -F "file=@/path/to/product-image.jpg"
```

#### Success Response (201 Created)
```json
{
  "id": "file-uuid-789",
  "originalName": "product-image.jpg",
  "filename": "products/product-image-1642687800000.jpg",
  "mimeType": "image/jpeg",
  "size": 1536000,
  "type": "IMAGE",
  "folder": "products",
  "url": "https://example.com/uploads/products/product-image-1642687800000.jpg",
  "publicUrl": "https://cdn.example.com/products/product-image-1642687800000.jpg",
  "uploadedBy": "admin-uuid-123",
  "uploadedAt": "2024-01-20T14:30:00.000Z",
  "metadata": {
    "width": 800,
    "height": 600,
    "format": "jpeg",
    "hasAlpha": false
  }
}
```

---

### 3. Upload Brand Image

Upload an image specifically for brands (Admin only).

**Endpoint**: `POST /uploads/brand-image`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN  
**Content-Type**: `multipart/form-data`

#### Form Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| file | file | Yes | Brand image/logo file |

#### Request Example
```bash
curl -X POST "http://localhost:3001/uploads/brand-image" \
  -H "Authorization: Bearer <admin-jwt-token>" \
  -F "file=@/path/to/brand-logo.png"
```

#### Success Response (201 Created)
```json
{
  "id": "file-uuid-456",
  "originalName": "brand-logo.png",
  "filename": "brands/brand-logo-1642687800000.png",
  "mimeType": "image/png",
  "size": 512000,
  "type": "IMAGE",
  "folder": "brands",
  "url": "https://example.com/uploads/brands/brand-logo-1642687800000.png",
  "publicUrl": "https://cdn.example.com/brands/brand-logo-1642687800000.png",
  "uploadedBy": "admin-uuid-123",
  "uploadedAt": "2024-01-20T14:30:00.000Z",
  "metadata": {
    "width": 256,
    "height": 256,
    "format": "png",
    "hasAlpha": true
  }
}
```

---

### 4. Upload Store Image

Upload an image for store logos/branding.

**Endpoint**: `POST /uploads/store-image`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN, STORE_ADMIN  
**Content-Type**: `multipart/form-data`

#### Request Example
```bash
curl -X POST "http://localhost:3001/uploads/store-image" \
  -H "Authorization: Bearer <store-admin-jwt-token>" \
  -F "file=@/path/to/store-logo.jpg"
```

#### Success Response (201 Created)
```json
{
  "id": "file-uuid-321",
  "originalName": "store-logo.jpg",
  "filename": "stores/store-logo-1642687800000.jpg",
  "mimeType": "image/jpeg",
  "size": 768000,
  "type": "IMAGE",
  "folder": "stores",
  "url": "https://example.com/uploads/stores/store-logo-1642687800000.jpg",
  "publicUrl": "https://cdn.example.com/stores/store-logo-1642687800000.jpg",
  "uploadedBy": "store-admin-uuid-456",
  "uploadedAt": "2024-01-20T14:30:00.000Z"
}
```

---

### 5. Upload User Avatar

Upload a profile picture for the current user.

**Endpoint**: `POST /uploads/avatar`  
**Authorization**: Bearer Token  
**Role Required**: Any authenticated user  
**Content-Type**: `multipart/form-data`

#### Request Example
```bash
curl -X POST "http://localhost:3001/uploads/avatar" \
  -H "Authorization: Bearer <jwt-token>" \
  -F "file=@/path/to/avatar.jpg"
```

#### Success Response (201 Created)
```json
{
  "id": "file-uuid-654",
  "originalName": "avatar.jpg",
  "filename": "avatars/avatar-user-uuid-1642687800000.jpg",
  "mimeType": "image/jpeg",
  "size": 256000,
  "type": "AVATAR",
  "folder": "avatars",
  "url": "https://example.com/uploads/avatars/avatar-user-uuid-1642687800000.jpg",
  "publicUrl": "https://cdn.example.com/avatars/avatar-user-uuid-1642687800000.jpg",
  "uploadedBy": "user-uuid-789",
  "uploadedAt": "2024-01-20T14:30:00.000Z",
  "metadata": {
    "width": 200,
    "height": 200,
    "format": "jpeg",
    "resized": true
  }
}
```

---

### 6. Get File Information

Retrieve information about a specific file.

**Endpoint**: `GET /uploads/file/{fileId}`  
**Authorization**: Bearer Token  
**Role Required**: Any authenticated user

#### Request
```bash
curl -X GET "http://localhost:3001/uploads/file/file-uuid-123" \
  -H "Authorization: Bearer <jwt-token>"
```

#### Response
```json
{
  "id": "file-uuid-123",
  "originalName": "product-image.jpg",
  "filename": "products/iphone-15-pro-main.jpg",
  "mimeType": "image/jpeg",
  "size": 2048576,
  "type": "IMAGE",
  "folder": "products",
  "url": "https://example.com/uploads/products/iphone-15-pro-main.jpg",
  "publicUrl": "https://cdn.example.com/products/iphone-15-pro-main.jpg",
  "uploadedBy": "user-uuid-456",
  "uploadedAt": "2024-01-20T14:30:00.000Z",
  "metadata": {
    "width": 1024,
    "height": 768,
    "format": "jpeg",
    "hasAlpha": false
  },
  "usage": {
    "products": 1,
    "brands": 0,
    "stores": 0
  }
}
```

---

### 7. Get Current User Files

Retrieve files uploaded by the current user.

**Endpoint**: `GET /uploads/my-files`  
**Authorization**: Bearer Token  
**Role Required**: Any authenticated user

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| type | enum | Filter by file type: IMAGE, AVATAR, DOCUMENT, VIDEO |
| limit | number | Number of files to return (default: 50, max: 100) |
| offset | number | Number of files to skip (default: 0) |

#### Request Examples
```bash
# Get all user files
curl -X GET "http://localhost:3001/uploads/my-files" \
  -H "Authorization: Bearer <jwt-token>"

# Get only images
curl -X GET "http://localhost:3001/uploads/my-files?type=IMAGE&limit=20" \
  -H "Authorization: Bearer <jwt-token>"

# Pagination
curl -X GET "http://localhost:3001/uploads/my-files?limit=10&offset=20" \
  -H "Authorization: Bearer <jwt-token>"
```

#### Response
```json
{
  "files": [
    {
      "id": "file-uuid-123",
      "originalName": "product-image.jpg",
      "filename": "products/iphone-15-pro-main.jpg",
      "mimeType": "image/jpeg",
      "size": 2048576,
      "type": "IMAGE",
      "folder": "products",
      "url": "https://example.com/uploads/products/iphone-15-pro-main.jpg",
      "publicUrl": "https://cdn.example.com/products/iphone-15-pro-main.jpg",
      "uploadedAt": "2024-01-20T14:30:00.000Z",
      "usage": {
        "products": 1,
        "isUsed": true
      }
    },
    {
      "id": "file-uuid-456",
      "originalName": "avatar.jpg",
      "filename": "avatars/avatar-user-1642687800000.jpg",
      "mimeType": "image/jpeg",
      "size": 256000,
      "type": "AVATAR",
      "folder": "avatars",
      "url": "https://example.com/uploads/avatars/avatar-user-1642687800000.jpg",
      "uploadedAt": "2024-01-19T10:15:00.000Z",
      "usage": {
        "profile": true,
        "isUsed": true
      }
    }
  ],
  "pagination": {
    "total": 15,
    "offset": 0,
    "limit": 50,
    "hasMore": false
  },
  "summary": {
    "totalFiles": 15,
    "totalSize": 45678912,
    "byType": {
      "IMAGE": 12,
      "AVATAR": 1,
      "DOCUMENT": 2
    }
  }
}
```

---

### 8. Delete File

Delete a file uploaded by the current user.

**Endpoint**: `DELETE /uploads/file/{fileId}`  
**Authorization**: Bearer Token  
**Role Required**: Any authenticated user (own files only)

#### Request
```bash
curl -X DELETE "http://localhost:3001/uploads/file/file-uuid-123" \
  -H "Authorization: Bearer <jwt-token>"
```

#### Success Response (200 OK)
```json
{
  "message": "File deleted successfully",
  "deletedFileId": "file-uuid-123",
  "filename": "products/iphone-15-pro-main.jpg",
  "deletedAt": "2024-01-20T16:00:00.000Z"
}
```

#### Error Responses
```json
// 404 Not Found
{
  "statusCode": 404,
  "message": "File not found",
  "error": "Not Found"
}

// 403 Forbidden - Not file owner
{
  "statusCode": 403,
  "message": "You can only delete your own files",
  "error": "Forbidden"
}

// 409 Conflict - File in use
{
  "statusCode": 409,
  "message": "Cannot delete file that is currently in use",
  "error": "Conflict",
  "usage": {
    "products": 2,
    "stores": 1
  }
}
```

---

### 9. Get All Files (Admin Only)

Retrieve all files in the system (Admin only).

**Endpoint**: `GET /uploads/admin/all-files`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| type | enum | Filter by file type |
| limit | number | Number of files to return (default: 50) |
| offset | number | Number of files to skip (default: 0) |

#### Request
```bash
curl -X GET "http://localhost:3001/uploads/admin/all-files?type=IMAGE&limit=25" \
  -H "Authorization: Bearer <admin-jwt-token>"
```

#### Response
```json
{
  "files": [
    {
      "id": "file-uuid-123",
      "originalName": "product-image.jpg",
      "filename": "products/iphone-15-pro-main.jpg",
      "mimeType": "image/jpeg",
      "size": 2048576,
      "type": "IMAGE",
      "folder": "products",
      "url": "https://example.com/uploads/products/iphone-15-pro-main.jpg",
      "uploadedBy": "user-uuid-456",
      "uploadedAt": "2024-01-20T14:30:00.000Z",
      "uploader": {
        "id": "user-uuid-456",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "usage": {
        "products": 1,
        "isUsed": true
      }
    }
  ],
  "pagination": {
    "total": 1250,
    "offset": 0,
    "limit": 25,
    "hasMore": true
  },
  "systemStats": {
    "totalFiles": 1250,
    "totalSize": 2147483648,
    "byType": {
      "IMAGE": 890,
      "AVATAR": 125,
      "DOCUMENT": 205,
      "VIDEO": 30
    },
    "storageUsage": "2.0 GB",
    "unusedFiles": 45
  }
}
```

---

### 10. Delete Any File (Admin Only)

Delete any file in the system (Admin only).

**Endpoint**: `DELETE /uploads/admin/file/{fileId}`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN

#### Request
```bash
curl -X DELETE "http://localhost:3001/uploads/admin/file/file-uuid-123" \
  -H "Authorization: Bearer <admin-jwt-token>"
```

#### Success Response (200 OK)
```json
{
  "message": "File deleted successfully",
  "deletedFileId": "file-uuid-123",
  "filename": "products/iphone-15-pro-main.jpg",
  "originalUploader": "user-uuid-456",
  "deletedBy": "admin-uuid-123",
  "deletedAt": "2024-01-20T16:00:00.000Z"
}
```

---

## File Processing Features

### Automatic Image Processing
- **Resizing**: Avatar images are automatically resized to 200x200px
- **Optimization**: Images are compressed for web delivery
- **Format Conversion**: WEBP variants created for modern browsers
- **Metadata Extraction**: Image dimensions, format, and properties

### File Validation
- **MIME Type Checking**: Validates actual file type vs extension
- **Size Limits**: Enforces maximum file sizes per type
- **Virus Scanning**: Files scanned for malware (if configured)
- **Extension Whitelist**: Only allowed file extensions accepted

### Storage Options
- **Local Storage**: Files stored on server filesystem
- **S3 Compatible**: AWS S3, MinIO, or other S3-compatible services
- **CDN Integration**: Automatic CDN URL generation for faster delivery
- **Backup**: Optional automated backup to secondary storage

---

## Common Use Cases

### 1. Upload Product Images
```bash
# Upload main product image
curl -X POST "http://localhost:3001/uploads/product-image" \
  -H "Authorization: Bearer <token>" \
  -F "file=@product-main.jpg"

# Upload with custom naming
curl -X POST "http://localhost:3001/uploads/file" \
  -H "Authorization: Bearer <token>" \
  -F "file=@product-detail.jpg" \
  -F "type=IMAGE" \
  -F "folder=products" \
  -F "filename=iphone-15-pro-detail-1"
```

### 2. Bulk Upload Management
```bash
# Get all user uploaded images
curl -X GET "http://localhost:3001/uploads/my-files?type=IMAGE" \
  -H "Authorization: Bearer <token>"

# Clean up unused files
curl -X DELETE "http://localhost:3001/uploads/file/unused-file-uuid" \
  -H "Authorization: Bearer <token>"
```

### 3. Store Branding Setup
```bash
# Upload store logo
curl -X POST "http://localhost:3001/uploads/store-image" \
  -H "Authorization: Bearer <store-admin-token>" \
  -F "file=@store-logo.png"

# Update user avatar
curl -X POST "http://localhost:3001/uploads/avatar" \
  -H "Authorization: Bearer <token>" \
  -F "file=@profile-pic.jpg"
```

---

## Error Handling

### File Validation Errors
```json
// Invalid file type
{
  "statusCode": 400,
  "message": "File type 'application/pdf' not allowed for IMAGE uploads",
  "error": "Bad Request",
  "allowedTypes": ["image/jpeg", "image/png", "image/gif", "image/webp"]
}

// File too large
{
  "statusCode": 413,
  "message": "File size 15MB exceeds limit of 10MB for IMAGE files",
  "error": "Payload Too Large",
  "fileSize": 15728640,
  "limit": 10485760
}
```

### Permission Errors
```json
// Insufficient permissions
{
  "statusCode": 403,
  "message": "Only admins can upload brand images",
  "error": "Forbidden"
}

// File ownership error
{
  "statusCode": 403,
  "message": "You can only delete files you uploaded",
  "error": "Forbidden"
}
```

### Storage Errors
```json
// Storage failure
{
  "statusCode": 500,
  "message": "Failed to upload file to storage",
  "error": "Internal Server Error"
}
```

---

## Security Features

### File Security
- **Content Type Validation**: MIME type verification
- **Size Limits**: Per-type maximum file sizes
- **Name Sanitization**: Filename cleaning and uniqueness
- **Access Control**: User-based file ownership
- **Virus Scanning**: Optional malware detection

### URL Security
- **Signed URLs**: Temporary access links (for private files)
- **Access Logs**: File access tracking
- **Rate Limiting**: Upload frequency limits
- **CORS Protection**: Cross-origin request validation

---

## Notes

1. **File Ownership**: Users can only delete their own files (except admins)
2. **Usage Tracking**: System tracks which entities use each file
3. **Automatic Cleanup**: Unused files can be automatically deleted
4. **CDN Integration**: Files automatically served via CDN when configured
5. **Image Processing**: Automatic optimization and resizing for certain types
6. **Backup Strategy**: Files can be automatically backed up to secondary storage
7. **Storage Quotas**: Per-user storage limits can be enforced

---

## Configuration

### Environment Variables
```bash
# Storage Configuration
STORAGE_TYPE=local|s3
UPLOAD_PATH=./uploads
S3_BUCKET=interlink-uploads
S3_REGION=us-east-1
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key

# File Limits
MAX_FILE_SIZE_IMAGE=10485760    # 10MB
MAX_FILE_SIZE_AVATAR=5242880    # 5MB
MAX_FILE_SIZE_DOCUMENT=26214400 # 25MB
MAX_FILE_SIZE_VIDEO=104857600   # 100MB

# CDN
CDN_BASE_URL=https://cdn.example.com
ENABLE_IMAGE_PROCESSING=true
```

### Testing Examples
```bash
# Test file upload
curl -X POST "http://localhost:3001/uploads/file" \
  -H "Authorization: Bearer <token>" \
  -F "file=@test-image.jpg" \
  -F "type=IMAGE" \
  -F "folder=test"

# Test file management
FILE_ID=$(echo $UPLOAD_RESPONSE | jq -r '.id')
curl -X GET "http://localhost:3001/uploads/file/$FILE_ID" \
  -H "Authorization: Bearer <token>"

# Cleanup test file
curl -X DELETE "http://localhost:3001/uploads/file/$FILE_ID" \
  -H "Authorization: Bearer <token>"
```