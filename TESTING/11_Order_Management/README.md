# 🛒 Phase 4: Order Management APIs - Testing Guide

## 🎯 Overview
Phase 4 Order Management APIs provide complete order lifecycle management with automatic stock reservation, customer management, and order processing workflow.

## 🔗 API Endpoints to Test

### Order Creation & Management

#### 1. Create Order
```bash
POST /orders
```
**Body**:
```json
{
  "storeId": "uuid",
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "address": "123 Main St"
  },
  "items": [
    {
      "productId": "uuid",
      "variantId": "uuid", // optional
      "quantity": 2,
      "unitPrice": 1200
    }
  ],
  "notes": "Special delivery instructions",
  "reservationMinutes": 60
}
```
**Auth**: Public (no auth required for guest orders) or STORE_ADMIN
**Test Cases**:
- ✅ Create order with new guest customer
- ✅ Create order with existing customer (auto-merge)
- ✅ Multiple items in single order
- ✅ Automatic stock reservation for all items
- ✅ Total amount calculation
- ❌ Insufficient stock for any item
- ❌ Invalid product/variant ID
- ❌ Invalid store ID

#### 2. Get Order Details
```bash
GET /orders/{orderId}
```
**Auth**: ADMIN, STORE_ADMIN (own store), or Customer (own orders)
**Expected Response**:
```json
{
  "id": "uuid",
  "storeId": "uuid",
  "customerId": "uuid",
  "status": "PENDING",
  "totalAmount": 2400,
  "notes": "Special instructions",
  "createdAt": "2025-09-07T...",
  "customer": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "address": "123 Main St"
  },
  "store": {
    "id": "uuid",
    "name": "Store Name",
    "slug": "store-slug"
  },
  "items": [
    {
      "id": "uuid",
      "quantity": 2,
      "unitPrice": 1200,
      "totalPrice": 2400,
      "product": {
        "id": "uuid",
        "name": "Product Name",
        "sku": "SKU123"
      }
    }
  ],
  "reservations": [
    {
      "id": "uuid",
      "quantity": 2,
      "status": "ACTIVE",
      "expiresAt": "2025-09-07T..."
    }
  ]
}
```
**Test Cases**:
- ✅ Get complete order with relationships
- ✅ Include active reservations
- ✅ Customer access control
- ❌ Order not found
- ❌ Access denied

#### 3. Search Orders
```bash
GET /orders/search
```
**Query Parameters**:
- `storeId` (optional): Filter by store
- `customerId` (optional): Filter by customer  
- `status` (optional): PENDING, CONFIRMED, CANCELLED
- `search` (optional): Search by customer name/email
- `dateFrom` (optional): Start date filter
- `dateTo` (optional): End date filter
- `offset` (optional): Pagination offset (default: 0)
- `limit` (optional): Page size (default: 50)

**Auth**: ADMIN (all orders), STORE_ADMIN (own store)
**Test Cases**:
- ✅ Search all orders (admin)
- ✅ Filter by store, status, date range
- ✅ Search by customer name/email
- ✅ Pagination functionality
- ✅ Limited item display (5 items max in list)
- ❌ Access denied

## 🔄 Order Status Management

#### 4. Update Order Status
```bash
PUT /orders/{orderId}/status
```
**Body**:
```json
{
  "status": "CONFIRMED", // or "CANCELLED"
  "cancelReason": "Customer requested" // if cancelling
}
```
**Auth**: STORE_ADMIN (own store) or ADMIN
**Test Cases**:

**PENDING → CONFIRMED**:
- ✅ Confirm order and convert reservations to sales
- ✅ Update confirmedAt timestamp
- ✅ Verify stock quantities updated (available↓, reserved↓, sold↑)

**PENDING → CANCELLED**:
- ✅ Cancel order and release all reservations
- ✅ Return stock to available quantity
- ✅ Set cancel reason

**Invalid Transitions**:
- ❌ CONFIRMED → PENDING
- ❌ Order not found
- ❌ Access denied

#### 5. Cancel Order
```bash
POST /orders/{orderId}/cancel
```
**Body**:
```json
{
  "reason": "Customer requested cancellation"
}
```
**Auth**: STORE_ADMIN (own store) or ADMIN
**Test Cases**:
- ✅ Cancel order with reason
- ✅ Automatic stock reservation release
- ✅ Update order status to CANCELLED
- ❌ Order not found
- ❌ Access denied
- ❌ Order already confirmed/cancelled

## 📊 Order Analytics & Reporting

#### 6. Get Store Orders
```bash
GET /stores/{storeId}/orders
```
**Query Parameters**:
- `status` (optional): Filter by order status
- `limit` (optional): Page size (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Auth**: STORE_ADMIN (own store) or ADMIN
**Test Cases**:
- ✅ Get all orders for specific store
- ✅ Filter by status (PENDING, CONFIRMED, CANCELLED)
- ✅ Pagination support
- ❌ Access denied for other stores
- ❌ Invalid store ID

#### 7. Get Customer Orders
```bash
GET /customers/{customerId}/orders
```
**Query Parameters**:
- `limit` (optional): Page size (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Auth**: ADMIN, STORE_ADMIN, or Customer (own orders)
**Test Cases**:
- ✅ Get customer's order history
- ✅ Pagination support
- ✅ Order by creation date (newest first)
- ❌ Access denied
- ❌ Customer not found

#### 8. Get Order Statistics
```bash
GET /orders/stats
```
**Query Parameters**:
- `storeId` (optional): Filter by store
- `dateFrom` (optional): Start date for stats
- `dateTo` (optional): End date for stats

**Auth**: ADMIN (all stores) or STORE_ADMIN (own store)
**Expected Response**:
```json
{
  "totalOrders": 150,
  "pendingOrders": 25,
  "confirmedOrders": 100,
  "cancelledOrders": 25,
  "totalRevenue": 125000,
  "averageOrderValue": 1250,
  "conversionRate": 66.67
}
```
**Test Cases**:
- ✅ Get comprehensive order statistics
- ✅ Filter by store and date range
- ✅ Calculate conversion rate (confirmed/total)
- ✅ Revenue from confirmed orders only
- ❌ Access denied

## 🚨 Order Attention & Cleanup

#### 9. Get Orders Needing Attention
```bash
GET /orders/attention
```
**Auth**: ADMIN or STORE_ADMIN
**Expected Response**:
```json
{
  "expiredReservationOrders": [
    {
      "id": "uuid",
      "status": "PENDING",
      "customer": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "reservations": [
        {
          "id": "uuid",
          "expiresAt": "2025-09-07T10:00:00Z",
          "status": "ACTIVE"
        }
      ]
    }
  ],
  "totalNeedingAttention": 5
}
```
**Test Cases**:
- ✅ Identify orders with expired reservations
- ✅ Include customer and reservation details
- ✅ Only PENDING orders with ACTIVE expired reservations
- ❌ Access denied

#### 10. Cleanup Expired Orders
```bash
POST /orders/cleanup
```
**Auth**: System internal or ADMIN
**Expected Response**:
```json
{
  "message": "Cleaned up 3 expired orders",
  "count": 3
}
```
**Test Cases**:
- ✅ Automatically cancel orders with expired reservations
- ✅ Set cancel reason as "Automatic cancellation due to expired reservation"
- ✅ Release associated stock reservations
- ✅ Handle errors gracefully

## 🔐 Authorization & Access Control

### Role-Based Access
- **ADMIN**: Full access to all orders
- **STORE_ADMIN**: Full access to own store's orders
- **STORE_STAFF**: Read-only access to own store's orders
- **CUSTOMER_GUEST**: Can create orders (no auth), view own orders with token
- **SALE**: Limited access based on assigned stores

### Cross-Store Protection
- ✅ Store A admin cannot access Store B orders
- ✅ Customers can only view their own orders
- ✅ System admin has global access

## 📈 End-to-End Test Scenarios

### Complete Order Lifecycle
1. **Order Creation**: Guest customer places order
2. **Stock Reservation**: Items automatically reserved (60min TTL)
3. **Order Confirmation**: Store admin confirms order
4. **Stock Update**: Reservations converted to sales
5. **Order Tracking**: Customer can track order status

### Order Cancellation Flow
1. **Order Creation**: Customer places order
2. **Early Cancellation**: Store cancels before confirmation
3. **Stock Release**: Reservations automatically released
4. **Inventory Restored**: Stock returned to available

### Expired Reservation Handling
1. **Order Creation**: Customer places order
2. **Time Expiry**: Reservation expires (no confirmation)
3. **Background Cleanup**: System auto-cancels order
4. **Stock Recovery**: Reserved stock returned to available

### Customer Management
1. **First Order**: New customer created as guest
2. **Subsequent Orders**: Existing customer info updated
3. **Order History**: Customer can view all their orders
4. **Data Consistency**: Customer info synchronized across orders

## ✅ Success Criteria

### Functional Requirements
- Orders create with automatic stock reservation
- Status transitions work correctly (PENDING → CONFIRMED/CANCELLED)
- Stock quantities maintain consistency throughout lifecycle
- Customer data is properly managed (create/update/merge)
- Background cleanup processes expired orders

### Performance Requirements
- **Order Creation**: < 500ms (includes stock reservation)
- **Status Update**: < 200ms (includes stock operations)  
- **Order Search**: < 300ms with pagination
- **Cleanup Job**: Process 100+ expired orders within 30 seconds

### Data Integrity
- No stock leakage during order operations
- Atomic transactions for all multi-step operations
- Proper reservation expiry handling
- Consistent customer data across orders

## 🚨 Edge Cases & Error Handling

### Stock Conflicts
- Multiple customers ordering last available item
- Stock adjustment during active reservation
- Product deletion with pending orders

### Customer Data
- Email conflicts between guest and registered customers
- Invalid customer information
- Customer data privacy considerations

### System Failures
- Database transaction failures
- Network timeouts during stock operations
- Partial order creation scenarios

---

*Total Expected API Endpoints: 10 Order Management APIs*
*Testing Priority: Critical (Revenue-impacting functionality)*