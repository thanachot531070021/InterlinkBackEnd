# 📦 Phase 4: Stock Management APIs - Testing Guide

## 🎯 Overview
Phase 4 Stock Management APIs provide atomic stock operations, reservation system, and stock lifecycle management with TTL-based expiration.

## 🔗 API Endpoints to Test

### Stock Management APIs

#### 1. Get Store Stock
```bash
GET /stock/stores/{storeId}
```
**Auth**: Requires STORE_ADMIN, STORE_STAFF, or ADMIN role
**Test Cases**:
- ✅ Get all stock for a valid store
- ✅ Verify low stock items appear first
- ✅ Check product and variant relationships
- ❌ Access denied for different store's stock
- ❌ Invalid store ID

#### 2. Get Product Stock
```bash
GET /stock/stores/{storeId}/products/{productId}
GET /stock/stores/{storeId}/products/{productId}/variants/{variantId}
```
**Auth**: Requires STORE_ADMIN, STORE_STAFF, or ADMIN role
**Test Cases**:
- ✅ Get stock for specific product
- ✅ Get stock for specific variant
- ✅ Verify stock quantities and pricing
- ❌ Product not found
- ❌ Access denied

#### 3. Create or Update Stock
```bash
POST /stock
```
**Body**:
```json
{
  "storeId": "uuid",
  "productId": "uuid",
  "variantId": "uuid", // optional
  "availableQty": 100,
  "priceCentral": 1000,
  "priceStore": 1200
}
```
**Auth**: Requires STORE_ADMIN role
**Test Cases**:
- ✅ Create new stock record
- ✅ Update existing stock record
- ✅ Verify brand entitlement check
- ❌ No brand permission
- ❌ Invalid product ID
- ❌ Invalid quantities

#### 4. Update Stock
```bash
PUT /stock/{stockId}
```
**Body**:
```json
{
  "availableQty": 150,
  "priceCentral": 1100,
  "priceStore": 1300
}
```
**Auth**: Requires STORE_ADMIN role
**Test Cases**:
- ✅ Update stock quantities and prices
- ✅ Verify lastChangedAt timestamp
- ❌ Stock record not found
- ❌ Access denied

## 🔄 Stock Reservation System Testing

#### 5. Reserve Stock
```bash
POST /stock/reserve
```
**Body**:
```json
{
  "storeId": "uuid",
  "productId": "uuid",
  "variantId": "uuid", // optional
  "quantity": 5,
  "orderId": "uuid",
  "expiryMinutes": 60
}
```
**Auth**: System internal or STORE_ADMIN
**Test Cases**:
- ✅ Reserve stock successfully
- ✅ Check atomic stock quantity update
- ✅ Verify reservation expiry time
- ✅ Multiple concurrent reservations (race condition test)
- ❌ Insufficient stock
- ❌ Stock record not found

#### 6. Confirm Reservation (Convert to Sale)
```bash
POST /stock/reservations/{reservationId}/confirm
```
**Auth**: System internal or STORE_ADMIN
**Test Cases**:
- ✅ Convert reservation to sale
- ✅ Update availableQty, reservedQty, soldQty
- ✅ Mark reservation as APPLIED
- ❌ Reservation not found
- ❌ Reservation not active
- ❌ Already confirmed

#### 7. Release Reservation
```bash
POST /stock/reservations/{reservationId}/release
```
**Auth**: System internal or STORE_ADMIN
**Test Cases**:
- ✅ Release active reservation
- ✅ Return stock to available quantity
- ✅ Mark reservation as RELEASED
- ❌ Reservation not found
- ❌ Reservation not active

## 📊 Stock Management & Analytics

#### 8. Manual Stock Adjustment
```bash
POST /stock/{stockId}/adjust
```
**Body**:
```json
{
  "stockId": "uuid",
  "adjustment": -5, // can be positive or negative
  "reason": "Damaged inventory"
}
```
**Auth**: Requires STORE_ADMIN role
**Test Cases**:
- ✅ Positive adjustment (stock received)
- ✅ Negative adjustment (damage, theft)
- ✅ Verify audit trail creation
- ❌ Adjustment results in negative stock
- ❌ Stock record not found

#### 9. Get Store Stock Statistics
```bash
GET /stock/stores/{storeId}/stats
```
**Auth**: Requires STORE_ADMIN, STORE_STAFF, or ADMIN role
**Expected Response**:
```json
{
  "totalProducts": 150,
  "lowStockItems": 12,
  "outOfStockItems": 3,
  "totalUnits": 2500,
  "inStockItems": 147
}
```
**Test Cases**:
- ✅ Get complete statistics
- ✅ Verify low stock threshold (≤5 units)
- ✅ Verify out of stock count
- ❌ Access denied

## 🧹 Cleanup & Background Jobs

#### 10. Get Expired Reservations
```bash
GET /stock/reservations/expired
```
**Auth**: System internal or ADMIN
**Test Cases**:
- ✅ List reservations past expiry time
- ✅ Include product and variant details
- ✅ Only ACTIVE reservations

#### 11. Cleanup Expired Reservations
```bash
POST /stock/cleanup/reservations
```
**Auth**: System internal or ADMIN
**Expected Response**:
```json
{
  "message": "Cleaned up 5 expired reservations",
  "count": 5
}
```
**Test Cases**:
- ✅ Automatically release expired reservations
- ✅ Update stock quantities
- ✅ Handle errors gracefully

## ⚡ Performance & Race Condition Tests

### Concurrent Stock Operations
```bash
# Test multiple simultaneous reservations
for i in {1..10}; do
  curl -X POST /stock/reserve \
    -H "Content-Type: application/json" \
    -d '{"storeId":"...","productId":"...","quantity":1,"orderId":"order-'$i'"}' &
done
wait
```

### Stock Level Verification
```bash
# Verify stock consistency after operations
GET /stock/stores/{storeId}/products/{productId}
# Check: availableQty + reservedQty + soldQty = total managed stock
```

## 🔐 Authorization Tests

### Role-Based Access Control
- **ADMIN**: Full access to all stock operations
- **STORE_ADMIN**: Full access to own store's stock
- **STORE_STAFF**: Read-only access to own store's stock
- **SALE**: No direct stock access
- **CUSTOMER_GUEST**: No stock access

### Cross-Store Access Tests
- ✅ Store A admin cannot access Store B stock
- ✅ Store A staff cannot modify any stock
- ✅ System admin can access all store stock

## 📈 Test Scenarios

### End-to-End Stock Lifecycle
1. **Initial Stock**: Create stock record with 100 units
2. **Reservation**: Reserve 10 units (available: 90, reserved: 10)
3. **Confirmation**: Confirm 5 units (available: 85, reserved: 5, sold: 5)
4. **Release**: Release remaining 5 reserved units (available: 90, reserved: 0, sold: 5)
5. **Adjustment**: Manual adjustment +10 units (available: 100, reserved: 0, sold: 5)

### TTL Expiry Testing
1. **Create Reservation**: Set 1-minute expiry
2. **Wait**: Allow reservation to expire
3. **Cleanup Job**: Run cleanup to release expired reservation
4. **Verify**: Stock quantities restored

## ✅ Expected Results

### Success Criteria
- All stock operations are atomic (no race conditions)
- Reservation system works with proper TTL
- Stock quantities remain consistent
- Authorization properly enforced
- Background cleanup functions correctly

### Key Metrics
- **Response Time**: < 200ms for stock queries
- **Concurrency**: Handle 10+ simultaneous reservations
- **Data Integrity**: No stock quantity inconsistencies
- **Reservation Cleanup**: Process expired reservations within 5 minutes

## 🚨 Common Issues

### Database Constraints
- Negative stock quantities should be prevented
- Reservation quantities must not exceed available stock
- Stock adjustments must maintain data integrity

### Race Conditions
- Multiple reservations for same product
- Concurrent stock updates
- Reservation confirmation vs. expiry timing

### Performance
- Large store inventories (1000+ products)
- High-frequency stock operations
- Background job efficiency

---

*Total Expected API Endpoints: 11 Stock Management APIs*
*Testing Priority: High (Core business functionality)*