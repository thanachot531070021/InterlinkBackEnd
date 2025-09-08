# 📁 File Upload System Testing Guide

## 🎯 Overview
ระบบการอัพโหลดไฟล์แบบ Configurable Storage Provider (Local/S3)

## 🛠️ Features to Test

### 1. Storage Provider Configuration
- [x] Local Storage Provider
- [x] S3 Storage Provider  
- [x] Environment-based Provider Switching
- [x] Provider Abstraction Interface

### 2. File Upload Endpoints

#### 2.1 General File Upload
```http
POST /api/uploads/file
Content-Type: multipart/form-data

Body:
- file: [FILE]
- type: "image" | "document" | "avatar"
- folder: "products" | "brands" | "stores" | "avatars" | "documents"
```

#### 2.2 Product Image Upload
```http
POST /api/uploads/product-image
Content-Type: multipart/form-data

Body:
- file: [IMAGE_FILE]
- productId: "uuid" (optional)
```

### 3. File Validation Tests

#### 3.1 File Type Validation
- ✅ Image files (.jpg, .jpeg, .png, .webp)
- ✅ Document files (.pdf, .doc, .docx)
- ❌ Executable files (.exe, .bat, .sh)
- ❌ Script files (.js, .php, .py)

#### 3.2 File Size Validation
- ✅ Files under 50MB
- ❌ Files over 50MB limit

#### 3.3 MIME Type Validation
- ✅ Valid image MIME types
- ✅ Valid document MIME types
- ❌ Invalid/suspicious MIME types

## 🧪 Test Cases

### Test Case 1: Local Storage Upload
```bash
curl -X POST http://localhost:3001/api/uploads/file \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@test-image.jpg" \
  -F "type=image" \
  -F "folder=products"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "filename": "generated-filename.jpg",
    "originalName": "test-image.jpg",
    "url": "http://localhost:3001/uploads/products/generated-filename.jpg",
    "size": 12345,
    "mimeType": "image/jpeg",
    "provider": "local",
    "type": "image",
    "folder": "products"
  }
}
```

### Test Case 2: S3 Storage Upload
```bash
# Set environment variables
STORAGE_PROVIDER=s3
AWS_S3_ENDPOINT=http://localhost:9000
AWS_S3_BUCKET_NAME=interlink-dev

curl -X POST http://localhost:3001/api/uploads/file \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@test-image.jpg" \
  -F "type=image" \
  -F "folder=products"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "filename": "generated-filename.jpg",
    "originalName": "test-image.jpg",
    "url": "http://localhost:9000/interlink-dev/products/generated-filename.jpg",
    "size": 12345,
    "mimeType": "image/jpeg",
    "provider": "s3",
    "type": "image",
    "folder": "products"
  }
}
```

### Test Case 3: Product Image Upload
```bash
curl -X POST http://localhost:3001/api/uploads/product-image \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@product-image.jpg" \
  -F "productId=550e8400-e29b-41d4-a716-446655440000"
```

### Test Case 4: File Validation Errors
```bash
# Test oversized file
curl -X POST http://localhost:3001/api/uploads/file \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@large-file-60mb.zip" \
  -F "type=document" \
  -F "folder=documents"
```

**Expected Response:**
```json
{
  "success": false,
  "error": {
    "message": "File too large. Maximum size is 50MB",
    "code": "FILE_TOO_LARGE"
  }
}
```

### Test Case 5: Invalid File Type
```bash
# Test executable file
curl -X POST http://localhost:3001/api/uploads/file \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@malicious.exe" \
  -F "type=document" \
  -F "folder=documents"
```

**Expected Response:**
```json
{
  "success": false,
  "error": {
    "message": "Invalid file type. Only images and documents are allowed",
    "code": "INVALID_FILE_TYPE"
  }
}
```

## 🔧 Environment Setup for Testing

### Local Storage Testing
```env
STORAGE_PROVIDER="local"
UPLOAD_PATH="./uploads"
UPLOAD_BASE_URL="http://localhost:3001/uploads"
MAX_FILE_SIZE=52428800
```

### S3 Storage Testing (MinIO)
```env
STORAGE_PROVIDER="s3"
AWS_S3_ENDPOINT="http://localhost:9000"
AWS_S3_BUCKET_NAME="interlink-dev"
AWS_S3_REGION="us-east-1"
AWS_ACCESS_KEY_ID="minioadmin"
AWS_SECRET_ACCESS_KEY="minioadmin"
AWS_S3_FORCE_PATH_STYLE=true
```

## ✅ Validation Checklist

### Security Validation
- [ ] File content validation (not just extension)
- [ ] MIME type verification
- [ ] File size limits enforced
- [ ] Path traversal prevention
- [ ] Malicious file detection

### Storage Provider Tests
- [ ] Local storage upload successful
- [ ] S3 storage upload successful
- [ ] Environment switching works correctly
- [ ] File URLs generated properly
- [ ] File cleanup on errors

### API Response Tests
- [ ] Successful upload response format
- [ ] Error response format
- [ ] Database record creation
- [ ] File metadata accuracy

### Edge Cases
- [ ] Empty file upload
- [ ] Missing required fields
- [ ] Unsupported file types
- [ ] Network interruption during upload
- [ ] Storage provider unavailable

## 📊 Performance Tests

### Load Testing
```bash
# Upload multiple files simultaneously
for i in {1..10}; do
  curl -X POST http://localhost:3001/api/uploads/file \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    -F "file=@test-image-$i.jpg" \
    -F "type=image" \
    -F "folder=products" &
done
```

### Storage Space Tests
- [ ] Local disk space monitoring
- [ ] S3 bucket quota monitoring
- [ ] File cleanup mechanisms

---

## 🚨 Common Issues & Solutions

### Issue 1: "Storage provider not configured"
**Solution:** Check environment variables and provider initialization

### Issue 2: "File not found after upload"
**Solution:** Verify file paths and storage provider connectivity

### Issue 3: "Permission denied"
**Solution:** Check file system permissions for local storage

### Issue 4: "S3 connection failed"
**Solution:** Verify S3 credentials and endpoint configuration

---

*Last Updated: 2025-09-07*
*Status: Phase 5 - File Upload System Testing Ready*