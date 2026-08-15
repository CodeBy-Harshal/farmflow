# FarmFlow — QA & Testing

A structured QA project covering functional testing, negative testing, authentication, authorization, REST API testing, UI workflows, defect reporting, test evidence, and final test execution reporting for the FarmFlow application.

---

## 1. Project Overview

**FarmFlow** is an agricultural marketplace application that supports different user roles and workflows for managing agricultural products and orders.

This repository contains the application's QA documentation and testing artifacts.

The QA work was organized to validate the application from both a functional and API perspective, with a focus on:

- Authentication
- Authorization
- Role-based access
- Product management
- Order management
- REST API behavior
- Protected API resources
- UI workflows
- Form validation
- Negative testing
- Defect identification
- Evidence collection
- Test execution reporting

---

## 2. QA Scope

Testing was performed across the following major areas:

### Authentication

Validated:

- User registration
- Duplicate email registration
- Invalid email registration
- Required-field validation
- Valid login
- Invalid password
- Unregistered email login
- Missing login credentials
- Logout
- Protected resource authentication

### Authorization

Validated:

- Authorized user access
- Unauthorized user access
- Normal-user restrictions
- Admin-only functionality
- Invalid authentication token handling
- Unauthorized resource access

### Product Management

Validated:

- Product retrieval
- Product creation
- Required-field validation
- Invalid price validation
- Invalid quantity validation
- Product deletion permissions
- Product lifecycle/status behavior
- Nonexistent product handling
- Unauthorized product modification
- Product update availability

### Order Management

Validated:

- Order creation
- Order retrieval
- Invalid order data
- Unauthorized order access
- Invalid/unavailable product behavior
- Order update availability
- Nonexistent order handling

### API Testing

API testing was performed using **Postman**.

Validated areas include:

- HTTP status codes
- JSON response structure
- Required response fields
- Invalid request handling
- Authentication
- Bearer token authentication
- Protected API access
- Registration API
- Login API
- Products API

Verified examples include:

```
Registration              → 201 Created
Duplicate registration    → 400 Bad Request
Successful login          → 200 OK
Protected API without JWT → 401 Unauthorized
Protected API with JWT    → 200 OK
```

### UI Testing

Validated:

- Login workflow
- Invalid login workflow
- Registration workflow
- Product viewing
- Product management
- Order workflow
- Form validation
- Logout workflow

---

## 3. User Roles Tested

FarmFlow supports role-based application behavior.

The QA testing considered the following roles:

| RoleTesting Focus |                                                     |
| ----------------- | --------------------------------------------------- |
| Buyer             | Marketplace and order-related workflows             |
| Farmer            | Product creation and product-related workflows      |
| Admin             | Product management and administrative functionality |

Role-based behavior was tested to verify that users can access functionality appropriate to their permissions.

---

## 4. QA Repository Structure

```
QA/
│
├── 01-Test-Plan/
│   └── Test planning and QA scope
│
├── 02-Test-Scenarios/
│   └── High-level test scenarios
│
├── 03-Test-Cases/
│   └── Detailed test cases and execution results
│
├── 04-Bug-Reports/
│   └── Documented defects
│
├── 05-Test-Evidence/
│   └── Screenshots and UI/product testing evidence
│
├── 06-API-Testing/
│   └── Postman/API testing evidence
│
└── 07-Test-Summary/
    └── Final QA test execution summary
```

---

## 5. Test Case Documentation

The detailed test cases document:

- Test case ID
- Scenario
- Preconditions
- Test steps
- Expected result
- Actual result
- Status
- Defect reference
- Evidence

Example test case structure:

```
TS-AUTH-001
TS-AUTHZ-001
TS-PROD-001
TS-ORDER-001
TS-API-001
TS-UI-001
```

This provides traceability between requirements, test execution, defects, and evidence.

---

## 6. Testing Approach

The QA testing used a combination of positive and negative testing.

### Positive Testing

Valid inputs and authorized users were used to verify successful application behavior.

Examples:

- Valid registration
- Valid login
- Product creation
- Product retrieval
- Order creation
- Order retrieval
- Valid API authentication
- Authenticated access to protected APIs

### Negative Testing

Invalid inputs and unauthorized actions were used to verify application validation and security behavior.

Examples:

- Duplicate email registration
- Invalid email format
- Invalid login credentials
- Missing required fields
- Negative product price
- Zero product price
- Negative product quantity
- Zero product quantity
- Invalid product dates
- Invalid authentication token
- Unauthorized resource access
- Protected API access without authentication

---

## 7. API Testing with Postman

Postman was used to validate FarmFlow REST APIs.

### API Areas Tested

- Registration
- Login
- Product retrieval
- Authentication
- Bearer token handling
- HTTP response codes
- JSON response bodies
- Validation errors
- Protected resources

### Authentication Flow

The API authentication flow was tested using a login request that returns an authentication token.

The token was then used as a Bearer token when accessing protected API resources.

Example:

```
Login
  ↓
Authentication token returned
  ↓
Bearer token added to request
  ↓
Protected API request
  ↓
200 OK
```

Without authentication:

```
Protected API request
  ↓
No authentication token
  ↓
401 Unauthorized
```

This verifies that the protected API requires authentication.

---

## 8. API Evidence

API evidence is maintained under:

```
QA/06-API-Testing/Evidence/
```

Key evidence includes:

```
API-01-Products-Without-Token-401.png
API-02-Products-With-Bearer-Token-200.png
API-03-Login-Success-200.png
API-04-Duplicate-Registration-400.png
API-05-Registration-Success-201.png
```

These files demonstrate API authentication, protected resource access, successful requests, and validation/error responses.

---

## 9. Defects Identified

Two defects were identified during the documented testing.

### BUG-001 — Invalid Email Validation

**Area:** Authentication

The registration workflow does not currently validate the email format.

An invalid email address can be submitted without the application preventing registration based on email format.

**Expected behavior:**

The application should validate email format and prevent registration when an invalid email address is supplied.

---

### BUG-PROD-001 — Invalid Product Date Relationship

**Area:** Product Management

The application allows a product to be created when the expiry date is earlier than the harvest date.

**Expected behavior:**

The application should prevent product creation when:

```
Expiry Date < Harvest Date
```

Evidence:

```
QA/05-Test-Evidence/Product-Management/BUG-PROD-001-invalid-product-dates.png
```

---

## 10. Test Execution Summary

The QA test suite contains **47 documented test cases** across:

- Authentication
- Authorization
- Product Management
- Order Management
- API Testing
- UI Testing

The final execution identified:

- Successful scenarios across the major application workflows
- **2 documented defects**
- Several scenarios requiring future execution
- Some functionality currently identified as unavailable

For the authoritative execution breakdown, see:

```
QA/07-Test-Summary/FarmFlow-QA-Testing-Summary.md
```

---

## 11. Testing Limitations

Some scenarios were not executed or were identified as unavailable during the testing cycle.

Examples include:

- Nonexistent product handling
- Unauthorized product modification
- Missing API parameters
- Invalid API resource IDs
- Product update functionality
- Order update functionality
- Nonexistent order handling

These scenarios are documented in the final QA summary and can be included in future regression or extended testing.

---

## 12. Evidence Collection

Testing evidence was captured through:

- Postman screenshots
- API response screenshots
- UI screen recordings
- Product management screenshots
- Defect evidence

Evidence is maintained alongside the relevant QA documentation.

This provides traceability between:

```
Test Case
    ↓
Test Execution
    ↓
Actual Result
    ↓
Evidence
    ↓
Defect (if applicable)
```

---

## 13. QA Workflow

The overall testing workflow followed this structure:

```
Understand Application
        ↓
Identify Test Scope
        ↓
Create Test Scenarios
        ↓
Create Detailed Test Cases
        ↓
Execute Positive Tests
        ↓
Execute Negative Tests
        ↓
Validate APIs with Postman
        ↓
Validate UI Workflows
        ↓
Verify Authentication & Authorization
        ↓
Capture Evidence
        ↓
Document Defects
        ↓
Prepare Final Test Summary
```

---

## 14. Tools & Technologies

### Testing Tools

- **Postman** — REST API testing
- **Browser** — UI and functional testing
- **Git / GitHub** — Version control and QA documentation
- **Markdown** — Test documentation and reporting

### QA Techniques

- Functional testing
- Positive testing
- Negative testing
- Authentication testing
- Authorization testing
- Role-based access testing
- API testing
- UI testing
- Validation testing
- Defect reporting
- Evidence-based test execution

---

## 15. QA Deliverables

The QA work produced the following deliverables:

- Test Plan
- Test Scenarios
- Detailed Test Cases
- Bug Reports
- Test Evidence
- API Testing Evidence
- Final Test Execution Summary

The complete documentation is organized under the `QA/` directory.

---

## 16. Key QA Findings

The testing demonstrated that the application successfully supports major workflows including:

- User registration
- User authentication
- Logout
- Role-based application access
- Product creation
- Product management
- Product retrieval
- Order creation
- Order retrieval
- API authentication
- Protected API access
- UI workflows

The testing also identified validation gaps that should be addressed:

1. Invalid email format validation
2. Harvest date and expiry date relationship validation

---

## 17. Final QA Assessment

Overall:

> **Testing completed with known defects.**

The FarmFlow application demonstrated functional behavior across the major tested workflows.

The QA process covered both frontend and backend behavior and included API-level verification using Postman, authentication testing, protected-resource testing, negative testing, defect identification, and evidence collection.

The remaining unexecuted scenarios are documented for future regression or extended testing.

---

## 18. Why This Project Demonstrates QA Skills

This project demonstrates practical QA activities rather than only writing test cases.

It includes:

- Test planning
- Test scenario design
- Detailed test case creation
- Positive testing
- Negative testing
- Functional testing
- Authentication testing
- Authorization testing
- Role-based access testing
- REST API testing
- HTTP status code validation
- JSON response validation
- Bearer token authentication
- Protected API testing
- UI workflow testing
- Defect identification
- Evidence collection
- Test documentation
- Final test reporting

---

## 19. Repository

GitHub repository:

CodeBy-Harshal/farmflow

QA documentation:

```
QA/
```

---

## 20. Author

**Harshal Kesbhat**

FarmFlow QA & Testing Project
