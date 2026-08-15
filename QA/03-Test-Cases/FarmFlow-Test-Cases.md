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

## TS-ORDER-004 - Nonexistent Order Handling

**Scenario:**  
Verify nonexistent order handling.

**Preconditions:**

- FarmFlow application is running.
- Marketplace is accessible.

**Test Steps:**

1. Access the marketplace.
2. Review the products available for ordering.
3. Attempt to identify/access a product that is not available as a listed marketplace product.
4. Observe the result.

**Expected Result:**  
Only valid and listed products should be available for marketplace ordering.

**Actual Result:**  
Only listed products are visible in the marketplace. Products that are not listed are not available for ordering.

**Status:** PASS

**Defect:** None

**Evidence:**  
No evidence attached.

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
