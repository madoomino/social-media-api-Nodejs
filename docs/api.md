## Auth API Documentation

### Register User

Endpoint: `POST /api/v1/auth/register`

Registers a new user.

**Request Body:**

- `username` (string, required): The username of the user.
- `password` (string, required): The password of the user.
- `email` (string, required): The email address of the user.
- `firstName` (string, required): The first name of the user.
- `lastName` (string, required): The last name of the user.

**Response:**

- `user` (object): The registered user object with sensitive data removed.
- `accessToken` (string): The access token for the user.

### Login User

Endpoint: `POST /api/v1/auth/login`

Logs in a user.

**Request Body:**

- `email` (string, required): The email address of the user.
- `password` (string, required): The password of the user.

**Response:**

- `user` (object): The logged-in user object with sensitive data removed.
- `accessToken` (string): The access token for the user.

### Logout User

Endpoint: `POST /api/v1/auth/logout`

Logs out a user.

**Response:**

- Status: `204 No Content`

### Reset Password

Endpoint: `POST /api/v1/auth/reset-password`

Resets the password for a user.

**Request Body:**

- `oldPassword` (string, required): The old password of the user.
- `newPassword` (string, required): The new password of the user.

**Response:**

- Status: `200 OK`
- Message: "Password updated"

---

## Users API Documentation

### Get User Data

Endpoint: `GET /api/v1/users/:id`

Retrieves user data by ID.

**Request Parameters:**

- `id` (string, required): The ID of the user.

**Response:**

- `username` (string): The username of the user.
- `firstName` (string): The first name of the user.
- `lastName` (string): The last name of the user.

---

## Comments API Documentation

### Create Comment

Endpoint: `POST /api/v1/comments`

Creates a new comment.

**Request Body:**

- `body` (string, required): The body text of the comment.
- `parentCommentId` (string, optional): The ID of the parent comment if this is a reply.
- `relatedPostId` (string, required): The ID of the related post.

**Response:**

- `id` (string): The ID of the created comment.
- `body` (string): The body text of the comment.
- `parentCommentId` (string): The ID of the parent comment if this is a reply.
- `relatedPostId` (string): The ID of the related post.
- `userId` (string): The ID of the user who created the comment.

---

## Posts API Documentation

### Create Post

Endpoint: `POST /api/v1/posts`

Creates a new post.

**Request Body:**

- `body` (string, required): The body text of the post.
- `tags` (array, optional): An array of tags associated with the post.
- `hashtags` (array, optional): An array of hashtags associated with the post.

**Response:**

- `id` (string): The ID of the created post.
- `body` (string): The body text of the post.
- `userId` (string): The ID of the user who created the post.
- `images` (array): An array of image filenames associated with the post.
- `tags` (array): An array of tags associated with the post.
- `hashtags` (array): An array of hashtags associated with the post.

### Get User Posts

Endpoint: `GET /api/v1/users/:id/posts`

Retrieves posts created by a specific user.

**Request Parameters:**

- `id` (string, required): The ID of the user.

**Response:**

- An array of post objects created by the user.
