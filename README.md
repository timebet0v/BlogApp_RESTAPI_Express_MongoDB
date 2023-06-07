# BlogApp RESTFull API Documentation

## STACK
1. MongoDB
2. NodeJS
3. ExpressJS

## Foreword
As they says: "Documentation effectively connects humans and machines" So, I decided to write it.
There are no Client or Server-Side Rendering pages, any type of static files. Responses send only via JSON format, because of RESTFul API architecture requirements. This is simple pure REST API backend application in NodeJS platform. Implemented all the CRUD operations for Post, User models, using gorgeous library a.k.a. Mongoose. Also, authentication with `JWT` which stands for JSON Web Token and authorization which means protecting routes, by giving access to this routes or performing some kind of actions for the only certain type of users. Hope, that my resource will be useful for you.

## P.S.
> Only authenticated users can CREATE, UPDATE, DELETE posts
> Only authenticated users can visit route `/profile/*`
> Only authenticated users can see the list of all users and get one by id
> Only authenticated users and who has the role of `admin` can perform actions such as: update and delete users by id
> For resetting password functionality and sending mails I used service [mailtrap](https://mailtrap.io/)

## Install

1. Install all the dependencies
```
npm i
```

2. Create ".env" file in the root directory
3. Put two following variables inside the ".env" file and give them values:
  - `NODE_ENV=production`
  - `SERVER_PORT=`
  - `DB_URL=`
  - `JWT_SECRET_KEY=`
  - `JWT_EXPIRES_IN=`
  - `EMAIL_USERNAME=`
  - `EMAIL_PASSWORD=`
  - `EMAIL_HOST=`
  - `EMAIL_PORT=`
---
## POSTS
### Post Model
Post model has the following fields:
  - title
  - body

### Endpoints
#### Get all posts
1. GET = `/api/posts`

Returns a list of posts.
Optional query parameters:
  * limit: by default is 5

#### Get a single post
2. GET = `/api/posts/:id`

Retrieve detailed information about a post.

#### Create a brand new post
3. POST = `/api/posts`
> Requires authentication

The request body needs to be in JSON format and include the following properties:
  * `title` - String - Required
  * `body` - String - Required

Example
```JSON
POST /api/posts
Authorization: Bearer <YOUR TOKEN>
{
  "title": "Just post",
  "body": "Just text"
}
```

#### Update a post
4. PUT `/api/posts/:id`
> Requires authentication

Update an existing post.
The request body needs to be in JSON format and allows you to update the following properties:
  * `title` - String
  * `body` - String

Example
```JSON
PUT /api/posts/TR2QsqAVvtsXpnCrgmTu0
Authorization: Bearer <YOUR TOKEN>
{
  "title": "Updated title",
  "body": "Updated content"
}
```

#### Delete a post
5. DELETE `/api/posts/:id`
> Requires authentication

Delete an existing post.
Example
```
DELETE /api/posts/TR2QsqAVvtsXpnCrgmTu0
Authorization: Bearer <YOUR TOKEN>
```
---
# API Authentication
> To create a brand new, update and delete posts, you need to register your API client.
### Registering new user
1. POST `/signup`

The request body needs to be in JSON format and include the following properties:
  * `username` - String - Must be unique - Required
  * `email` - String - Must be unique - Required
  * `password` - String - Required
  * `passwordConfirm` - String - Must match with the password field - Required

EXAMPLE:
```JSON
{
  "username": "client1",
  "email": "client1@gmail.com",
  "password": "somePass2@23",
  "passwordConfirm": "somePass2@23",
}
```
The response body will contain the access token. The access token is valid for the number of days which given in the `.env` file in the field: `JWT_EXPIRES_IN`.

### Logging in
2. POST `/login`
The request body needs to be in JSON format and include the following properties:
  * `username` - String - Required
  * `password` - String - Required
EXAMPLE:
```JSON
{
  "username": "client1",
  "password": "somePass2@23"
}
```
The response body will contain the access token. The access token is valid for the number of days which given in the `.env` file in the field: `JWT_EXPIRES_IN`.

### Forgot password
3. POST `/forgotPassword`
If you forgot your password you can easily reset it via `TOKEN to change password`
This token will be send to your email address that you provide in the json format in the request body.
EXAMPLE:
```JSON
{
  "email": "client1@gmail.com"
}
```

### Reset password
4. PATCH `/resetPassword/:token`
Resetting password via Token that user gets in email.
The request body needs to be in JSON format and include the following properties:
  * `password` - String - Required
  * `passwordConfirm` - String - Required

EXAMPLE:
```JSON
{
  "password": "newPass2@23",
  "passwordConfirm": "newPass2@23"
}
```
The response body will contain the access token. The access token is valid for the number of days which given in the `.env` file in the field: `JWT_EXPIRES_IN`.

---

# Users
### Get All users
> Requires authentication
1. GET `/api/users`

```Authorization: Bearer <YOUR TOKEN>```
To get a list of all users that registered in the service.

### Get one user by ID
> Requires authentication
2. GET `/api/users/:id`

```Authorization: Bearer <YOUR TOKEN>```
Retrieve detailed information about a user.

### Update user by ID
> Requires authentication and admin role
3. PATCH `/api/users/:id`

Here you can optionally change the role of user. The user performing this action must be already admin.

Example
```JSON
PATCH /api/users/64802c253cf0537bd3c1d02e
Authorization: Bearer <YOUR TOKEN>
{
  "username": "client2",
  "email": "client2@gmail.com",
  "role": "admin" // optionally
}
```

### Remove user by ID
> Requires authentication and admin role
4. DELETE `/api/users/:id`

Delete an existing user.
Example
```
DELETE /api/users/64802c253cf0537bd3c1d02e
Authorization: Bearer <YOUR TOKEN>
```
---

# Profile
### To get profile (current logged in user) info
> Requires authentication
1. GET `/api/profile`

```Authorization: Bearer <YOUR TOKEN>```
Retrieve detailed information about the logged in user.
### To update profile (current logged in user) info
> Requires authentication
2. PUT `/api/profile`

```Authorization: Bearer <YOUR TOKEN>```
You can change only username and email fields.

Example
```JSON
PUT /api/profile
Authorization: Bearer <YOUR TOKEN>
{
  "username": "newusernameforclient",
  "email": "newemailforclient@gmail.com"
}
```
### To change password (current logged in user)
> Requires authentication
3. PATCH `/api/profile`

Example
```JSON
PATCH /api/profile
Authorization: Bearer <YOUR TOKEN>
{
  "passwordCurrent": "somePass2@23",              // old password || current password
  "password": "newPasswordForClient2@23",         // new password
  "passwordConfirm": "newPasswordForClient2@23"
}
```

### Deactivate your account (current logged in user)
> Requires authentication
4. DELETE `/api/profile`

Deactivation means user will not be deleted, but hidden everywhere.
User will be remaining in database.

EXAMPLE:
```
DELETE /api/profile
Authorization: Bearer <YOUR TOKEN>
```
