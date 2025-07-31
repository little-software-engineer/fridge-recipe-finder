import { createTheme } from '@mui/material/styles';

const getTheme = (mode = 'light') =>
    createTheme({
        palette: {
            mode,
            ...(mode === 'light'
                ? {
                    // Svetla tema
                    primary: { main: '#2563eb' },
                    secondary: { main: '#ec4899' },
                    background: { default: '#f8fafc', paper: '#fff' },
                    text: { primary: '#1e293b', secondary: '#64748b' },
                }
                : {
                    // Tamna tema
                    primary: { main: '#60a5fa' },
                    secondary: { main: '#f472b6' },
                    background: { default: '#18181b', paper: '#23232a' },
                    text: { primary: '#f3f4f6', secondary: '#a1a1aa' },
                }),
        },
        typography: {
            fontFamily: 'Inter, Roboto, Arial, sans-serif',
            h5: {
                fontWeight: 700,
            },
            h6: {
                fontWeight: 600,
            },
        },
        shape: {
            borderRadius: 12,
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: 8,
                    },
                },
            },
        },
    });

export default getTheme;
