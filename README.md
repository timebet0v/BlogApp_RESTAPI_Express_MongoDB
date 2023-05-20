# Blog REST API

## STACK
1. MongoDB
2. NodeJS
3. ExpressJS

## Install

1. Install all the dependencies
```
npm i
```

2. Create ".env" file in the root directory
3. Put two following variables inside the ".env" file and give them values:
  - `SERVER_PORT`
  - `DB_URL`

## Endpoints

#### Get all posts
1. GET = `/api/posts`

Returns a list of posts.
Optional query parameters:
  * limit: by default is 10

#### Get a single post
2. GET = `/api/posts/:id`

Retrieve detailed information about a post.

#### Create a brand new post
3. POST = `/api/posts`

The request body needs to be in JSON format and include the following properties:
  * `title` - String - Required
  * `body` - String - Required

Example
```
POST /api/posts
{
  "title": "Just post",
  "body": "Just text"
}
```

#### Update a post
4. PUT `/api/posts/:id`
Update an existing post.
The request body needs to be in JSON format and allows you to update the following properties:
  * `title` - String
  * `body` - String

Example
```
PUT /api/posts/TR2QsqAVvtsXpnCrgmTu0
{
  "title": "Updated title",
  "body": "Updated content"
}
```

#### Delete a post
5. DELETE `/api/posts/:id`

Delete an existing post.
Example
```
DELETE /api/posts/TR2QsqAVvtsXpnCrgmTu0
```