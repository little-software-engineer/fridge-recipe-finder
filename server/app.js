// server/app.js
// server/app.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const db = require('./db/knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ========== ROUTE: Spoonacular API call ==========
app.get('/api/recipes', async (req, res) => {
    const { ingredients } = req.query;

    if (!ingredients) {
        return res.status(400).json({ message: 'Ingredients query param is required' });
    }

    try {
        const response = await axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
            params: {
                ingredients: ingredients,
                number: 5,
                apiKey: process.env.SPOONACULAR_API_KEY
            }
        });
        const recipes = response.data;

        const detailedRecipes = await Promise.all(
            recipes.map(async (r) => {
                try {
                    const details = await axios.get(`https://api.spoonacular.com/recipes/${r.id}/information`, {
                        params: {
                            apiKey: process.env.SPOONACULAR_API_KEY,
                            includeNutrition: false
                        }
                    });
                    return {
                        ...r,
                        readyInMinutes: details.data.readyInMinutes,
                        vegan: details.data.vegan,
                        vegetarian: details.data.vegetarian,
                        glutenFree: details.data.glutenFree,
                        dairyFree: details.data.dairyFree,
                        dishTypes: details.data.dishTypes,
                        diets: details.data.diets
                    };
                } catch (e) {
                    return { ...r };
                }
            })
        );
        res.json(detailedRecipes);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ message: 'Error fetching recipes from Spoonacular.' });
    }
});

// ========== ROUTE: Adding ingredients ==========
app.post('/api/ingredients', async (req, res) => {
    const { name } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Ingredient name is required' });
    }

    try {
        const [id] = await db('ingredients').insert({ name: name.trim() });
        res.status(201).json({ id, name: name.trim() });
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
            res.status(409).json({ message: 'Ingredient already exists' });
        } else {
            console.error(err);
            res.status(500).json({ message: 'Database error' });
        }
    }
});


app.get('/api/ingredients', async (req, res) => {
    try {
        const allIngredients = await db('ingredients').select();
        res.json(allIngredients);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});


app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});

// ========== JWT AUTH MIDDLEWARE ==========
function authMiddleware(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Niste autorizovani' });
    }
    const token = auth.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Neispravan token' });
    }
}

// POST /api/favorites 
app.post('/api/favorites', authMiddleware, async (req, res) => {
    const { title, image, link } = req.body;
    const user_id = req.user.id;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    try {
        const [id] = await db('recipes').insert({ title, image, link, user_id });
        res.status(201).json({ id, title, image, link });
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
            return res.status(409).json({ message: 'Recipe already saved' });
        }
        console.error(err);
        res.status(500).json({ message: 'Error saving recipe' });
    }
});

// GET /api/favorites
app.get('/api/favorites', authMiddleware, async (req, res) => {
    const user_id = req.user.id;
    try {
        const favorites = await db('recipes').where({ user_id });
        res.json(favorites);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch favorites' });
    }
});

// DELETE /api/favorites/:id 
app.delete('/api/favorites/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    try {
        const deleted = await db('recipes').where({ id, user_id }).del();
        if (deleted) {
            res.json({ message: 'Recipe deleted' });
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting recipe' });
    }
});

// ========== AUTH: Registration ==========
app.post('/api/auth/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email i lozinka su obavezni' });
    }
    try {
        const existing = await db('users').where({ email }).first();
        if (existing) {
            return res.status(409).json({ message: 'Email je već registrovan' });
        }
        const password_hash = await bcrypt.hash(password, 10);
        const [id] = await db('users').insert({ email, password_hash });
        const token = jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id, email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška na serveru' });
    }
});

// ========== AUTH: Login ==========
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    const langHeader = req.headers['accept-language'] || '';
    const lang = langHeader.split(',')[0].split('-')[0] === 'en' ? 'en' : 'sr';
    if (!email || !password) {
        return res.status(400).json({ message: lang === 'en' ? 'Email and password are required' : 'Email i lozinka su obavezni' });
    }
    try {
        const user = await db('users').where({ email }).first();
        if (!user) {
            return res.status(401).json({ message: lang === 'en' ? 'Wrong email or password' : 'Pogrešan email ili lozinka' });
        }
        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
            return res.status(401).json({ message: lang === 'en' ? 'Wrong email or password' : 'Pogrešan email ili lozinka' });
        }
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, email: user.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: lang === 'en' ? 'Server error' : 'Greška na serveru' });
    }
});




