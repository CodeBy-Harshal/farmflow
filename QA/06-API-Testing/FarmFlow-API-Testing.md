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
| **Registration API** | Successful user registration |
| **Duplicate Registration** | Existing email rejection |
| **Login API** | Successful authentication |
| **Authentication Response** | Token and user information |
| **Protected Products API** | Authentication requirement |
| **HTTP Status Codes** | `200`, `201`, `400`, `401` responses |
| **Response Structure** | JSON fields and structure |
| **Invalid Requests** | Validation and error handling |
| **Required Fields** | Response field validation |

---

## 6. API Testing Results

The API testing demonstrated that:

- Valid registration returned `201 Created`.
- Duplicate email registration returned `400 Bad Request`.
- Valid login returned `200 OK`.
- Login response contained authentication information including a token and user data.
- Requests to the protected Products API without a token returned `401 Unauthorized`.
- Requests to the protected Products API with a valid Bearer token returned `200 OK`.
- The authenticated Products API returned product data in JSON format.
- Invalid registration data was rejected appropriately.
- Some advanced API scenarios, such as role-based authorization through Postman, were identified for further testing.

---

## 7. Evidence

Representative Postman screenshots were captured to document the API testing performed.

### 7.1 Protected Products API - Without Authentication

**Scenario:** Send a request to the protected Products API without providing a Bearer token.

- **Endpoint:** `GET /api/products/my`
- **Expected Result:** `401 Unauthorized`
- **Actual Result:** `401 Unauthorized`

**Response:**

```json
{
  "success": false,
  "message": "No token provided"
}
```

**Evidence:**

`QA/06-API-Testing/Evidence/API-01-Products-Without-Token-401.png`

**What this demonstrates:**

- Protected endpoint authentication requirement
- Bearer token authentication
- HTTP `401 Unauthorized`
- JSON error response validation

---

### 7.2 Protected Products API - With Bearer Token

**Scenario:** Send the same protected Products API request with a valid Bearer token.

- **Endpoint:** `GET /api/products/my`
- **Expected Result:** `200 OK`
- **Actual Result:** `200 OK`

The response returned product information in JSON format.

**Evidence:**

`QA/06-API-Testing/Evidence/API-02-Products-With-Bearer-Token-200.png`

**What this demonstrates:**

- Bearer token authentication
- Successful access to a protected endpoint
- HTTP `200 OK`
- JSON response validation
- Response data validation

---

### 7.3 Login API - Successful Authentication

**Scenario:** Submit valid user credentials to the Login API.

- **Endpoint:** `POST /api/auth/login`
- **Expected Result:** `200 OK`
- **Actual Result:** `200 OK`

The response contained:

- Successful login message
- Authentication token
- User information
- User role

**Evidence:**

`QA/06-API-Testing/Evidence/API-03-Login-Success-200.png`

**What this demonstrates:**

- POST request execution
- Authentication testing
- HTTP `200 OK`
- JSON response validation
- Authentication token validation
- User data validation

---

### 7.4 Registration API - Duplicate Email

**Scenario:** Attempt to register a user using an email address that already exists.

- **Endpoint:** `POST /api/auth/register`
- **Expected Result:** `400 Bad Request`
- **Actual Result:** `400 Bad Request`

**Response:**

```json
{
  "success": false,
  "message": "Email already exists"
}
```

**Evidence:**

`QA/06-API-Testing/Evidence/API-04-Duplicate-Registration-400.png`

**What this demonstrates:**

- Negative API testing
- Duplicate data validation
- HTTP `400 Bad Request`
- Error response validation
- Business validation

---

### 7.5 Registration API - Successful Registration

**Scenario:** Register a new user using valid registration data.

- **Endpoint:** `POST /api/auth/register`
- **Expected Result:** `201 Created`
- **Actual Result:** `201 Created`

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully"
}
```

**Evidence:**

`QA/06-API-Testing/Evidence/API-05-Registration-Success-201.png`

**What this demonstrates:**

- POST request execution
- Positive API testing
- HTTP `201 Created`
- Successful registration validation
- JSON response validation

---

## 8. Evidence Summary

| Evidence | API Scenario | Status | Evidence File |
|---|---|---|---|
| API-01 | Protected Products API without token | `401 Unauthorized` | `API-01-Products-Without-Token-401.png` |
| API-02 | Protected Products API with Bearer token | `200 OK` | `API-02-Products-With-Bearer-Token-200.png` |
| API-03 | Successful Login | `200 OK` | `API-03-Login-Success-200.png` |
| API-04 | Duplicate Registration | `400 Bad Request` | `API-04-Duplicate-Registration-400.png` |
| API-05 | Successful Registration | `201 Created` | `API-05-Registration-Success-201.png` |

---

## 9. API Testing Results

The API testing covered both positive and negative scenarios.

### Positive Scenarios

- Successful user registration
- Successful user login
- Successful authentication using Bearer token
- Successful access to a protected Products API

### Negative Scenarios

- Duplicate email registration
- Accessing a protected API without authentication

The testing verified that the API returned appropriate HTTP status codes and meaningful JSON responses for the tested scenarios.

---

## 10. Summary

API testing was performed using Postman to validate FarmFlow backend behavior independently of the UI.

The testing covered:

- REST API request execution
- HTTP methods
- HTTP status codes
- JSON response validation
- Authentication
- Bearer token usage
- Protected API access
- Input validation
- Duplicate data validation
- Error handling

The testing demonstrated the ability to use Postman to:

- Send API requests
- Provide request data
- Use authentication tokens
- Inspect API responses
- Validate HTTP status codes
- Validate JSON response data
- Perform positive and negative API testing
- Document test evidence
- Identify and document API defects when applicable
