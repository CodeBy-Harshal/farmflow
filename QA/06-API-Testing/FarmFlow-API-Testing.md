
# FarmFlow - API Testing

## 1. Overview

FarmFlow exposes REST APIs that support application functionality such as authentication, product management, order management, and other backend operations.

API testing will be performed independently of the UI to validate backend behavior, request handling, response data, authentication, authorization, and error handling.

Postman will be used as the primary tool for manual API testing.

---

## 2. Objectives

The objectives of API testing are:

- Verify that API endpoints behave as expected.
- Verify HTTP methods are handled correctly.
- Verify HTTP status codes.
- Verify response body structure and data.
- Verify request validation.
- Verify authentication requirements.
- Verify authorization rules.
- Verify error handling.
- Verify invalid and unexpected input handling.
- Identify defects in backend API behavior.

---

## 3. API Testing Approach

Each API endpoint will be tested using the following approach:

```text
Identify Endpoint
       ↓
Understand Request
       ↓
Identify Authentication Requirements
       ↓
Prepare Test Data
       ↓
Execute Request
       ↓
Validate Status Code
       ↓
Validate Response Body
       ↓
Validate Error Handling
       ↓
Record Result
       ↓
Report Defect if Required
