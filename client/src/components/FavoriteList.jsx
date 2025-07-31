import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Container,
  Paper,
  Snackbar,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { ArrowBack, Delete, OpenInNew } from "@mui/icons-material";
import axios from "axios";
import { useLanguage, useTranslation } from "../contexts/LanguageContext";

const FavoriteList = ({ user, token }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { language } = useLanguage();
  const t = useTranslation();

  useEffect(() => {
    if (!user || !token) return;
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/favorites",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Accept-Language": language,
            },
          }
        );
        setFavorites(response.data);
      } catch (err) {
        console.error("Failed to load favorites:", err);
        setSnackbarMessage(t("errorLoadingFavorites"));
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [user, token, t, language]);

  const deleteFavorite = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/favorites/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": language,
        },
      });
      setFavorites((prev) => prev.filter((recipe) => recipe.id !== id));
      setSnackbarMessage(t("removedFromFavorites"));
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Failed to delete favorite:", err);
      setSnackbarMessage(t("errorDeletingFavorite"));
      setSnackbarOpen(true);
    }
  };

  if (!user || !token) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
          {t("mustBeLoggedIn")}
        </Typography>
        <Button component={RouterLink} to="/login" variant="contained">
          {t("login")}
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          background: "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
          color: "white",
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{ fontWeight: 800, textAlign: "center", mb: 2 }}
        >
          {t("myFavorites")}
        </Typography>
        <Typography variant="h6" sx={{ textAlign: "center", opacity: 0.9 }}>
          {t("savedRecipesYouLove")}
        </Typography>
      </Paper>

      <Button
        component={RouterLink}
        to="/"
        variant="outlined"
        startIcon={<ArrowBack />}
        sx={{
          mb: 4,
          borderRadius: 10,
          px: 3,
          py: 1.5,
          fontWeight: 600,
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2,
          },
        }}
      >
        {t("backToHome")}
      </Button>

      {loading ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            {t("loadingFavorites")}
          </Typography>
        </Box>
      ) : favorites.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            backgroundColor: "background.paper",
          }}
        >
          <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
            {t("noFavorites")}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {t("findAndSave")}
          </Typography>
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            sx={{
              borderRadius: 10,
              px: 4,
              py: 1.5,
              background: "linear-gradient(45deg, #2563eb 30%, #3b82f6 90%)",
              "&:hover": {
                background: "linear-gradient(45deg, #1d4ed8 30%, #2563eb 90%)",
              },
            }}
          >
            {t("findRecipesBtn")}
          </Button>
        </Paper>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {favorites.map((recipe) => (
            <Card
              key={recipe.id}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={recipe.image}
                alt={recipe.title}
                sx={{
                  objectFit: "cover",
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                }}
              />

              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    lineHeight: 1.3,
                    mb: 2,
                  }}
                >
                  {recipe.title}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    mt: "auto",
                    pt: 2,
                    borderTop: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <Button
                    component="a"
                    href={recipe.link}
                    target="_blank"
                    rel="noopener"
                    variant="outlined"
                    size="small"
                    startIcon={<OpenInNew />}
                    sx={{
                      flex: 1,
                      borderRadius: 8,
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    {t("viewFullRecipe")}
                  </Button>

                  <IconButton
                    onClick={() => deleteFavorite(recipe.id)}
                    color="error"
                    sx={{
                      borderRadius: 8,
                      backgroundColor: "rgba(239, 68, 68, 0.1)",
                      "&:hover": {
                        backgroundColor: "rgba(239, 68, 68, 0.2)",
                      },
                    }}
                    disabled={!user || !token}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Container>
  );
};

export default FavoriteList;
