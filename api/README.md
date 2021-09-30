# API References

## Authentication

### 1. Login

-   Send back a bearer token for client

-   Save a refresh token to client cookie for consistent use

### 2. Register

-   Check if user existed, if yes, throw error back to client, else create new user in the database

-   Send verification email (not yet implemented)

### 3. Refresh token

-   Issue new access token and new refresh token back to client

-   TODO:

    -   Save expired token (both access and refresh) to database to detect reuse

    -   Invalidate the user who use the expired token (malicious use), then after the current refresh token expired, invalidate the valid user
