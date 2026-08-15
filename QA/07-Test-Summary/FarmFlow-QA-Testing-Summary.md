# FarmFlow - QA Test Execution Summary

## 1. Overview

This document provides the final summary of the QA testing performed for the FarmFlow application.

Testing was performed across:

- Authentication
- Authorization
- Product Management
- Order Management
- API Testing
- UI Testing

The testing included both positive and negative scenarios covering functional behavior, validation, authentication, authorization, API responses, protected resources, and user interface workflows.

---

## 2. Test Execution Summary

| Test Area | Total | PASS | FAIL | NOT EXECUTED | NOT AVAILABLE |
|---|---:|---:|---:|---:|---:|
| Authentication | 10 | 8 | 1 | 1 | 0 |
| Authorization | 5 | 5 | 0 | 0 | 0 |
| Product Management | 9 | 5 | 1 | 2 | 1 |
| Order Management | 7 | 6 | 0 | 1 | 1 |
| API Testing | 8 | 6 | 0 | 2 | 0 |
| UI Testing | 8 | 8 | 0 | 0 | 0 |
| **Total** | **47** | **38** | **2** | **6** | **2** |

---

## 3. Overall Testing Result

A total of **47 test cases** were defined across the FarmFlow QA test suite.

The execution resulted in:

- **38 test cases PASS**
- **2 test cases FAIL**
- **6 test cases NOT EXECUTED**
- **2 test cases NOT AVAILABLE**

The majority of the executed test scenarios passed successfully.

The identified failures are related to input validation and date relationship validation.

---

## 4. Defects Identified

### BUG-001 - Invalid Email Validation

**Related Test Case:** `TS-AUTH-003`

**Area:** Authentication

**Issue:**

The registration workflow does not currently validate the email format.

An invalid email address can be submitted without the application preventing registration based on email format.

**Expected Behavior:**

The application should validate the email format and prevent registration when an invalid email address is provided.

**Status:** Open

---

### BUG-PROD-001 - Invalid Product Date Relationship

**Related Test Case:** `TS-PROD-004`

**Area:** Product Management

**Issue:**

The application allows a product to be created when the expiry date is earlier than the harvest date.

**Expected Behavior:**

The application should prevent product creation when the expiry date occurs before the harvest date.

**Status:** Open

**Evidence:**

`QA/05-Test-Evidence/Product-Management/BUG-PROD-001-invalid-product-dates.png`

---

## 5. Authentication Testing Summary

Authentication testing covered:

- User registration
- Duplicate email registration
- Invalid email registration
- Required field validation
- Valid login
- Invalid password
- Unregistered email
- Missing login credentials
- Logout
- Protected resource authentication

The authentication workflow was generally functioning as expected.

One defect was identified:

- Invalid email format validation is not currently implemented.

---

## 6. Authorization Testing Summary

Authorization testing covered:

- Authorized user access
- Unauthorized user access
- Normal user access to admin functionality
- Invalid authentication token handling
- Unauthorized resource access

The tested authorization scenarios passed successfully.

The application prevented unauthorized users from accessing restricted functionality.

---

## 7. Product Management Testing Summary

Product management testing covered:

- Product retrieval
- Product creation
- Required field validation
- Invalid product data
- Product update availability
- Product deletion
- Nonexistent product handling
- Unauthorized product modification

The product creation validation successfully rejected:

- Negative prices
- Zero prices
- Negative quantities
- Zero quantities

However, a defect was identified where the application allowed an expiry date earlier than the harvest date.

Product update functionality was also identified as currently unavailable.

Some additional product scenarios remain to be executed.

---

## 8. Order Management Testing Summary

Order management testing covered:

- Order creation
- Order retrieval
- Invalid order data
- Nonexistent order handling
- Unauthorized order access
- Order update functionality
- Invalid product information in orders

The executed order management scenarios passed successfully.

Order update functionality is currently not available.

Nonexistent order handling remains to be tested.

---

## 9. API Testing Summary

API testing was performed using **Postman**.

The testing covered:

- HTTP status codes
- JSON response structure
- Required response fields
- Invalid request handling
- Authentication
- Bearer token usage
- Protected API access
- Role-based authorization
- Registration API
- Login API

The following API behavior was verified:

| API Scenario | Result |
|---|---|
| Successful Registration | `201 Created` |
| Duplicate Registration | `400 Bad Request` |
| Successful Login | `200 OK` |
| Protected Products API without token | `401 Unauthorized` |
| Protected Products API with valid Bearer token | `200 OK` |
| Role-based API authorization | PASS |

Role-based authorization was tested using the available FarmFlow user roles:

- Buyer
- Farmer
- Admin

The API testing demonstrated the ability to send requests through Postman, authenticate users, use Bearer tokens, access protected resources, validate JSON responses, and verify authorization behavior.

Additional API scenarios remain to be executed, including:

- Missing required parameters
- Invalid/nonexistent resource IDs

---

## 10. UI Testing Summary

UI testing covered:

- Login workflow
- Invalid login workflow
- Registration workflow
- Product viewing
- Product management
- Order workflow
- Form validation
- Logout

All executed UI test cases passed.

The tested workflows demonstrated that users can successfully:

- Register
- Log in
- Log out
- View products
- Create products
- Manage products according to their role
- View order information
- Navigate role-based functionality

---

## 11. Positive Testing

Positive testing verified successful behavior using valid inputs and authorized users.

Examples included:

- Successful registration
- Successful login
- Successful logout
- Authorized functionality access
- Product creation
- Product retrieval
- Order creation
- Order retrieval
- Successful API authentication
- Successful protected API access
- Successful UI workflows

---

## 12. Negative Testing

Negative testing was performed to verify how FarmFlow handles invalid input and unauthorized actions.

Examples included:

- Duplicate email registration
- Invalid email registration
- Invalid login credentials
- Missing required fields
- Invalid product price
- Invalid product quantity
- Invalid product dates
- Unauthorized functionality access
- Invalid authentication token
- Unauthorized resource access
- Invalid API requests
- Protected API access without authentication

---

## 13. Evidence

Testing evidence was captured through:

- Postman screenshots
- UI screen recordings
- Product management defect screenshots
- API response evidence

### API Evidence

```text
QA/06-API-Testing/Evidence/API-01-Products-Without-Token-401.png
QA/06-API-Testing/Evidence/API-02-Products-With-Bearer-Token-200.png
QA/06-API-Testing/Evidence/API-03-Login-Success-200.png
QA/06-API-Testing/Evidence/API-04-Duplicate-Registration-400.png
QA/06-API-Testing/Evidence/API-05-Registration-Success-201.png
```

### Product Defect Evidence

```text
QA/05-Test-Evidence/Product-Management/BUG-PROD-001-invalid-product-dates.png
```

Evidence is maintained alongside the relevant QA documentation and test cases.

---

## 14. Testing Limitations

The following scenarios were not executed or are currently unavailable:

- Nonexistent product handling
- Unauthorized product modification
- Missing API parameters
- Invalid API resource IDs
- Product update functionality
- Order update functionality
- Nonexistent order handling

These scenarios should be considered for future test execution.

---

## 15. Final QA Assessment

The FarmFlow application was tested across:

- Authentication
- Authorization
- Product Management
- Order Management
- API functionality
- UI workflows

The majority of the executed test cases passed successfully.

Two defects were identified during testing:

1. **BUG-001** - Invalid email format validation is missing.
2. **BUG-PROD-001** - Invalid harvest date and expiry date relationship is accepted.

The application demonstrated functional behavior across the major tested workflows, including:

- Authentication
- Role-based access
- Product management
- Order management
- API communication
- UI workflows

Additional testing is recommended for the currently unexecuted scenarios, particularly:

- API validation
- Invalid IDs
- Unavailable functionality

---

## 16. Final Status

**Overall QA Status: TESTING COMPLETED WITH KNOWN DEFECTS**

| Metric | Result |
|---|---:|
| **Total Test Cases** | **47** |
| **Passed** | **37** |
| **Failed** | **2** |
| **Not Executed** | **6** |
| **Not Available** | **2** |
| **Defects Identified** | **2** |

---

## 17. Conclusion

The FarmFlow QA testing provided coverage across the major application workflows and backend API functionality.

The majority of the executed test scenarios passed successfully, with two defects identified and several scenarios remaining for future execution.

The testing demonstrated practical QA activities including:

- Test case design
- Functional testing
- Positive testing
- Negative testing
- Authentication testing
- Authorization testing
- Role-based access testing
- REST API testing using Postman
- HTTP status code validation
- JSON response validation
- Bearer token authentication
- Protected API testing
- Defect identification
- Evidence collection
- Test documentation

The QA documentation includes:

- Test cases
- Execution results
- Defect observations
- API evidence
- UI testing evidence
The QA documentation includes test cases, execution results, defect observations, API evidence, and UI testing evidence.
