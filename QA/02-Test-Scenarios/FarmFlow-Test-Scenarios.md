
# FarmFlow - Test Scenarios

## 1. Authentication

| Scenario ID | Scenario |
|---|---|
| TS-AUTH-001 | Verify user registration with valid data |
| TS-AUTH-002 | Verify registration with an already registered email |
| TS-AUTH-003 | Verify registration with invalid email |
| TS-AUTH-004 | Verify registration with missing required fields |
| TS-AUTH-005 | Verify login with valid credentials |
| TS-AUTH-006 | Verify login with invalid password |
| TS-AUTH-007 | Verify login with unregistered email |
| TS-AUTH-008 | Verify login with missing credentials |
| TS-AUTH-009 | Verify logout functionality |
| TS-AUTH-010 | Verify protected resources require authentication |

---

## 2. Authorization

| Scenario ID | Scenario |
|---|---|
| TS-AUTHZ-001 | Verify authorized user can access permitted functionality |
| TS-AUTHZ-002 | Verify unauthorized user cannot access restricted functionality |
| TS-AUTHZ-003 | Verify normal user cannot access admin functionality |
| TS-AUTHZ-004 | Verify invalid authentication token is rejected |
| TS-AUTHZ-005 | Verify users cannot access unauthorized resources |

---

## 3. Product Management

| Scenario ID | Scenario |
|---|---|
| TS-PROD-001 | Verify products can be retrieved |
| TS-PROD-002 | Verify product can be created with valid data |
| TS-PROD-003 | Verify product creation with missing required fields |
| TS-PROD-004 | Verify product creation with invalid data |
| TS-PROD-005 | Verify product can be updated |
| TS-PROD-006 | Verify product can be deleted |
| TS-PROD-007 | Verify nonexistent product handling |
| TS-PROD-008 | Verify unauthorized product modification is rejected |

---

## 4. Order Management

| Scenario ID | Scenario |
|---|---|
| TS-ORDER-001 | Verify an authenticated user can create an order |
| TS-ORDER-002 | Verify order details can be retrieved |
| TS-ORDER-003 | Verify invalid order data is rejected |
| TS-ORDER-004 | Verify nonexistent order handling |
| TS-ORDER-005 | Verify unauthorized order access is rejected |
| TS-ORDER-006 | Verify order update functionality |
| TS-ORDER-007 | Verify order behavior with invalid product information |

---

## 5. API Validation

| Scenario ID | Scenario |
|---|---|
| TS-API-001 | Verify correct HTTP status codes |
| TS-API-002 | Verify response body structure |
| TS-API-003 | Verify required response fields |
| TS-API-004 | Verify invalid request handling |
| TS-API-005 | Verify missing required parameters |
| TS-API-006 | Verify invalid IDs |
| TS-API-007 | Verify authentication requirements |
| TS-API-008 | Verify authorization requirements |

---

## 6. UI Validation

| Scenario ID | Scenario |
|---|---|
| TS-UI-001 | Verify login workflow |
| TS-UI-002 | Verify invalid login workflow |
| TS-UI-003 | Verify registration workflow |
| TS-UI-004 | Verify product viewing workflow |
| TS-UI-005 | Verify product management workflow |
| TS-UI-006 | Verify order workflow |
| TS-UI-007 | Verify form validation |
| TS-UI-008 | Verify logout workflow |

---

## 7. Regression Scenarios

| Scenario ID | Scenario |
|---|---|
| TS-REG-001 | Verify authentication after authentication-related changes |
| TS-REG-002 | Verify product functionality after product-related changes |
| TS-REG-003 | Verify order functionality after order-related changes |
| TS-REG-004 | Verify authorization after permission-related changes |
| TS-REG-005 | Verify critical application workflows after defect fixes |
