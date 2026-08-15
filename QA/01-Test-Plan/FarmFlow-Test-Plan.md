# FarmFlow - QA Test Plan

## 1. Document Information

| Field | Details |
|---|---|
| Project | FarmFlow |
| Document | QA Test Plan |
| Version | 1.0 |
| Testing Type | Functional, API, UI, Regression |
| Tester | Harshal Kesbhat |
| Environment | Local / Development |
| Status | Draft |

---

## 2. Project Overview

FarmFlow is a full-stack web application designed for agricultural product management and ordering.

The application consists of a frontend, backend APIs, authentication, database interactions, product management, order management, and role-based access control.

This QA project will evaluate the functional behavior, API behavior, authentication, authorization, data validation, error handling, and critical user workflows of the FarmFlow application.

---

## 3. Testing Objective

The objective of this testing project is to identify functional defects, verify expected application behavior, validate REST APIs, test authentication and authorization, and ensure that important FarmFlow workflows work correctly.

The testing process will include:

- Manual functional testing
- API testing using Postman
- Negative testing
- Boundary and validation testing
- Authentication testing
- Authorization testing
- Regression testing
- Defect identification and reporting
- Basic UI automation for critical authentication flows

---

## 4. Scope of Testing

### 4.1 In Scope

The following areas will be tested:

#### Authentication

- User registration
- User login
- Logout
- Invalid credentials
- Input validation
- Authentication token handling

#### Authorization

- Protected resources
- Role-based access
- Unauthorized access attempts
- User permissions
- Admin permissions

#### Product Management

Product management testing covers product creation, validation, product lifecycle, marketplace visibility, deletion permissions, and product access control.

## Product Lifecycle

The current FarmFlow product workflow is:

```text
Farmer Registers Product
          ↓
       PENDING
          ↓
   Admin Reviews Product
          ↓
        ACTIVE
          ↓
Product Appears in Marketplace
          ↓
     Buyer Can Purchase

#### Order Management

- Order creation
- Order retrieval
- Order updates
- Invalid order data
- Order authorization

#### API Testing

- HTTP methods
- Request validation
- Response validation
- HTTP status codes
- Error handling
- Authentication
- Authorization

#### UI Testing

- Login workflow
- Registration workflow
- Critical product workflows
- Critical order workflows
- Form validation

---

## 5. Out of Scope

The following areas are outside the current testing scope:

- Production infrastructure testing
- Large-scale performance testing
- Load testing
- Penetration testing
- Mobile application testing
- Production deployment testing
- Advanced security testing

---

## 6. Testing Types

The following testing types will be performed:

### Functional Testing

Verify that application features behave according to their expected functionality.

### Negative Testing

Verify that the application handles invalid inputs, invalid requests, and unexpected user actions correctly.

### Boundary Testing

Verify behavior at valid and invalid input boundaries.

### API Testing

Validate REST API requests, responses, status codes, authentication, authorization, and error handling using Postman.

### UI Testing

Verify important user workflows through the web interface.

### Authentication Testing

Verify login, registration, logout, token handling, and invalid authentication scenarios.

### Authorization Testing

Verify that users can only access functionality and resources permitted to their roles.

### Regression Testing

Verify that previously working functionality continues to work after application changes or defect fixes.

---

## 7. Test Environment

Testing will initially be performed in a local development environment.

### Environment

- Operating System: Windows
- Browser: Google Chrome
- Backend: FarmFlow backend application
- Frontend: FarmFlow frontend application
- Database: MySQL
- API Testing Tool: Postman
- Version Control: Git/GitHub

---

## 8. Testing Tools

| Tool | Purpose |
|---|---|
| Postman | REST API testing |
| Google Chrome | Web UI testing |
| GitHub | Source code and QA documentation |
| MySQL | Database validation |
| Playwright | Basic UI automation |
| Python | Test automation |
| Pytest | API/UI test execution |

---

## 9. Test Data

Test data will include:

- Valid user accounts
- Invalid user credentials
- Valid product data
- Invalid product data
- Valid order data
- Invalid order data
- Different user roles
- Missing required fields
- Boundary values
- Invalid IDs
- Invalid authentication tokens

Test data will be controlled and documented to ensure repeatable testing.

---

## 10. Entry Criteria

Testing can begin when:

- FarmFlow frontend is available.
- FarmFlow backend is running.
- Required database services are available.
- Test users can be created.
- Required test data is available.
- APIs are accessible through Postman.

---

## 11. Exit Criteria

Testing for a test cycle may be considered complete when:

- Planned test cases have been executed.
- Critical and high-severity defects have been identified and documented.
- Fixed defects have been retested.
- Regression testing has been completed for affected functionality.
- Test execution results have been documented.
- Remaining known issues have been recorded.

---

## 12. Defect Management

Defects identified during testing will be documented with:

- Defect ID
- Title
- Module
- Severity
- Priority
- Environment
- Preconditions
- Steps to reproduce
- Expected result
- Actual result
- Evidence where applicable
- Status

Defects will be tracked through the QA documentation and GitHub Issues where appropriate.

---

## 13. Test Execution Process

The testing process will follow the workflow below:

Requirements / Features
        ↓
Test Scenarios
        ↓
Test Cases
        ↓
Test Execution
        ↓
PASS / FAIL / BLOCKED
        ↓
Defect Reporting
        ↓
Defect Fix
        ↓
Retesting
        ↓
Regression Testing
        ↓
Test Execution Report

---

## 14. Risks and Limitations

The application is a development project and may contain known limitations or incomplete functionality.

Testing results will therefore be evaluated within the available application functionality and local test environment.

Environmental issues, unavailable dependencies, incomplete features, or test-data problems may result in blocked test cases.

---

## 15. Deliverables

The QA project will produce the following deliverables:

- QA Test Plan
- Test Scenarios
- Test Cases
- Postman API Test Collection
- Defect Reports
- Test Execution Report
- Regression Test Results
- Basic Playwright Automation
- QA Project Documentation

---

## 16. Approval / Conclusion

The final testing conclusion will be documented after execution of the planned test cases.

The final QA report will summarize:

- Total test cases
- Passed test cases
- Failed test cases
- Blocked test cases
- Defects identified
- Defects resolved
- Regression results
- Remaining known issues
- Overall testing recommendation
