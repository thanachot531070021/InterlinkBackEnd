# 🔐 Two-Factor Authentication (2FA) Testing Guide

## 🎯 Overview
ระบบ Two-Factor Authentication (2FA) แบบ TOTP พร้อม QR Code และ Backup Codes

## 🛠️ Features to Test

### 1. 2FA Management APIs
- [x] Get 2FA Status
- [x] Generate 2FA Secret + QR Code
- [x] Enable 2FA with Token Verification
- [x] Disable 2FA 
- [x] Verify 2FA Token
- [x] Regenerate Backup Codes

### 2. 2FA Authentication Flow
- [x] TOTP Token Generation (Google Authenticator/Authy)
- [x] Backup Code Usage
- [x] Secret Key Management
- [x] QR Code Generation

## 🧪 Test Cases

### Test Case 1: Check 2FA Status
```http
GET /api/auth/2fa/status
Authorization: Bearer YOUR_JWT_TOKEN
```

**Example Request:**
```bash
curl -X GET http://localhost:3001/api/auth/2fa/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "enabled": false,
  "backupCodesCount": 0
}
```

### Test Case 2: Generate 2FA Secret
```http
POST /api/auth/2fa/generate
Authorization: Bearer YOUR_JWT_TOKEN
```

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/auth/2fa/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "qrCodeUrl": "otpauth://totp/Interlink%20(user@example.com)?secret=JBSWY3DPEHPK3PXP&issuer=Interlink%20System",
    "qrCodeDataURL": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "backupCodes": [
      "A1B2C3D4",
      "E5F6G7H8",
      "I9J0K1L2",
      "M3N4O5P6",
      "Q7R8S9T0"
    ]
  }
}
```

### Test Case 3: Enable 2FA
```http
POST /api/auth/2fa/enable
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "secret": "JBSWY3DPEHPK3PXP",
  "token": "123456"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/auth/2fa/enable \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "JBSWY3DPEHPK3PXP",
    "token": "123456"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Two-factor authentication enabled successfully"
}
```

### Test Case 4: Verify 2FA Token
```http
POST /api/auth/2fa/verify
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "token": "123456"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/auth/2fa/verify \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "123456"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "valid": true
  }
}
```

### Test Case 5: Verify with Backup Code
```http
POST /api/auth/2fa/verify
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "backupCode": "A1B2C3D4"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/auth/2fa/verify \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "backupCode": "A1B2C3D4"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "valid": true
  }
}
```

### Test Case 6: Regenerate Backup Codes
```http
POST /api/auth/2fa/backup-codes/regenerate
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "token": "123456"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/auth/2fa/backup-codes/regenerate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "123456"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "backupCodes": [
      "Z9Y8X7W6",
      "V5U4T3S2",
      "R1Q0P9O8",
      "N7M6L5K4",
      "J3I2H1G0"
    ]
  },
  "message": "Backup codes regenerated successfully. Please save these codes in a safe place."
}
```

### Test Case 7: Disable 2FA with Token
```http
DELETE /api/auth/2fa/disable
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "token": "123456"
}
```

**Example Request:**
```bash
curl -X DELETE http://localhost:3001/api/auth/2fa/disable \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "123456"
  }'
```

### Test Case 8: Disable 2FA with Backup Code
```http
DELETE /api/auth/2fa/disable
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "backupCode": "A1B2C3D4"
}
```

**Example Request:**
```bash
curl -X DELETE http://localhost:3001/api/auth/2fa/disable \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "backupCode": "A1B2C3D4"
  }'
```

## 🔧 Test Setup Requirements

### 1. Mobile Authenticator App
Download one of these apps:
- **Google Authenticator** (iOS/Android)
- **Authy** (iOS/Android/Desktop)
- **Microsoft Authenticator** (iOS/Android)

### 2. QR Code Testing
1. Generate 2FA secret using API
2. Scan QR code with authenticator app
3. Use generated 6-digit code to verify

### 3. Manual Secret Entry
If QR code scanning fails:
1. Use the `secret` field from generate API
2. Manually enter secret in authenticator app
3. Account name: "Interlink (your-email@example.com)"
4. Issuer: "Interlink System"

## ✅ Validation Checklist

### Basic 2FA Flow
- [ ] User can check 2FA status
- [ ] Secret generation creates valid QR code
- [ ] QR code can be scanned by authenticator apps
- [ ] TOTP token validation works correctly
- [ ] 2FA can be enabled successfully
- [ ] 2FA status reflects enabled state

### Backup Codes
- [ ] 10 backup codes generated
- [ ] Backup codes are 8 characters long
- [ ] Each backup code can only be used once
- [ ] Used backup codes marked as consumed
- [ ] Backup codes can be regenerated
- [ ] Old backup codes invalidated when regenerated

### Security Validation
- [ ] Secret stored encrypted in database
- [ ] QR code contains correct parameters
- [ ] Invalid tokens rejected
- [ ] Time window validation (±30 seconds)
- [ ] Backup codes hashed in database
- [ ] 2FA required for sensitive operations

### Error Handling
- [ ] Invalid token returns proper error
- [ ] Used backup code returns error
- [ ] Non-existent user handled gracefully
- [ ] Already enabled 2FA handled correctly
- [ ] Network failures handled properly

## 🚨 Edge Cases to Test

### Invalid Tokens
```bash
curl -X POST http://localhost:3001/api/auth/2fa/verify \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"token": "000000"}'
```
**Expected:** `{"success": true, "data": {"valid": false}}`

### Already Used Backup Code
```bash
# Use same backup code twice
curl -X POST http://localhost:3001/api/auth/2fa/verify \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"backupCode": "USED_CODE"}'
```
**Expected:** `{"success": true, "data": {"valid": false}}`

### Enable 2FA with Wrong Token
```bash
curl -X POST http://localhost:3001/api/auth/2fa/enable \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"secret": "INVALID", "token": "000000"}'
```
**Expected:** Error response

## 📱 Mobile App Testing Flow

### Google Authenticator
1. Open Google Authenticator
2. Tap "+" to add account
3. Choose "Scan QR code"
4. Scan generated QR code
5. Verify account appears with 6-digit code
6. Use code to enable 2FA

### Manual Entry Flow
1. Choose "Enter a setup key"
2. Enter account name: "Interlink (your-email)"
3. Enter secret key from API response
4. Choose "Time based"
5. Save and use generated code

---

## 📊 Performance Tests

### Concurrent 2FA Operations
```bash
# Test multiple users enabling 2FA simultaneously
for i in {1..5}; do
  curl -X POST http://localhost:3001/api/auth/2fa/generate \
    -H "Authorization: Bearer USER_${i}_TOKEN" &
done
```

### Token Validation Speed
```bash
# Measure response time for token validation
time curl -X POST http://localhost:3001/api/auth/2fa/verify \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"token": "123456"}'
```

---

*Last Updated: 2025-09-08*  
*Status: 2FA System Ready for Testing*