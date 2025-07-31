import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider, CssBaseline } from '@mui/material';
import getTheme from './theme';
import { LanguageProvider } from './contexts/LanguageContext';

const Root = () => {
  const [mode, setMode] = useState('light');
  return (
    <LanguageProvider>
      <ThemeProvider theme={getTheme(mode)}>
        <CssBaseline />
        <App mode={mode} setMode={setMode} />
      </ThemeProvider>
    </LanguageProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
