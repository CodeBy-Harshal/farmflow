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
