# Portfolio & Blog API

RESTful API for Personal Portfolio & Blog - Capstone Project

## Table of Contents

- [Overview](#overview)
- [API Endpoints](#api-endpoints)
  - [Health Check](#health-check)
  - [User Routes](#user-routes)
  - [Project Routes](#project-routes)
  - [Blog Routes](#blog-routes)
  - [Comment Routes](#comment-routes)
  - [Message Routes](#message-routes)
- [Authentication](#authentication)
- [Error Handling](#error-handling)

## Overview

This API provides endpoints for managing a personal portfolio and blog, including user authentication, project management, blog posts, comments, and contact form submissions.

## API Endpoints

### Health Check

#### GET /health
- **Description**: Health check endpoint for monitoring
- **Access**: Public
- **Response**: Status of the server

### User Routes

#### POST /api/users/register
- **Description**: Register a new user
- **Access**: Public
- **Body Parameters**:
  - `username`: String (required, min 3 characters)
  - `email`: String (required, valid email format)
  - `password`: String (required, min 6 characters)
- **Response**: User data and JWT token

#### POST /api/users/login
- **Description**: Login user
- **Access**: Public
- **Body Parameters**:
  - `email`: String (required)
  - `password`: String (required)
- **Response**: User data and JWT token

### Project Routes

#### GET /api/projects
- **Description**: Get all projects
- **Access**: Public
- **Response**: Array of project objects

#### POST /api/projects
- **Description**: Create new project
- **Access**: Protected (requires authentication)
- **Body Parameters**:
  - `title`: String (required, min 3 characters)
  - `description`: String (required, min 10 characters)
  - `imageUrl`: String (optional, valid image URL)
  - `repoUrl`: String (optional, valid GitHub repository URL)
  - `liveUrl`: String (optional, valid URL)
- **Response**: Created project object

#### GET /api/projects/:id
- **Description**: Get single project
- **Access**: Public
- **URL Parameters**:
  - `id`: String (project ID)
- **Response**: Project object

#### PUT /api/projects/:id
- **Description**: Update project
- **Access**: Protected (requires authentication)
- **URL Parameters**:
  - `id`: String (project ID)
- **Body Parameters** (all optional):
  - `title`: String (min 3 characters)
  - `description`: String (min 10 characters)
  - `imageUrl`: String (valid image URL)
  - `repoUrl`: String (valid GitHub repository URL)
  - `liveUrl`: String (valid URL)
- **Response**: Updated project object

#### DELETE /api/projects/:id
- **Description**: Delete project
- **Access**: Protected (requires authentication)
- **URL Parameters**:
  - `id`: String (project ID)
- **Response**: Success message

### Blog Routes

#### GET /api/blog
- **Description**: Get all blog posts
- **Access**: Public
- **Response**: Array of blog post objects

#### POST /api/blog
- **Description**: Create new blog post
- **Access**: Protected (requires authentication)
- **Body Parameters**:
  - `title`: String (required, min 5 characters)
  - `content`: String (required, min 20 characters)
- **Response**: Created blog post object with author information

#### GET /api/blog/:id
- **Description**: Get single blog post
- **Access**: Public
- **URL Parameters**:
  - `id`: String (blog post ID)
- **Response**: Blog post object with author and comments information

#### PUT /api/blog/:id
- **Description**: Update blog post (author only)
- **Access**: Protected (requires authentication)
- **URL Parameters**:
  - `id`: String (blog post ID)
- **Body Parameters** (all optional):
  - `title`: String (min 5 characters)
  - `content`: String (min 20 characters)
- **Response**: Updated blog post object

#### DELETE /api/blog/:id
- **Description**: Delete blog post (author only)
- **Access**: Protected (requires authentication)
- **URL Parameters**:
  - `id`: String (blog post ID)
- **Response**: Success message

### Comment Routes

#### GET /api/blog/:postId/comments
- **Description**: Get all comments for a blog post
- **Access**: Public
- **URL Parameters**:
  - `postId`: String (blog post ID)
- **Response**: Array of comment objects

#### POST /api/blog/:postId/comments
- **Description**: Create a new comment for a blog post
- **Access**: Protected (requires authentication)
- **URL Parameters**:
  - `postId`: String (blog post ID)
- **Body Parameters**:
  - `body`: String (required, min 1 character, max 1000 characters)
- **Response**: Created comment object with author information

### Message Routes

#### POST /api/contact
- **Description**: Create a new message (contact form submission)
- **Access**: Public
- **Body Parameters**:
  - `name`: String (required, min 2 characters)
  - `email`: String (required, valid email format)
  - `message`: String (required, min 5 characters, max 2000 characters)
- **Response**: Created message object

## Authentication

Protected routes require a valid JWT token in the Authorization header:
