import React from "react";
import { TextField, Button, Chip, Box, Typography } from "@mui/material";
import { Add, Clear } from "@mui/icons-material";
import { useLanguage, useTranslation } from "../contexts/LanguageContext";
import Alert from "@mui/material/Alert";

const IngredientInput = ({ input, setInput, ingredients, setIngredients }) => {
  const t = useTranslation();
  const { language } = useLanguage();
  const addIngredient = () => {
    if (input.trim() && !ingredients.includes(input.trim())) {
      setIngredients([...ingredients, input.trim()]);
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addIngredient();
    }
  };

  const removeIngredient = (item) => {
    setIngredients(ingredients.filter((i) => i !== item));
  };

  const clearAll = () => {
    setIngredients([]);
  };

  return (
    <Box>
      {/* Upozorenje za unos na engleskom */}
      {language === "sr" && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Sastojke unosite isključivo na engleskom jeziku (npr. tomato, egg,
          cheese).
        </Alert>
      )}
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: 600, color: "text.primary", mb: 3 }}
      >
        {t("addIngredients")}
      </Typography>

      <Box display="flex" gap={2} mb={3} alignItems="flex-start">
        <TextField
          label={t("ingredientPlaceholder")}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t("ingredientPlaceholder")}
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 10,
              "&:hover fieldset": {
                borderColor: "primary.main",
              },
            },
          }}
        />
        <Button
          variant="contained"
          onClick={addIngredient}
          disabled={!input.trim()}
          startIcon={<Add />}
          sx={{
            borderRadius: 10,
            px: 3,
            py: 1.5,
            minWidth: "120px",
            background: "linear-gradient(45deg, #10b981 30%, #34d399 90%)",
            "&:hover": {
              background: "linear-gradient(45deg, #059669 30%, #10b981 90%)",
            },
            "&:disabled": {
              background: "rgba(0,0,0,0.12)",
            },
          }}
        >
          {t("add")}
        </Button>
      </Box>

      {ingredients.length > 0 && (
        <Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="body2" color="text.secondary">
              {t("addedIngredients")} ({ingredients.length}):
            </Typography>
            <Button
              size="small"
              onClick={clearAll}
              startIcon={<Clear />}
              sx={{
                color: "error.main",
                "&:hover": {
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                },
              }}
            >
              {t("deleteAll")}
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              p: 2,
              backgroundColor: "rgba(16, 185, 129, 0.05)",
              borderRadius: 10,
              border: "1px solid rgba(16, 185, 129, 0.1)",
            }}
          >
            {ingredients.map((item) => (
              <Chip
                key={item}
                label={item}
                onDelete={() => removeIngredient(item)}
                color="success"
                variant="outlined"
                sx={{
                  fontWeight: 500,
                  "& .MuiChip-deleteIcon": {
                    color: "error.main",
                    "&:hover": {
                      color: "error.dark",
                    },
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default IngredientInput;
