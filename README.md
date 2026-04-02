#  Smart Recipe Finder

A full-stack web application built with **React (JavaScript)** on the frontend and **Python** with **SQLite** on the backend. Users can input ingredients and get smart recipe suggestions using the **Spoonacular API**. Each recipe includes a preview image, preparation time, basic info, and a link to full instructions. Registered users can also save their favorite recipes.

This application includes a clean and minimal UI with support for both **light and dark mode**, as well as the ability to switch languages between **English** and **Serbian**.

## Features

-  Ingredient-based recipe search using Spoonacular API
-  Light / Dark mode toggle
-  Language selection (English / Serbian)
-  User authentication (registration & login)
-  Favorite recipe saving (for logged-in users)
-  Responsive and professional user interface

## Tech Stack

- **Frontend:** React, JavaScript, CSS
- **Backend:** Python, SQLite
- **API:** Spoonacular API


## Getting Started

Make sure you have **Node.js**, **npm**, and **Python 3+** installed on your machine.

### 1. Clone the repository

```bash
git clone https://github.com/your-username/smart-recipe-finder.git
cd smart-recipe-finder
```
### 2. Start the backend (in the server directory) :

cd server
---
node app.js
---

### Start the frontend (in a new terminal window):
cd client
---
npm install
---
npm start
---

The frontend should now be running at: http://localhost:3000
API Key Setup
To use the Spoonacular API, you'll need to sign up at https://spoonacular.com/food-api and obtain a free API key. This key should be stored in your backend code or loaded from environment variables, depending on your setup.

Feel free to open issues or contribute to the project.
Made with love by little-software-engineer

