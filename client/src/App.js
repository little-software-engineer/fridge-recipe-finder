import React, { useState } from 'react';
import { Container, Typography, Button, AppBar, Toolbar, Box, IconButton, Tooltip } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Brightness4, Brightness7 } from '@mui/icons-material';

import IngredientInput from './components/IngredientInput';
import RecipeList from './components/RecipeList';
import FavoriteList from './components/FavoriteList';
import axios from 'axios';
import LoginForm from './components/LoginForm';
import { useLanguage, useTranslation } from './contexts/LanguageContext';
import ButtonGroup from '@mui/material/ButtonGroup';

function Home({ user, token }) {
  const [input, setInput] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);

  const findRecipes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/recipes', {
        params: { ingredients: ingredients.join(',') }
      });
      setRecipes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Fridge Recipe Finder - Created by little-software-engineer
      </Typography>
      <IngredientInput
        input={input}
        setInput={setInput}
        ingredients={ingredients}
        setIngredients={setIngredients}
      />
      <Button variant="contained" onClick={findRecipes} sx={{ mt: 2, mb: 3 }}>
        Find Recipes
      </Button>
      <RecipeList recipes={recipes} user={user} token={token} />
    </Container>
  );
}

function App({ mode, setMode }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  const handleAuth = (jwt, userObj) => {
    setToken(jwt);
    setUser(userObj);
    localStorage.setItem('token', jwt);
    localStorage.setItem('user', JSON.stringify(userObj));
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const { language, changeLanguage } = useLanguage();
  const t = useTranslation();

  return (
    <Router>
      {/* Header */}
      <AppBar position="static" color="inherit" elevation={0}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 700, letterSpacing: 1, outline: 'none', boxShadow: 'none', transition: 'color 0.2s', '&:hover': { color: 'secondary.main' } }}
            component={Link}
            to="/"
            style={{ textDecoration: 'none', cursor: 'pointer' }}
            tabIndex={-1}
          >
            {t('appTitle')}
          </Typography>

          {/* Change language button */}
          <ButtonGroup
            variant="outlined"
            sx={{ mr: 2, borderRadius: 8, boxShadow: '0 2px 8px rgba(16,185,129,0.08)' }}
            size="small"
          >
            <Button
              onClick={() => changeLanguage('sr')}
              variant={language === 'sr' ? 'contained' : 'outlined'}
              sx={{ fontWeight: 600, borderRadius: 8 }}
            >
              {t('srpski')}
            </Button>
            <Button
              onClick={() => changeLanguage('en')}
              variant={language === 'en' ? 'contained' : 'outlined'}
              sx={{ fontWeight: 600, borderRadius: 8 }}
            >
              {t('english')}
            </Button>
          </ButtonGroup>

          <Tooltip title={mode === 'dark' ? t('lightMode') : t('darkMode')}>
            <IconButton
              sx={{ ml: 1 }}
              onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
              color="inherit"
            >
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>
          {user ? (
            <>
              <Button
                component={Link}
                to="/favorites"
                variant="contained"
                color="secondary"
                sx={{ borderRadius: 8, fontWeight: 600, px: 3, boxShadow: '0 2px 8px rgba(255,64,129,0.08)', ml: 2 }}
              >
                {t('myFavorites')}
              </Button>
              <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>{user.email}</Typography>
              <Button
                onClick={handleLogout}
                variant="outlined"
                color="secondary"
                sx={{ borderRadius: 8, fontWeight: 600, px: 3, ml: 1 }}
              >
                {t('logout')}
              </Button>
            </>
          ) : (
            <Button
              component={Link}
              to="/login"
              variant="contained"
              color="secondary"
              sx={{ borderRadius: 8, fontWeight: 600, px: 3, boxShadow: '0 2px 8px rgba(255,64,129,0.08)', ml: 2 }}
            >
              {t('login')}
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Page content */}
      <Box sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Home user={user} token={token} />} />
          <Route path="/favorites" element={<FavoriteList user={user} token={token} />} />
          <Route path="/login" element={<LoginForm onAuth={handleAuth} />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
