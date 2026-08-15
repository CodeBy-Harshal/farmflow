# FarmFlow - Bug Reports

## Document Information

| Field | Details |
|---|---|
| Project | FarmFlow |
| Document | Bug Reports |
| Version | 1.0 |
| Environment | Local / Development |
| Tester | Harshal Kesbhat |
| Status | In Progress |

---

# Bug Summary

| Bug ID | Module | Title | Severity | Priority | Status |
|---|---|---|---|---|---|
| BUG-AUTH-001 | Authentication | Invalid email format is accepted during registration | Medium | Medium | Open |

---

# BUG-AUTH-001 - Invalid Email Format Accepted During Registration

**Module:** Authentication

**Related Test Case:** TS-AUTH-003

**Title:** Invalid email format is accepted during user registration.

**Severity:** Medium

**Priority:** Medium

**Status:** Open

---

## Description

The registration workflow does not currently validate whether the
email address provided by the user follows a valid email format.

An invalid email address can be entered during registration without
being rejected by the application.

---

## Preconditions

- FarmFlow application is running.
- Registration page is accessible.
- User is not required to be logged in.

---

## Steps to Reproduce

1. Open the FarmFlow registration page.
2. Enter valid registration information in the required fields.
3. Enter an invalid email address.
4. Submit the registration form.
5. Observe the application behavior.

---

## Expected Result

The application should validate the email format and prevent
registration when an invalid email address is provided.

An appropriate validation message should be displayed to the user.

---

## Actual Result

The application does not currently perform email format validation.

The invalid email format is not rejected during the registration
workflow.

---

## Impact

Users may be able to register with incorrectly formatted email
addresses.

This may result in invalid user account data and can cause problems
for functionality that depends on valid email addresses.

---

## Evidence

Evidence can be added here if required.

---

## Recommendation

Implement client-side and/or server-side email format validation
during the registration process.

The application should reject invalid email formats and display a
clear validation message to the user.

---

## Related Test Case

**TS-AUTH-003 - Invalid Email Registration**

**Expected:** Invalid email format should be rejected.

**Actual:** Invalid email format is currently not validated.

**Result:** FAIL
