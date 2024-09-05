import { useState } from "react";
import {
  TextField,
  Box,
  IconButton,
  Typography,
  Fab,
  Snackbar,
  useTheme,
  InputAdornment,
} from "@mui/material";
import { LogOut, Save, Eye, EyeOff } from "react-feather";
import { signOut, updateProfile, updatePassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // Certifique-se de importar seu arquivo firebase

const Settings = () => {
  const theme = useTheme(); // Acessa o tema definido
  const [displayName, setDisplayName] = useState(
    auth.currentUser?.displayName || ""
  );
  const [email] = useState(auth.currentUser?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Controla a visibilidade da senha
  const [openSnackbar, setOpenSnackbar] = useState(false); // Controle do Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Mensagem do Snackbar
  const [isModified, setIsModified] = useState(false); // Verifica se houve alteração nos inputs
  const navigate = useNavigate();

  // Função para deslogar o usuário
  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate("/login");
    });
  };

  // Função para mostrar Snackbar
  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  // Função para atualizar o nome de exibição
  const handleUpdateDisplayName = () => {
    if (displayName) {
      updateProfile(auth.currentUser, { displayName })
        .then(() => {
          showSnackbar("Nome de exibição atualizado com sucesso!");
        })
        .catch((error) => {
          console.error("Erro ao atualizar nome de exibição:", error);
          showSnackbar("Erro ao atualizar nome de exibição.");
        });
    }
  };

  // Função para mudar a senha (apenas se os campos forem idênticos)
  const handleChangePassword = () => {
    if (newPassword === confirmPassword) {
      updatePassword(auth.currentUser, newPassword)
        .then(() => {
          showSnackbar("Senha alterada com sucesso!");
          setNewPassword(""); // Limpa o campo de senha após sucesso
          setConfirmPassword("");
        })
        .catch((error) => {
          console.error("Erro ao alterar senha:", error);
          showSnackbar("Erro ao alterar senha.");
        });
    } else {
      showSnackbar("As senhas não coincidem.");
    }
  };

  // Verifica se houve alterações nos inputs
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setIsModified(true); // Ativa o botão de salvar quando houver alterações
  };

  // Alterna a visualização da senha
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Função para salvar todas as alterações
  const handleSave = () => {
    if (displayName !== auth.currentUser?.displayName) {
      handleUpdateDisplayName();
    }
    if (newPassword === confirmPassword && newPassword !== "") {
      handleChangePassword();
    } else if (newPassword !== confirmPassword) {
      showSnackbar("As senhas não coincidem.");
    }
    setIsModified(false); // Reseta o estado modificado após salvar
  };

  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: theme.palette.background.default, // Usa a cor de fundo do tema
        minHeight: "calc(100vh - 56px)", // Ajusta a altura, descontando a navbar
        overflowY: "auto", // Adiciona scroll dentro do Box se necessário
      }}
    >
      {/* Ícone de Logout no topo esquerdo */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignContent: "center",
          marginBottom: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Configurações
        </Typography>
        <IconButton color="primary" onClick={handleLogout}>
          <LogOut />
        </IconButton>
      </Box>

      {/* Email do usuário */}
      <Box
        sx={{
          marginBottom: 2,
          backgroundColor: "#2C3243",
          padding: 1,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="body1"
          sx={{ color: theme.palette.text.secondary }}
        >
          <span style={{ fontSize: "0.875rem" }}>Email:</span> {email}
        </Typography>
      </Box>

      {/* Campo para alterar o nome de exibição */}
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h6">Nome</Typography>
      </Box>

      <Box sx={{ marginBottom: 3 }}>
        <TextField
          label="Nome de Exibição"
          variant="outlined"
          fullWidth
          value={displayName}
          onChange={handleInputChange(setDisplayName)}
        />
      </Box>

      {/* Campo para alterar a senha */}
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h6">Senha</Typography>
      </Box>

      <Box sx={{ marginBottom: 3 }}>
        <TextField
          label="Nova senha"
          variant="outlined"
          fullWidth
          type={showPassword ? "text" : "password"} // Alterna entre texto e password
          value={newPassword}
          onChange={handleInputChange(setNewPassword)}
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
      </Box>

      <Box sx={{ marginBottom: 3 }}>
        <TextField
          label="Confirme sua nova senha"
          variant="outlined"
          fullWidth
          type={showPassword ? "text" : "password"} // Alterna entre texto e password
          value={confirmPassword}
          onChange={handleInputChange(setConfirmPassword)}
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
      </Box>

      {/* Botão flutuante de salvar (aparece apenas quando houver alterações) */}
      {isModified && (
        <Fab
          color="primary"
          aria-label="save"
          onClick={handleSave}
          sx={{ position: "fixed", bottom: 70, right: 16 }}
        >
          <Save />
        </Fab>
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

export default Settings;
