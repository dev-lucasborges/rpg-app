import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase"; // Certifique-se de importar corretamente
import Login from "./pages/Login";
import Home from "./pages/Home";
import Fichas from "./pages/Fichas";
import Items from "./pages/Items";
import Settings from "./pages/Settings";
import Navbar from "./components/Navbar";
import CriarFicha from "./pages/CriarFicha";
import { CircularProgress, Box } from "@mui/material";
import VisualizarFicha from "./pages/VisualizarFicha";

function App() {
  const [user, setUser] = useState(null); // Estado para guardar o usuário autenticado
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento

  // Verifica o estado de autenticação ao carregar a aplicação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Atualiza o estado se o usuário estiver logado
      } else {
        setUser(null); // Define null se o usuário não estiver logado
      }
      setLoading(false); // Conclui o carregamento
    });

    return () => unsubscribe(); // Cancela o listener ao desmontar o componente
  }, []);

  // Renderiza um spinner de carregamento enquanto verifica a autenticação
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "background.default", // Certifique-se de usar a cor de fundo correta
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      <div style={{ paddingBottom: "56px" }}>
        {/* Espaço reservado para a navbar */}
        <Routes>
          {/* Redireciona para login se o usuário não estiver logado */}
          <Route path="/login" element={<Login />} />
          {user ? (
            <>
              <Route path="/home" element={<Home />} />
              <Route path="/fichas" element={<Fichas />} />
              <Route path="/items" element={<Items />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/criar-ficha" element={<CriarFicha />} />
              <Route path="/ficha/:id" element={<VisualizarFicha />} />
              <Route path="*" element={<Navigate to="/home" />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </div>
      {user && <Navbar />}{" "}
      {/* Exibe a navbar apenas se o usuário estiver logado */}
    </Router>
  );
}

export default App;
