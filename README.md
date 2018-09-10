# collab-dashboard-backend

This project hosts the API endpoints that collab-dashboard-v2 requires.

## Prerequisites
1. Collab
2. NodeJS

## Installation
1. [Install](https://github.com/collab-tools/collab/wiki/Set-Up-Developer-Environment) the Collab project
2. Type 'npm install' in the command line

## Usage
1. Keep the backend server running by typing 'npm start' in the command line
2. Open a new command line, and navigate to `collab-tools/collab-dashboard-frontend`
3. Type 'npm install' in `collab-tools/collab-dashboard-frontend` command line if you have not set up the [Collab Dashboard Frontend](https://github.com/collab-tools/collab-dashboard-frontend) project
4. Otherwise, type `npm run development` in `collab-tools/collab-dashboard-frontend` command line

## Create Admin User
```bash
# (Assuming your developer_key is set to 12341234 in config/local-dev.json)
$ curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d 'devKey=12341234&username=admin&password=veryverysecretpassword&name=admin&isAdmin=1' "http://localhost:3001/admin"
```