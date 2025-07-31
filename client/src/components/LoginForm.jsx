import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLanguage, useTranslation } from "../contexts/LanguageContext";

const LoginForm = ({ onAuth }) => {
  const [mode, setMode] = useState("login"); // 'login' or 'register'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const url = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const res = await axios.post(
        url,
        { email, password },
        {
          headers: { "Accept-Language": language },
        }
      );
      setSuccess(mode === "login" ? t("successLogin") : t("successRegister"));
      setLoading(false);
      onAuth(res.data.token, res.data.user);
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || t("errorServer"));
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="70vh"
    >
      <Paper elevation={3} sx={{ p: 4, minWidth: 340 }}>
        <Typography variant="h5" fontWeight={700} mb={2} textAlign="center">
          {mode === "login" ? t("loginTitle") : t("signupTitle")}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label={t("email")}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label={t("password")}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mb: 2 }}
          >
            {loading
              ? t("wait")
              : mode === "login"
              ? t("login")
              : t("signupTitle")}
          </Button>
        </form>
        <Button
          variant="text"
          fullWidth
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError("");
            setSuccess("");
          }}
        >
          {mode === "login" ? t("dontHaveAccount") : t("haveAccount")}
        </Button>
      </Paper>
    </Box>
  );
};

export default LoginForm;
