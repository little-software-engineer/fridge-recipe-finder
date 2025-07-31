import React from "react";
import { Typography, Box, Button, Link } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLanguage, useTranslation } from "../contexts/LanguageContext";

const RecipeList = ({ recipes, user, token }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = useTranslation();
  const saveFavorite = async (recipe) => {
    if (!user || !token) {
      alert(t("mustBeLoggedToSave"));
      navigate("/login");
      return;
    }
    const slug = recipe.title.toLowerCase().replace(/ /g, "-");
    const link = `https://spoonacular.com/recipes/${slug}-${recipe.id}`;

    try {
      await axios.post(
        "http://localhost:5000/api/favorites",
        {
          title: recipe.title,
          image: recipe.image,
          link: link,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": language,
          },
        }
      );
      alert(t("savedToFavorites"));
    } catch (err) {
      console.error("Failed to save favorite:", err);
      alert(t("errorSavingFavorite"));
    }
  };

  return (
    <Box mt={4}>
      {recipes.map((recipe) => {
        const slug = recipe.title.toLowerCase().replace(/ /g, "-");
        const link = `https://spoonacular.com/recipes/${slug}-${recipe.id}`;

        return (
          <Box key={recipe.id} mb={4}>
            <Typography variant="h6">{recipe.title}</Typography>
            <img src={recipe.image} alt={recipe.title} width={200} />

            {/* New recipe data */}
            <Box mt={1} mb={1}>
              {typeof recipe.readyInMinutes === "number" && (
                <Typography variant="body2" color="text.secondary">
                  {t("readyIn")}: {recipe.readyInMinutes} min
                </Typography>
              )}
              <Box display="flex" flexWrap="wrap" gap={1} mt={0.5}>
                {recipe.vegan && (
                  <span
                    style={{
                      background: "#10b981",
                      color: "white",
                      borderRadius: 6,
                      padding: "2px 8px",
                      fontSize: 13,
                    }}
                  >
                    {t("vegan")}
                  </span>
                )}
                {recipe.vegetarian && (
                  <span
                    style={{
                      background: "#f59e42",
                      color: "white",
                      borderRadius: 6,
                      padding: "2px 8px",
                      fontSize: 13,
                    }}
                  >
                    {t("vegetarian")}
                  </span>
                )}
                {recipe.glutenFree && (
                  <span
                    style={{
                      background: "#6366f1",
                      color: "white",
                      borderRadius: 6,
                      padding: "2px 8px",
                      fontSize: 13,
                    }}
                  >
                    {t("glutenFree")}
                  </span>
                )}
                {recipe.dairyFree && (
                  <span
                    style={{
                      background: "#f43f5e",
                      color: "white",
                      borderRadius: 6,
                      padding: "2px 8px",
                      fontSize: 13,
                    }}
                  >
                    {t("dairyFree")}
                  </span>
                )}
                {Array.isArray(recipe.diets) &&
                  recipe.diets.map((diet) => (
                    <span
                      key={diet}
                      style={{
                        background: "#2563eb",
                        color: "white",
                        borderRadius: 6,
                        padding: "2px 8px",
                        fontSize: 13,
                      }}
                    >
                      {diet}
                    </span>
                  ))}
                {Array.isArray(recipe.dishTypes) &&
                  recipe.dishTypes.map((dish) => (
                    <span
                      key={dish}
                      style={{
                        background: "#64748b",
                        color: "white",
                        borderRadius: 6,
                        padding: "2px 8px",
                        fontSize: 13,
                      }}
                    >
                      {dish}
                    </span>
                  ))}
              </Box>
            </Box>

            <Box mt={1}>
              <Link
                href={link}
                target="_blank"
                rel="noopener"
                underline="hover"
              >
                {t("viewFullRecipe")}
              </Link>
            </Box>

            <Button
              variant="outlined"
              onClick={() => saveFavorite(recipe)}
              sx={{ mt: 1 }}
              disabled={!user || !token}
            >
              {t("saveToFavorites")}
            </Button>
          </Box>
        );
      })}
    </Box>
  );
};

export default RecipeList;
