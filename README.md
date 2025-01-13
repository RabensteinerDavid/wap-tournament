# WAP Tournament

## Backend Setup
First, you will need to create a mongodb database (Mongodb Atlas). 

Edit .env file
- SERVER_PORT: Which port should the server listen on
- DATABASE_CONNECTION_STRING: MongoDB Atlas Connection String
- DATABASE_NAME: Which database should be used
- JWT_SECRET: Token Generation Secret Key
- JWT_REFRESH_SECRET: Token Generation Secrect Key -> for refresh tokens

Start server with: `node index.js`

## Frontend

VITE_API_BASE_URL: Set the API-Base-URL. This should be something like: "http://localhost:3000/api/v1"

The frontend can be started with `npm run dev`
