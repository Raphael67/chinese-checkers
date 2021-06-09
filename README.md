# Development

## Database

Start mongodb container:
````
docker-compose -f docker-compose.dev.yml up -d
````

## Backend
Go to the `backend` folder.
Install dependencies:
````
yarn install --frozen-lockfile
````
Start the backend:
````
yarn start:dev
````

API documentation is accessible at:
`http://localhost:8080/api`

### configuration
````
// .env
CONSOLE_ENABLED=false // display board in the console
CONSOLE_TIMEOUT=1 // time in second to wait between moves when debug to console is active
````

## Frontend
Go to the `frontend` folder.
Install dependencies:
````
yarn install --frozen-lockfile
````
Start the frontend:
````
yarn start
````

Request to API are routed by the react development server according to the rule present in the `frontend/package.json`:
````
"proxy": "http://localhost:8080",
````