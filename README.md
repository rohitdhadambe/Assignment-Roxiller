# Store Rating Application

## What it is

A simple store rating app with:
- Node.js + Express backend
- PostgreSQL database
- React frontend
- JWT authentication
- Role-based access: Normal User, Store Owner, System Administrator

## Main features

- User signup and login
- Role-based dashboards
- Store rating submit/update
- Admin user management
- Protected frontend routes

## Project folders

- `Backend/`
  - `index.js` - starts the API server
  - `db.js` - PostgreSQL connection
  - `routes/` - API route handlers
  - `middleware/` - auth and role checks
  - `utils/` - helpers

- `Froentend/`
  - `src/App.js` - route setup
  - `src/api/axios.js` - API client
  - `src/context/AuthContext.js` - auth state
  - `src/components/` - shared UI
  - `src/pages/` - app pages

## Roles and access

- `Normal User`: signup, login, view stores, rate stores
- `Store Owner`: owner dashboard access
- `System Administrator`: user management and admin dashboard

## Backend setup

1. Go to `Backend/`
2. Run `npm install`
3. Add `.env` with:
   ```env
   PORT=5000
   DB_USER=your_db_user
   DB_HOST=localhost
   DB_NAME=your_db_name
   DB_PASSWORD=your_db_password
   DB_PORT=5432
   ```
4. Run `npm run dev`

## Frontend setup

1. Go to `Froentend/`
2. Run `npm install`
3. Run `npm start`

## API endpoints

- `POST /api/auth/signup` - user signup
- `POST /api/auth/login` - user login
- `GET /api/admin/users` - admin list users
- `POST /api/admin/users` - admin add user
- `POST /api/ratings` - submit or update rating

## Notes

- Frontend calls `http://localhost:5000/api`
- Auth token is stored in `localStorage`
- JWT secret is hardcoded now; move it to `.env` for production

## Run app

- Backend: `npm run dev` in `Backend/`
- Frontend: `npm start` in `Froentend/`
