# emoji-mood-tracker-api

## Description

The Emoji Mood Tracker API is a feature-rich RESTful service developed with Node.js and Express, providing users with the ability to log daily moods using emojis and accompanying notes. The API incorporates secure user authentication through JSON Web Tokens (JWT) and utilizes MongoDB as the underlying database for efficient data storage. This API offers an array of functionalities, including mood logging, retrieving summaries, updating/deleting entries, emoji statistics, sorting, filtering, sharing, data visualization, emoji suggestions, and a public mood board. It serves as a comprehensive tool for tracking and analyzing emotions, delivering valuable insights, and enhancing the user experience.

## Installation

1. Clone this repository to your local machine:

   ```bash
     git clone <repository-url>
     cd emoji-mood-tracker-api
   ```

2. Install the project dependencies using npm:

  ```bash
    npm install
  ```

3. Create a .env file in the project root and configure your environment variables. Here's an example:
  ```plaintext
  MONGO_DB_URL=your-mongodb-connection-uri
  ACCESS_TOKEN_SECRET=your-secret-key
  ```
  - MONGO_DB_URL: The MongoDB connection URI for your database.
  - ACCESS_TOKEN_SECRET: A secret key for JSON Web Token (JWT) authentication.

4. To start the server, run the following command:

  ```bash
    npm start
  ```


