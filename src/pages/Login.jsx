import { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  useTheme,
  IconButton,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { Eye, EyeOff } from "react-feather";

const Login = () => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [firstLogin, setFirstLogin] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Controla a visibilidade da senha
  const [loading, setLoading] = useState(false); // Controla o estado de carregamento
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Inicia o carregamento
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setLoading(false); // Para o carregamento
      if (
        userCredential.user.metadata.creationTime ===
        userCredential.user.metadata.lastSignInTime
      ) {
        setFirstLogin(true);
      } else {
        navigate("/home");
      }
    } catch {
      setLoading(false); // Para o carregamento
      setSnackbarMessage("Erro ao fazer login.");
      setOpenSnackbar(true);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updatePassword(auth.currentUser, newPassword);
      setLoading(false);
      navigate("/home");
    } catch {
      setLoading(false);
      setSnackbarMessage("Erro ao mudar a senha.");
      setOpenSnackbar(true);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setLoading(false);
      setSnackbarMessage("Email de recuperação enviado.");
      setOpenSnackbar(true);
    } catch {
      setLoading(false);
      setSnackbarMessage("Erro ao enviar email de recuperação.");
      setOpenSnackbar(true);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Alterna a visibilidade da senha
  };

  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {firstLogin ? (
        <form onSubmit={handleChangePassword}>
          <Typography variant="h5" gutterBottom>
            Mudar Senha
          </Typography>
          <TextField
            label="Nova Senha"
            type={showPassword ? "text" : "password"}
            fullWidth
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ marginBottom: 3 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility}>
                    {showPassword ? <EyeOff /> : <Eye />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading} // Desabilita o botão enquanto carrega
            startIcon={loading ? <CircularProgress size={20} /> : null} // Spinner no botão
          >
            {loading ? "Carregando..." : "Mudar Senha"}
          </Button>
        </form>
      ) : forgotPassword ? (
        <form onSubmit={handleForgotPassword}>
          <Typography variant="h5" gutterBottom>
            Esqueci minha senha
          </Typography>
          <TextField
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ marginBottom: 3 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Carregando..." : "Enviar Email de Recuperação"}
          </Button>
          <Button
            onClick={() => setForgotPassword(false)}
            sx={{ marginTop: 2 }}
            fullWidth
          >
            Voltar ao Login
          </Button>
        </form>
      ) : (
        <form
          onSubmit={handleLogin}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" gutterBottom>
              Login
            </Typography>
            <TextField
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ marginBottom: 3 }}
            />
            <TextField
              label="Senha"
              type={showPassword ? "text" : "password"}
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ marginBottom: 1 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility}>
                      {showPassword ? <EyeOff /> : <Eye />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: 3,
              }}
            >
              <Typography
                onClick={() => setForgotPassword(true)}
                sx={{
                  cursor: "pointer",
                  color: theme.palette.text.secondary,
                  fontSize: "0.875rem",
                }}
              >
                Esqueci minha senha
              </Typography>
            </Box>
          </Box>
          <Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "" : "Entrar"}
            </Button>
          </Box>
        </form>
      )}

      {/* Snackbar para feedback do usuário */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Login;
