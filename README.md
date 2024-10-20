# react-task-sign

# Express.js Backend with Prisma ORM and Authentication


## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd server
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
Create a `.env` file in the root directory of your project.
Refer to the `.env.example` file for the required variables.
Populate the .env file with the appropriate values for your environment.

5. Set up the database:
   ```
   npx prisma migrate dev --name init
   ```
   This command will create the necessary tables in your database.

## Usage

To start the server in development mode:

```
node --watch app.js
```


## Authentication

This API uses JWT for authentication. After logging in, include the JWT in the `Authorization` header of your requests:

```
Authorization: Bearer <your-jwt-token>
```

# React Frontend with Vite

A brief description of your project, including its purpose and key features.

## Table of Contents



### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd client
   ```

2. Install the dependencies:
   ```
   npm install
   ```
3. Configure environment variables:
Create a `.env` file in the root directory of your project.
Refer to the `.env.example` file for the required variables.
Populate the .env file with the appropriate values for your environment.

4. To start the client in development mode:

```
npm run dev
```
