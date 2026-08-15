# 1. Authentication

Test cases for user registration, login, logout, authentication validation, and protected resources.

---

## TS-AUTH-001 - Valid User Registration

**Scenario:**  
Verify user registration with valid data.

**Preconditions:**

- FarmFlow application is running.
- Registration page is accessible.
- Test email address is not already registered.

**Test Steps:**

1. Open the registration page.
2. Enter valid registration details.
3. Submit the registration form.
4. Observe the result.

**Expected Result:**  
The user should be successfully registered when valid registration data is provided.

**Actual Result:**  
User was successfully registered.

**Status:** PASS

**Defect:** None

**Evidence:**  
No evidence attached.

---

## TS-AUTH-002 - Existing Email Registration

**Scenario:**  
Verify registration with an already registered email.

**Preconditions:**

- FarmFlow application is running.
- A user account with the test email already exists.

**Test Steps:**

1. Open the registration page.
2. Enter registration details using an already registered email.
3. Submit the registration form.
4. Observe the response.

**Expected Result:**  
The application should prevent registration using an already registered email and display an appropriate error message.

**Actual Result:**  
The application rejected the registration and displayed an "Email already exist" response.

**Status:** PASS

**Defect:** None

**Evidence:**  
No evidence attached.

---

## TS-AUTH-003 - Invalid Email Registration

**Scenario:**  
Verify registration with an invalid email.

**Preconditions:**

- FarmFlow application is running.
- Registration page is accessible.

**Test Steps:**

1. Open the registration page.
2. Enter an invalid email format.
3. Enter the remaining required registration details.
4. Submit the registration form.
5. Observe the result.

**Expected Result:**  
The application should validate the email format and prevent registration when an invalid email address is provided.

**Actual Result:**  
Email format validation is not currently implemented. The application does not prevent registration based on an invalid email format.

**Status:** FAIL

**Defect:** BUG-001

**Observation:**  
Email validation should be implemented for the registration workflow.

**Evidence:**  
Evidence to be added if required.

---

## TS-AUTH-004 - Missing Required Registration Fields

**Scenario:**  
Verify registration with missing required fields.

**Preconditions:**

- FarmFlow application is running.
- Registration page is accessible.

**Test Steps:**

1. Open the registration page.
2. Leave one or more required fields empty.
3. Submit the registration form.
4. Observe the validation behavior.

**Expected Result:**  
The application should prevent form submission when required fields are missing and display an appropriate validation message.

**Actual Result:**  
A validation popup displayed the message "Please fill out this field."

**Status:** PASS

**Defect:** None

**Evidence:**  
No evidence attached.

---

## TS-AUTH-005 - Valid Login

**Scenario:**  
Verify login with valid credentials.

**Preconditions:**

- A valid FarmFlow user account exists.
- Login page is accessible.

**Test Steps:**

1. Open the login page.
2. Enter valid login credentials.
3. Submit the login form.
4. Observe the result.

**Expected Result:**  
The user should be successfully authenticated and logged into the application.

**Actual Result:**  
Login was successful.

**Status:** PASS

**Defect:** None

**Evidence:**  
No evidence attached.

---

## TS-AUTH-006 - Invalid Password

**Scenario:**  
Verify login with an invalid password.

**Preconditions:**

- A registered FarmFlow user exists.
- Login page is accessible.

**Test Steps:**

1. Open the login page.
2. Enter a registered user's email address.
3. Enter an incorrect password.
4. Submit the login form.
5. Observe the response.

**Expected Result:**  
The application should reject the login attempt and display an appropriate authentication error.

**Actual Result:**  
The application rejected the login attempt and displayed "Invalid credentials."

**Status:** PASS

**Defect:** None

**Evidence:**  
No evidence attached.

---

## TS-AUTH-007 - Unregistered Email Login

**Scenario:**  
Verify login with an unregistered email.

**Preconditions:**

- Login page is accessible.
- The email address used for testing is not registered.

**Test Steps:**

1. Open the login page.
2. Enter an unregistered email address.
3. Enter a password.
4. Submit the login form.
5. Observe the response.

**Expected Result:**  
The application should reject the login attempt and display an appropriate authentication error.

**Actual Result:**  
The application rejected the login attempt and displayed "Invalid credential."

**Status:** PASS

**Defect:** None

**Evidence:**  
No evidence attached.

---

## TS-AUTH-008 - Missing Login Credentials

**Scenario:**  
Verify login with missing credentials.

**Preconditions:**

- FarmFlow application is running.
- Login page is accessible.

**Test Steps:**

1. Open the login page.
2. Leave one or more required login fields empty.
3. Submit the login form.
4. Observe the validation behavior.

**Expected Result:**  
The application should prevent submission when required login fields are missing and display an appropriate validation message.

**Actual Result:**  
A validation popup displayed the message "Please fill out this field."

**Status:** PASS

**Defect:** None

**Evidence:**  
No evidence attached.

---

## TS-AUTH-009 - Logout

**Scenario:**  
Verify logout functionality.

**Preconditions:**

- User is successfully logged into FarmFlow.

**Test Steps:**

1. Log into the application.
2. Navigate to the logout option.
3. Perform logout.
4. Observe the application behavior.

**Expected Result:**  
The user should be successfully logged out and should no longer have access to authenticated functionality.

**Actual Result:**  
Logout was successful.

**Status:** PASS

**Defect:** None

**Evidence:**  
No evidence attached.

---

## TS-AUTH-010 - Protected Resource Authentication

**Scenario:**  
Verify protected resources require authentication.

**Status:** NOT EXECUTED

**Note:**  
This scenario will be tested through an appropriate protected API/resource without providing valid authentication credentials.


---

# 2. Authorization

Test cases for verifying role-based access, protected functionality, authentication tokens, and resource-level authorization.

---

## TS-AUTHZ-001 - Authorized User Access

**Scenario:**  
Verify authorized user can access permitted functionality.

**Preconditions:**

- FarmFlow application is running.
- A valid authenticated user account is available.
- The user has permission to access the tested functionality.

**Test Steps:**

1. Log in using an authorized user account.
2. Navigate to the permitted functionality.
3. Perform the applicable action.
4. Observe the result.

**Expected Result:**  
The authorized user should be able to access and use the permitted functionality successfully.

**Actual Result:**  
The authorized user was able to access the permitted functionality successfully.

**Status:** PASS

**Defect:** None

**Evidence:**  
No evidence attached.

---

## TS-AUTHZ-002 - Unauthorized User Access

**Scenario:**  
Verify unauthorized user cannot access restricted functionality.

**Preconditions:**

- FarmFlow application is running.
- A user without the required permission is available.

**Test Steps:**

1. Log in using an unauthorized user account.
2. Attempt to access restricted functionality.
3. Observe the application behavior.

**Expected Result:**  
The application should prevent the unauthorized user from accessing restricted functionality.

**Actual Result:**  
The unauthorized user was prevented from accessing the restricted functionality.

**Status:** PASS

**Defect:** None

**Evidence:**  
No evidence attached.

---

## TS-AUTHZ-003 - Normal User Cannot Access Admin Functionality

**Scenario:**  
Verify normal user cannot access admin functionality.

**Preconditions:**

- FarmFlow application is running.
- A normal/non-admin user account is available.
- Admin functionality exists and requires elevated permissions.

**Test Steps:**

1. Log in using a normal user account.
2. Attempt to access admin functionality.
3. Observe the application behavior.

**Expected Result:**  
A normal user should not be able to access admin-only functionality.

**Actual Result:**  
The normal user was prevented from accessing admin functionality.

**Status:** PASS

**Defect:** None

**Evidence:**  
No evidence attached.

---

## TS-AUTHZ-004 - Invalid Authentication Token

**Scenario:**  
Verify invalid authentication token is rejected.

**Preconditions:**

- A protected API/resource is available.
- An invalid authentication token is available for testing.

**Test Steps:**

1. Send a request to the protected resource.
2. Provide an invalid authentication token.
3. Observe the API response.

**Expected Result:**  
The application/API should reject the request when an invalid authentication token is provided.

**Actual Result:**  
The request containing the invalid authentication token was rejected.

**Status:** PASS

**Defect:** None

**Evidence:**  
No evidence attached.

---

## TS-AUTHZ-005 - Unauthorized Resource Access

**Scenario:**  
Verify users cannot access unauthorized resources.

**Preconditions:**

- FarmFlow application is running.
- An authenticated user account is available.
- A resource that the user is not authorized to access is available.

**Test Steps:**

1. Log in using an authenticated user account.
2. Attempt to access a resource that the user is not authorized to access.
3. Observe the application/API response.

**Expected Result:**  
The application/API should prevent the user from accessing resources for which they do not have authorization.

**Actual Result:**  
The user was prevented from accessing the unauthorized resource.

**Status:** PASS

**Defect:** None

**Evidence:**  
No evidence attached.


# 3. Product Management

Test cases for product creation, validation, product lifecycle, marketplace visibility, product deletion, and product access control.

---

## TS-PROD-001 - Retrieve Products

**Scenario:**  
Verify products can be retrieved.

**Preconditions:**

- FarmFlow application is running.
- A farmer account is available.
- An administrator account is available.
- A product has been registered by a farmer.

**Test Steps:**

1. Log in as a farmer.
2. Register a product in the marketplace.
3. Verify that the product is placed in a pending state.
4. Log in as an administrator.
5. Review the pending product.
6. Activate the product.
7. Navigate to the marketplace.
8. Search for the activated product.

**Expected Result:**  
Active products should be retrieved successfully and displayed on the marketplace.

**Actual Result:**  
When a farmer registers a product, it is initially set to pending. After the administrator makes the product active, it is displayed on the marketplace and can be purchased by a buyer.

**Status:** PASS

**Defect:** None

**Evidence:**  
No evidence attached.

---

## TS-PROD-002 - Create Product With Valid Data

**Scenario:**  
Verify product can be created with valid data.

**Preconditions:**

- FarmFlow application is running.
- A valid farmer account is available.
- Product creation functionality is accessible.

**Test Steps:**

1. Log in as a farmer.
2. Navigate to the Add Product page.
3. Enter valid product information.
4. Submit the product.
5. Observe the result.

**Expected Result:**  
The product should be successfully created.

**Actual Result:**  
Product was successfully created with valid data.

**Status:** PASS

**Defect:** None

**Evidence:**  
No evidence attached.

---

## TS-PROD-003 - Product Creation With Missing Required Fields

**Scenario:**  
Verify product creation with missing required fields.

**Preconditions:**

- FarmFlow application is running.
- A valid farmer account is available.
- Add Product page is accessible.

**Test Steps:**

1. Log in as a farmer.
2. Navigate to the Add Product page.
3. Leave one or more required fields empty.
4. Attempt to create the product.
5. Observe the result.

**Expected Result:**  
The application should prevent product creation when required fields are missing.

**Actual Result:**  
Product creation requires the required fields. The product cannot be created when required information is missing.

**Status:** PASS

**Defect:** None

**Evidence:**  
No evidence attached.

---

## TS-PROD-004 - Product Creation With Invalid Data

**Scenario:**  
Verify product creation with invalid data.

**Preconditions:**

- FarmFlow application is running.
- A valid farmer account is available.
- Add Product page is accessible.

**Test Steps:**

1. Log in as a farmer.
2. Navigate to the Add Product page.
3. Enter invalid data into applicable product fields.
4. Submit the product.
5. Observe the result.

**Expected Result:**  
The application should validate product data and prevent creation when invalid values are provided.

**Actual Result:**  
Invalid data may be problematic if entered by the user. Specific invalid-data scenarios have not yet been verified.

**Status:** NOT EXECUTED

**Defect:** Not determined

**Evidence:**  
To be added after execution.

---

## TS-PROD-005 - Update Product

**Scenario:**  
Verify product can be updated.

**Preconditions:**

- An existing product is available.
- An applicable user account is available.

**Test Steps:**

1. Log in to FarmFlow.
2. Locate an existing product.
3. Attempt to access product update functionality.
4. Attempt to modify the product.

**Expected Result:**  
An authorized user should be able to update an existing product if the functionality is supported.

**Actual Result:**  
Product update functionality is currently not available.

**Status:** NOT AVAILABLE

**Defect:** None

**Evidence:**  
No evidence attached.

---

## TS-PROD-006 - Delete Product

**Scenario:**  
Verify product can be deleted.

**Preconditions:**

- An existing product is available.
- Farmer and administrator accounts are available.

**Test Steps:**

1. Log in as a farmer.
2. Check whether product deletion functionality is available.
3. Log in as an administrator.
4. Access product management.
5. Attempt to delete an existing product.
6. Observe the result.

**Expected Result:**  
Product deletion should only be available to users with the appropriate permissions.

**Actual Result:**  
Product deletion is not available to farmers. Administrators can delete products.

**Status:** PASS

**Defect:** None

**Evidence:**  
No evidence attached.

---

## TS-PROD-007 - Nonexistent Product Handling

**Scenario:**  
Verify nonexistent product handling.

**Preconditions:**

- FarmFlow application/API is running.
- A nonexistent product ID is available for testing.

**Test Steps:**

1. Attempt to access a product that does not exist.
2. Observe the application/API response.
3. Record the response status and message.

**Expected Result:**  
The application/API should handle the nonexistent product appropriately.

**Actual Result:**  
Not yet tested.

**Status:** NOT EXECUTED

**Defect:** Not determined

**Evidence:**  
To be added after execution.

---

## TS-PROD-008 - Unauthorized Product Modification

**Scenario:**  
Verify unauthorized product modification is rejected.

**Preconditions:**

- An existing product is available.
- A user without the required authorization is available.

**Test Steps:**

1. Log in using a user who does not have permission to modify the product.
2. Attempt to modify the product.
3. Submit the modification request.
4. Observe the application/API response.

**Expected Result:**  
The application/API should reject the modification request from an unauthorized user.

**Actual Result:**  
Not yet tested.

**Status:** NOT EXECUTED

**Defect:** Not determined

**Evidence:**  
To be added after execution.


# 4. Order Management

Test cases for order creation, order retrieval, order validation, order access control, and product-related order behavior.

---

## TS-ORDER-001 - Create Order With Authentication

**Scenario:**  
Verify an authenticated user can create an order.

**Preconditions:**

- FarmFlow application is running.
- An authenticated user account is available.
- A valid product is available.

**Test Steps:**

1. Log in to FarmFlow.
2. Attempt to create an order.
3. Observe the result.

**Expected Result:**  
Only users with the appropriate permissions should be able to create orders.

**Actual Result:**  
Only farmers and administrators can create orders.

**Status:** PASS

**Defect:** None

**Evidence:**  
No evidence attached.

---

## TS-ORDER-002 - Retrieve Order Details

**Scenario:**  
Verify order details can be retrieved.

**Preconditions:**

- FarmFlow application is running.
- An order exists.
- An authorized user account is available.

**Test Steps:**

1. Log in using an authorized account.
2. Request/access the order details.
3. Observe the response.

**Expected Result:**  
The application should successfully return the details of an existing order.

**Actual Result:**  
Order details can be retrieved successfully.

**Status:** PASS

**Defect:** None

**Evidence:**  
No evidence attached.

---

## TS-ORDER-003 - Invalid Order Data

**Scenario:**  
Verify invalid order data is rejected.

**Preconditions:**

- FarmFlow application/API is running.
- Order creation functionality is available.

**Test Steps:**

1. Attempt to create an order using invalid order data.
2. Submit the request.
3. Observe the response.

**Expected Result:**  
The application/API should reject invalid order data and return an appropriate validation or error response.

**Actual Result:**  
Invalid order data was rejected.

**Status:** PASS

**Defect:** None

**Evidence:**  
No evidence attached.

---

## TS-PROD-004 - Product Creation With Invalid Data

**Scenario:**  
Verify product creation with invalid data.

**Preconditions:**

- FarmFlow application is running.
- A valid farmer account is available.
- Product creation functionality is accessible.

**Test Steps:**

1. Log in as a farmer.
2. Navigate to the Add Product page.
3. Enter valid product information.
4. Enter an invalid negative price.
5. Enter zero price.
6. Enter a negative quantity.
7. Enter zero quantity.
8. Enter a harvest date later than the expiry date.
9. Submit the product.
10. Observe the result.

**Expected Result:**  
The application should reject invalid product values and prevent
logically invalid product information from being created.

**Actual Result:**

- Negative price was rejected.
- Price value of `0` was rejected.
- Price value of `0.01` was accepted.
- Negative quantity was rejected.
- Quantity value of `0` was rejected.
- Quantity value of `1` was accepted.
- However, the application allowed a product to be created when the
  expiry date was earlier than the harvest date.

**Status:** FAIL

**Defect:** BUG-PROD-001

**Observation:**  
Input validation for price and quantity worked as expected. However,
date relationship validation between harvest date and expiry date is
missing.

**Evidence:**  
[BUG-PROD-001 - Invalid Product Dates](../05-Test-Evidence/Product-Management/BUG-PROD-001-invalid-product-dates.png)

---

## TS-ORDER-005 - Unauthorized Order Access

**Scenario:**  
Verify unauthorized order access is rejected.

**Preconditions:**

- FarmFlow application/API is running.
- An order exists.
- A user without authorization to access the order is available.

**Test Steps:**

1. Log in using an unauthorized user account.
2. Attempt to access an order that the user is not authorized to access.
3. Observe the application/API response.

**Expected Result:**  
The application/API should reject unauthorized access to the order.

**Actual Result:**  
Unauthorized order access was rejected.

**Status:** PASS

**Defect:** None

**Evidence:**  
No evidence attached.

---

## TS-ORDER-006 - Order Update Functionality

**Scenario:**  
Verify order update functionality.

**Preconditions:**

- An existing order is available.
- An applicable user account is available.

**Test Steps:**

1. Log in to FarmFlow.
2. Locate an existing order.
3. Attempt to access order update functionality.
4. Attempt to modify the order.

**Expected Result:**  
An authorized user should be able to update an order if order-update functionality is supported.

**Actual Result:**  
Order update functionality is currently not available.

**Status:** NOT AVAILABLE

**Defect:** None

**Evidence:**  
No evidence attached.

---

## TS-ORDER-007 - Invalid Product Information in Order

**Scenario:**  
Verify order behavior with invalid product information.

**Preconditions:**

- FarmFlow application is running.
- Marketplace is accessible.

**Test Steps:**

1. Open the marketplace.
2. Review the products available for ordering.
3. Verify whether invalid/unavailable products can be listed.
4. Attempt to place an order using an invalid/unlisted product if possible.
5. Observe the result.

**Expected Result:**  
Invalid or unavailable products should not be listed in the marketplace and should not be available for ordering.

**Actual Result:**  
Invalid products cannot be listed in the marketplace.

**Status:** PASS

**Defect:** None

**Evidence:**  
No evidence attached.


# 5. API Testing

Test cases for validating FarmFlow REST APIs, including HTTP status codes, response structure, required fields, invalid requests, authentication, and authorization.

---

## TS-API-001 - Correct HTTP Status Codes

**Scenario:**  
Verify APIs return appropriate HTTP status codes for successful and unsuccessful requests.

**Preconditions:**

- FarmFlow backend API is running.
- Postman is available.
- API endpoints are accessible.

**Test Steps:**

1. Send a valid registration request to the registration API.
2. Observe the HTTP response status.
3. Send a duplicate registration request using an already registered email.
4. Observe the HTTP response status.
5. Send a valid login request.
6. Observe the HTTP response status.

**Expected Result:**  
The API should return appropriate HTTP status codes according to the result of the request.

**Actual Result:**

- Valid registration returned `201 Created`.
- Duplicate email registration returned `400 Bad Request`.
- Valid login returned `200 OK`.

**Status:** PASS

**Defect:** None

**Evidence:**

- Postman registration request — `201 Created`
- Postman duplicate email request — `400 Bad Request`
- Postman login request — `200 OK`

---

## TS-API-002 - Response Body Structure

**Scenario:**  
Verify API response bodies follow the expected structure.

**Preconditions:**

- FarmFlow backend API is running.
- Postman is available.

**Test Steps:**

1. Send a valid registration request.
2. Inspect the JSON response body.
3. Send a valid login request.
4. Inspect the JSON response body.
5. Verify the response contains the expected fields.

**Expected Result:**  
The API should return a valid JSON response with a consistent and meaningful response structure.

**Actual Result:**  

The registration API returned a JSON response containing:

- `success`
- `message`

The login API returned a JSON response containing:

- `success`
- `message`
- `data`
- `token`
- `user`

The user object contained fields including:

- `id`
- `role`
- `name`
- `email`
- `phone`

**Status:** PASS

**Defect:** None

**Evidence:**  
Postman response screenshots.

---

## TS-API-003 - Required Response Fields

**Scenario:**  
Verify required fields are present in API responses.

**Preconditions:**

- FarmFlow backend API is running.
- Postman is available.
- Valid registration and login requests can be executed.

**Test Steps:**

1. Send a valid registration request.
2. Inspect the response body.
3. Send a valid login request.
4. Inspect the response body.
5. Verify the expected response fields are returned.

**Expected Result:**  
The API should return the required response fields for each endpoint.

**Actual Result:**  

The registration response returned:

- `success`
- `message`

The login response returned:

- `success`
- `message`
- `data`
- authentication `token`
- user information

**Status:** PASS

**Defect:** None

**Evidence:**  
Postman response screenshots.

---

## TS-API-004 - Invalid Request Handling

**Scenario:**  
Verify the API properly handles invalid requests.

**Preconditions:**

- FarmFlow backend API is running.
- Postman is available.
- A request that violates an API validation rule is available.

**Test Steps:**

1. Send an invalid request to the API.
2. Observe the HTTP status code.
3. Inspect the response body.
4. Verify that the API provides an appropriate error response.

**Expected Result:**  
The API should reject invalid requests and return an appropriate HTTP status code and error message.

**Actual Result:**  

A registration request using an already registered email was rejected.

The API returned:

- HTTP Status: `400 Bad Request`
- `success: false`
- Message: `Email already exists`

**Status:** PASS

**Defect:** None

**Evidence:**  
Postman duplicate-email registration response.

---

## TS-API-005 - Missing Required Parameters

**Scenario:**  
Verify the API handles requests with missing required parameters.

**Preconditions:**

- FarmFlow backend API is running.
- Postman is available.

**Test Steps:**

1. Send an API request with one or more required parameters omitted.
2. Observe the HTTP response.
3. Inspect the response body.
4. Verify that the request is rejected appropriately.

**Expected Result:**  
The API should reject requests containing missing required parameters and return an appropriate validation response.

**Actual Result:**  
Not yet tested through Postman.

**Status:** NOT EXECUTED

**Defect:** Not determined

**Evidence:**  
To be added after execution.

---

## TS-API-006 - Invalid IDs

**Scenario:**  
Verify the API handles invalid or nonexistent resource IDs correctly.

**Preconditions:**

- FarmFlow backend API is running.
- Postman is available.
- An endpoint accepting a resource ID is available.

**Test Steps:**

1. Send a request using an invalid or nonexistent resource ID.
2. Observe the HTTP response.
3. Inspect the response body.
4. Verify that the API handles the invalid ID appropriately.

**Expected Result:**  
The API should reject or appropriately handle invalid/nonexistent IDs without returning incorrect resource data.

**Actual Result:**  
Not yet tested through Postman.

**Status:** NOT EXECUTED

**Defect:** Not determined

**Evidence:**  
To be added after execution.

---

## TS-API-007 - Authentication Requirements

**Scenario:**  
Verify protected APIs require authentication.

**Preconditions:**

- FarmFlow backend API is running.
- A protected API endpoint is available.
- Postman is available.

**Test Steps:**

1. Send a request to a protected API without authentication credentials/token.
2. Observe the HTTP response.
3. Send the same request with a valid authentication token.
4. Compare the responses.

**Expected Result:**  
The protected API should reject unauthenticated requests and allow access when valid authentication is provided.

**Actual Result:**  
Authentication flow was verified through the login API. A successful login returned an authentication token.

Protected API authentication without a token has not yet been independently executed for this test case.

**Status:** NOT EXECUTED

**Defect:** Not determined

**Evidence:**  
Postman login response demonstrates successful token generation. Protected endpoint verification to be added.

---

## TS-API-008 - Authorization Requirements

**Scenario:**  
Verify APIs enforce authorization requirements based on user permissions/roles.

**Preconditions:**

- FarmFlow backend API is running.
- Users with different roles are available.
- Postman is available.
- A protected role-specific API endpoint is available.

**Test Steps:**

1. Authenticate as a user with the required role.
2. Access the protected API.
3. Observe the response.
4. Authenticate as a user without the required role.
5. Attempt to access the same API.
6. Observe the response.

**Expected Result:**  
The API should allow authorized users to access permitted functionality and reject users without the required permissions.

**Actual Result:**  
Role-based authorization has been tested as part of the FarmFlow authorization scenarios.

API-level authorization for this specific test case has not yet been independently documented through Postman.

**Status:** NOT EXECUTED

**Defect:** Not determined

**Evidence:**  
To be added after API-level authorization execution.


# 6. UI Testing

Test cases for validating FarmFlow user interface workflows, including authentication, registration, product management, order management, form validation, and logout functionality.

---

## TS-UI-001 - Login Workflow

**Scenario:**  
Verify login workflow.

**Preconditions:**

- FarmFlow application is running.
- A valid user account is available.
- Login functionality is accessible.

**Test Steps:**

1. Open the FarmFlow application.
2. Open the login form.
3. Enter valid user credentials.
4. Submit the login form.
5. Observe the application behavior.
6. Verify that the user is logged in with the appropriate role.

**Expected Result:**  
The user should be successfully authenticated and redirected to the appropriate application functionality.

**Actual Result:**  
The login workflow was successfully executed. The application authenticated the user and displayed the appropriate role-based interface.

**Status:** PASS

**Defect:** None

**Evidence:**  
Screen recording of the login workflow.

---

## TS-UI-002 - Invalid Login Workflow

**Scenario:**  
Verify invalid login workflow.

**Preconditions:**

- FarmFlow application is running.
- Login page is accessible.
- Invalid login credentials are available.

**Test Steps:**

1. Open the login form.
2. Enter invalid login credentials.
3. Submit the login form.
4. Observe the application response.

**Expected Result:**  
The application should reject invalid credentials and display an appropriate authentication error.

**Actual Result:**  
Invalid login behavior was tested as part of the authentication testing. The application rejects invalid credentials.

**Status:** PASS

**Defect:** None

**Evidence:**  
Authentication test evidence.

---

## TS-UI-003 - Registration Workflow

**Scenario:**  
Verify registration workflow.

**Preconditions:**

- FarmFlow application is running.
- Registration functionality is accessible.

**Test Steps:**

1. Open the registration form.
2. Select the appropriate user type.
3. Enter the required registration information.
4. Submit the registration form.
5. Observe the result.

**Expected Result:**  
The user should be successfully registered when valid registration information is provided.

**Actual Result:**  
The registration workflow was successfully executed. The registration interface provides user-type selection and fields for name, email, and password.

**Status:** PASS

**Defect:** None

**Evidence:**  
Screen recording of the registration workflow.

---

## TS-UI-004 - Product Viewing Workflow

**Scenario:**  
Verify product viewing workflow.

**Preconditions:**

- FarmFlow application is running.
- Products are available in the system.
- The user has access to the applicable product/marketplace functionality.

**Test Steps:**

1. Log in to FarmFlow.
2. Navigate to the product/marketplace functionality.
3. Review the available products.
4. Open an available product where applicable.
5. Verify the displayed product information.

**Expected Result:**  
Available products should be displayed correctly with relevant product information.

**Actual Result:**  
Products were displayed in the application. The admin product catalog displayed product information including product name, category, seller, price, stock, and status.

**Status:** PASS

**Defect:** None

**Evidence:**  
Screen recording of product viewing and product catalog.

---

## TS-UI-005 - Product Management Workflow

**Scenario:**  
Verify product management workflow.

**Preconditions:**

- FarmFlow application is running.
- A farmer account is available.
- An administrator account is available.

**Test Steps:**

1. Log in as a farmer.
2. Navigate to the Add Product page.
3. Enter product information.
4. Submit the product.
5. Log in as an administrator.
6. Navigate to Product Catalog.
7. Review the submitted product.
8. Verify the product status.
9. Activate or manage the product where applicable.

**Expected Result:**  
A farmer should be able to submit a product, and an administrator should be able to review and manage the product according to its status.

**Actual Result:**  
The product management workflow was demonstrated.

The farmer interface provides product fields including:

- Product Name
- Category
- Unit
- Price
- Quantity Available
- Harvest Date
- Expiry Date
- Description
- Organic Product
- Product Images

The administrator Product Catalog displays products with seller, price, stock, status, and management actions.

**Status:** PASS

**Defect:** None

**Evidence:**  
Screen recording of farmer product creation and administrator product management.

---

## TS-UI-006 - Order Workflow

**Scenario:**  
Verify order workflow.

**Preconditions:**

- FarmFlow application is running.
- A buyer account is available.
- At least one valid marketplace product is available.

**Test Steps:**

1. Log in as a buyer.
2. Navigate to the Orders section.
3. Review the available orders.
4. Open an order.
5. Review the order details.
6. Verify the order status and status history.

**Expected Result:**  
The buyer should be able to view their orders and access the details of an individual order.

**Actual Result:**  
The order workflow was successfully demonstrated.

The order details displayed:

- Order number
- Product/item
- Quantity
- Unit price
- Subtotal
- Shipping
- Discount
- Total
- Order status
- Status history

The demonstrated order progressed from `PENDING` to `ACCEPTED`.

**Status:** PASS

**Defect:** None

**Evidence:**  
Screen recording of the buyer order details workflow.

---

## TS-UI-007 - Form Validation

**Scenario:**  
Verify form validation.

**Preconditions:**

- FarmFlow application is running.
- A form containing required fields is accessible.

**Test Steps:**

1. Open a registration, login, or product form.
2. Leave one or more required fields empty.
3. Attempt to submit the form.
4. Observe the validation behavior.

**Expected Result:**  
The application should prevent submission when required fields are missing and display an appropriate validation message.

**Actual Result:**  
Required-field validation was observed during authentication testing. The application displays browser validation when required fields are left empty.

**Status:** PASS

**Defect:** None

**Evidence:**  
Authentication test evidence.

---

## TS-UI-008 - Logout Workflow

**Scenario:**  
Verify logout workflow.

**Preconditions:**

- A user is successfully logged into FarmFlow.

**Test Steps:**

1. Log in to FarmFlow.
2. Locate the Logout option.
3. Click Logout.
4. Observe the application behavior.
5. Verify that authenticated navigation is no longer available.

**Expected Result:**  
The user should be successfully logged out and should no longer have access to authenticated functionality.

**Actual Result:**  
Logout functionality was successfully tested during the authentication workflow.

**Status:** PASS

**Defect:** None

**Evidence:**  
Authentication test evidence.
