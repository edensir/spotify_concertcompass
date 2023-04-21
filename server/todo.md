// frontend
- token that is currently being stored in the localhost
- this token needs to be sent to the backend to create a new user: 
    o sent post request to server path: /createuser;

// backend
- create spotifyService.ts
    o export const me = (accessToken) => do axios call to spotify api /me
    o export const music taste = (accessToken) => do axios call to spotify api /music taste???
- create endpoint for /createuser:
    o take access token from req.body;
    o call spotifyService > me func;
    o call spotifyService > musticTast func; <-
    o from me endpoint get name + email;
    o create new user in database;