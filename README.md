# Gourmet Craft API

A modern Express.js backend API for a cookbook website with recipe management, user authentication, ratings, and more.

## Features

- 🔐 User authentication (Register & Login with JWT)
- 📖 Recipe management (Create, Read, Update, Delete)
- 🔍 Search and filter recipes by cuisine, category, difficulty
- ⭐ Rating and review system
- ❤️ Favorite recipes
- 👤 User profiles with recipe collections
- 🛡️ Rate limiting and security middleware
- 📊 MongoDB database

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Validation:** validator.js
- **Rate Limiting:** express-rate-limit

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/akashsainaidu-ship-it/gourmet-craft-api.git
   cd gourmet-craft-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configuration (MongoDB URI, JWT secret, etc.)

5. Start the development server:
   ```bash
   npm run dev
   ```

The API will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile (requires auth)

### Recipes
- `GET /api/recipes` - Get all recipes with filters
- `GET /api/recipes/:id` - Get single recipe
- `POST /api/recipes` - Create recipe (requires auth)
- `PUT /api/recipes/:id` - Update recipe (requires auth, author only)
- `DELETE /api/recipes/:id` - Delete recipe (requires auth, author only)
- `POST /api/recipes/:id/rating` - Add/update recipe rating (requires auth)

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/me/profile` - Update user profile (requires auth)
- `POST /api/users/favorites/:recipeId` - Add recipe to favorites (requires auth)
- `DELETE /api/users/favorites/:recipeId` - Remove from favorites (requires auth)
- `GET /api/users/:id/favorites` - Get user's favorite recipes

### Health
- `GET /api/health` - Check API status

## Example Requests

### Register
```json
POST /api/auth/register
{
  "username": "foodlover",
  "email": "user@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

### Create Recipe
```json
POST /api/recipes
Headers: Authorization: Bearer <JWT_TOKEN>
{
  "title": "Spaghetti Carbonara",
  "description": "Classic Italian pasta",
  "cuisine": "Italian",
  "category": "Dinner",
  "servings": 4,
  "cookingTime": 20,
  "prepTime": 10,
  "difficulty": "Easy",
  "ingredients": [
    { "name": "Spaghetti", "quantity": 400, "unit": "g" },
    { "name": "Eggs", "quantity": 4, "unit": "pc" }
  ],
  "instructions": [
    { "step": 1, "description": "Cook spaghetti..." }
  ],
  "tags": ["pasta", "italian", "quick"]
}
```

## Environment Variables

See `.env.example` for all available configuration options.

## Development

Run in development mode with auto-reload:
```bash
npm run dev
```

Run tests:
```bash
npm test
```

## License

MIT
