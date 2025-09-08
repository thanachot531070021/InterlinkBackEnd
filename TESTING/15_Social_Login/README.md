# 🌐 Social Login Testing Guide

## 🎯 Overview
Social Login integration สำหรับ CUSTOMER_GUEST role พร้อม Google และ Facebook authentication

## 🛠️ Features to Test

### 1. Social Authentication APIs
- [x] Google Login
- [x] Facebook Login
- [x] Get Linked Social Accounts
- [x] Link Social Account
- [x] Unlink Social Account

### 2. Social Account Management
- [x] Multiple Social Providers per User
- [x] Account Linking & Unlinking
- [x] Social Profile Data Sync
- [x] Automatic User Creation

## 🧪 Test Cases

### Test Case 1: Google Login (New User)
```http
POST /api/auth/social/google
Content-Type: application/json

{
  "token": "GOOGLE_ID_TOKEN"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/auth/social/google \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE2NzAyOD..."
  }'
```

**Expected Response (New User):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@gmail.com",
      "name": "Google User",
      "role": "CUSTOMER_GUEST",
      "profile": {
        "firstName": "Google",
        "lastName": "User",
        "avatar": "https://lh3.googleusercontent.com/..."
      }
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    },
    "isNewUser": true
  },
  "message": "Account created successfully"
}
```

### Test Case 2: Google Login (Existing User)
```bash
# Same request as above but for existing user
curl -X POST http://localhost:3001/api/auth/social/google \
  -H "Content-Type: application/json" \
  -d '{
    "token": "EXISTING_USER_GOOGLE_TOKEN"
  }'
```

**Expected Response (Existing User):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "existing_uuid",
      "email": "user@gmail.com",
      "name": "Google User",
      "role": "CUSTOMER_GUEST"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    },
    "isNewUser": false
  },
  "message": "Login successful"
}
```

### Test Case 3: Facebook Login
```http
POST /api/auth/social/facebook
Content-Type: application/json

{
  "token": "FACEBOOK_ACCESS_TOKEN"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/auth/social/facebook \
  -H "Content-Type: application/json" \
  -d '{
    "token": "EAAC..."
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@facebook.com",
      "name": "Facebook User",
      "role": "CUSTOMER_GUEST",
      "profile": {
        "firstName": "Facebook",
        "lastName": "User",
        "avatar": "https://graph.facebook.com/user_id/picture"
      }
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    },
    "isNewUser": true
  },
  "message": "Account created successfully"
}
```

### Test Case 4: Get Linked Social Accounts
```http
GET /api/auth/social/accounts
Authorization: Bearer YOUR_JWT_TOKEN
```

**Example Request:**
```bash
curl -X GET http://localhost:3001/api/auth/social/accounts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "provider": "google",
      "providerId": "google_user_123",
      "email": "user@gmail.com",
      "name": "Google User",
      "avatar": "https://lh3.googleusercontent.com/...",
      "createdAt": "2025-09-08T01:00:00.000Z",
      "updatedAt": "2025-09-08T01:00:00.000Z"
    },
    {
      "id": "uuid2",
      "provider": "facebook",
      "providerId": "facebook_user_123",
      "email": "user@facebook.com",
      "name": "Facebook User",
      "avatar": "https://graph.facebook.com/user_id/picture",
      "createdAt": "2025-09-08T01:00:00.000Z",
      "updatedAt": "2025-09-08T01:00:00.000Z"
    }
  ]
}
```

### Test Case 5: Link Additional Social Account
```http
POST /api/auth/social/link/google
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "token": "GOOGLE_ID_TOKEN"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/auth/social/link/google \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJhbGciOiJSUzI1NiIs..."
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "google account linked successfully"
}
```

### Test Case 6: Link Facebook Account
```http
POST /api/auth/social/link/facebook
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "token": "FACEBOOK_ACCESS_TOKEN"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/auth/social/link/facebook \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "EAAC..."
  }'
```

### Test Case 7: Unlink Social Account
```http
DELETE /api/auth/social/unlink/google
Authorization: Bearer YOUR_JWT_TOKEN
```

**Example Request:**
```bash
curl -X DELETE http://localhost:3001/api/auth/social/unlink/google \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "google account unlinked successfully"
}
```

## 🔧 Test Setup Requirements

### 1. Google OAuth Setup (Development)
```bash
# For testing, you can use the mock implementation
# In production, you'll need:
# - Google Cloud Console project
# - OAuth 2.0 credentials
# - Client ID and Secret configured
```

### 2. Facebook App Setup (Development)
```bash
# For testing, you can use the mock implementation  
# In production, you'll need:
# - Facebook Developer Account
# - App ID and App Secret
# - Valid access tokens
```

### 3. Environment Variables
```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# For production Facebook integration
FACEBOOK_APP_ID="your-facebook-app-id"
FACEBOOK_APP_SECRET="your-facebook-app-secret"
```

## ✅ Validation Checklist

### Basic Social Login Flow
- [ ] Google login creates new user with CUSTOMER_GUEST role
- [ ] Facebook login creates new user with CUSTOMER_GUEST role
- [ ] Existing email merges with social account
- [ ] JWT tokens generated correctly
- [ ] User profile populated from social data

### Account Management
- [ ] Users can link multiple social accounts
- [ ] Users can view linked accounts
- [ ] Users can unlink social accounts
- [ ] Social account data stored correctly
- [ ] Profile data synced from social providers

### Security Validation
- [ ] Invalid tokens rejected
- [ ] Social tokens verified properly
- [ ] Duplicate social accounts handled
- [ ] Email verification status set correctly
- [ ] Social account IDs stored securely

### Data Validation
- [ ] User profiles created with social data
- [ ] Avatar URLs stored correctly
- [ ] Names parsed correctly (first/last)
- [ ] Email addresses validated
- [ ] Provider-specific data handled

## 🚨 Edge Cases to Test

### Invalid Social Tokens
```bash
curl -X POST http://localhost:3001/api/auth/social/google \
  -H "Content-Type: application/json" \
  -d '{"token": "invalid_token"}'
```
**Expected:** `{"success": false, "message": "Invalid Google token"}`

### Linking Already Linked Account
```bash
# Try to link Google account that's already linked to another user
curl -X POST http://localhost:3001/api/auth/social/link/google \
  -H "Authorization: Bearer USER2_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"token": "ALREADY_LINKED_TOKEN"}'
```
**Expected:** Error message about account already linked

### Unlink Last Authentication Method
```bash
# Try to unlink the only social account when user has no password
curl -X DELETE http://localhost:3001/api/auth/social/unlink/google \
  -H "Authorization: Bearer TOKEN_FOR_USER_WITHOUT_PASSWORD"
```
**Expected:** Error message about needing at least one auth method

### Email Conflict Scenarios
1. **Same email, different provider**: Should merge accounts
2. **Social email conflicts with existing user**: Should link to existing
3. **No email from social provider**: Should handle gracefully

## 📱 Frontend Integration Examples

### Google Sign-In Button
```html
<!-- Google Sign-In button for web -->
<div id="g_id_onload"
     data-client_id="YOUR_GOOGLE_CLIENT_ID"
     data-callback="handleGoogleResponse">
</div>
<div class="g_id_signin" data-type="standard"></div>

<script>
function handleGoogleResponse(response) {
  // Send response.credential to your API
  fetch('/api/auth/social/google', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({token: response.credential})
  });
}
</script>
```

### Facebook Login
```javascript
// Facebook SDK integration
FB.login(function(response) {
  if (response.authResponse) {
    fetch('/api/auth/social/facebook', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({token: response.authResponse.accessToken})
    });
  }
}, {scope: 'email,public_profile'});
```

## 🔄 Testing Workflows

### Workflow 1: New Customer Registration
1. Customer clicks "Login with Google"
2. Google OAuth flow completes
3. API receives Google ID token
4. New user created with CUSTOMER_GUEST role
5. JWT tokens returned
6. Customer logged in

### Workflow 2: Existing User Login
1. User with existing account logs in with social
2. API matches by email
3. Social account linked to existing user
4. JWT tokens returned
5. User logged in

### Workflow 3: Multiple Social Accounts
1. User logs in with Google
2. User links Facebook account
3. User can login with either provider
4. Both accounts show in profile
5. User can unlink either account

## 📊 Performance Tests

### Concurrent Social Logins
```bash
# Test multiple users logging in simultaneously
for i in {1..10}; do
  curl -X POST http://localhost:3001/api/auth/social/google \
    -H "Content-Type: application/json" \
    -d '{"token": "TEST_TOKEN_'$i'"}' &
done
```

### Token Validation Speed
```bash
# Measure social login response time
time curl -X POST http://localhost:3001/api/auth/social/google \
  -H "Content-Type: application/json" \
  -d '{"token": "VALID_TEST_TOKEN"}'
```

---

## 🔧 Development Notes

### Mock Implementation
For development and testing, the service includes mock implementations that return predefined user data. In production, these should be replaced with actual OAuth verification.

### Production Considerations
1. **Token Verification**: Implement real Google/Facebook token verification
2. **Rate Limiting**: Add rate limits for social login attempts
3. **Logging**: Log social login attempts for security monitoring
4. **Error Handling**: Proper error handling for network failures

---

*Last Updated: 2025-09-08*  
*Status: Social Login System Ready for Testing*