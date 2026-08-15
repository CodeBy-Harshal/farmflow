# FarmFlow - API Testing

## 1. Overview

FarmFlow exposes REST APIs that support application functionality such as authentication, product management, order management, and other backend operations.

API testing was performed independently of the UI to validate backend behavior, request handling, response data, authentication, authorization, and error handling.

Postman was used as the primary tool for manual API testing.

---

## 2. Objectives

The objectives of API testing were:

- Verify that API endpoints behave as expected.
- Verify HTTP methods are handled correctly.
- Verify HTTP status codes.
- Verify response body structure and data.
- Verify request validation.
- Verify authentication requirements.
- Verify authorization rules.
- Verify error handling.
- Verify invalid and unexpected input handling.
- Identify and document defects in backend API behavior.

---

## 3. API Testing Approach

Each API endpoint was tested using the following approach:

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
```

---


## 4. Tool Used

### Postman

Postman was used to manually send HTTP requests to FarmFlow REST API endpoints and inspect the returned responses.

The following were validated using Postman:

- HTTP request methods
- Request data
- HTTP status codes
- JSON response bodies
- Required response fields
- Authentication responses
- Authentication tokens
- Validation errors
- Error messages
- Duplicate/invalid requests

---

## 5. API Validation Performed

The following API scenarios were tested:

| Area | Validation |
|---|---|
| Registration API | Successful user registration |
| Duplicate Registration | Existing email rejection |
| Login API | Successful authentication |
| Authentication Response | Token and user information |
| HTTP Status Codes | `200`, `201`, `400` responses |
| Response Structure | JSON fields and structure |
| Invalid Requests | Validation and error handling |
| Required Fields | Response field validation |

---

## 6. API Testing Results

The API testing demonstrated that:

- Valid registration returned `201 Created`.
- Duplicate email registration returned `400 Bad Request`.
- Valid login returned `200 OK`.
- Login response contained authentication information including a token and user data.
- API responses were returned in JSON format.
- Invalid registration data was rejected appropriately.

Some advanced API scenarios, such as independently testing protected endpoints without authentication and role-based authorization through Postman, were identified for further testing.

---

## 7. Evidence

Representative Postman screenshots were captured for:

- Successful registration — `201 Created`
- Duplicate email registration — `400 Bad Request`
- Successful login — `200 OK`
- Login response containing authentication token
- Invalid request/error response

Evidence is attached to the corresponding API test cases.

---

## 8. Summary

API testing was performed using Postman to validate FarmFlow backend behavior independently of the UI.

The testing covered:

- Request execution
- HTTP status codes
- JSON response validation
- Authentication responses
- Input validation
- Error handling

The testing also demonstrated the ability to use Postman to:

- Send API requests
- Inspect responses
- Validate expected behavior
- Document test results
- Document defects





