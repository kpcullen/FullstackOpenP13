# Full Stack Open Part 13: Blog App Backend

This is the backend for the Blog App, part of the Full Stack Open course. It handles user authentication, blog posts, and session management, with a feature to invalidate a user's token mid-session.

## Table of Contents

- [Installation](#installation)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Configuration](#configuration)
- [Usage](#usage)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/fullstackopen-part13.git
   cd fullstackopen-part13
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Ensure you have a PostgreSQL database running locally or on a server. Set up the required environment variables (see [Configuration](#configuration)).

## Technologies Used

- **PostgreSQL** - For data storage.
- **Sequelize** - ORM for handling database operations.
- **Node.js** - Server-side JavaScript runtime.
- **Express** - Web framework for Node.js.
- **JsonWebToken (JWT)** - For secure token-based authentication.

## Features

- **User Authentication**: Uses JWT for secure login and token management.
- **Blog Posts**: Users can create, edit, and delete blog posts.
- **Session Management**: Ability to invalidate a user’s token mid-session, logging them out immediately.

## Configuration

To configure the project, create a `.env` file in the root directory with the following environment variables:

```bash
DATABASE_URL=postgres://<username>:<password>@<host>:<port>/<database_name>
JWT_SECRET=<your_jwt_secret>
PORT=<port_to_run_server>

```
