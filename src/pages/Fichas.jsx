import {
  Box,
  Typography,
  useTheme,
  Fab,
  Card,
  CardContent,
  Modal,
  Button,
} from "@mui/material";
import { Plus } from "react-feather";
import { useNavigate } from "react-router-dom"; // Para redirecionar para outra página
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Importar Firestore

const Fichas = () => {
  const theme = useTheme(); // Acessa o tema definido
  const navigate = useNavigate(); // Hook para navegação
  const [fichas, setFichas] = useState([]); // Estado para armazenar as fichas
  const [selectedFicha, setSelectedFicha] = useState(null); // Estado para armazenar a ficha selecionada
  const [modalOpen, setModalOpen] = useState(false); // Estado para controlar o modal

  // Função para redirecionar para a página de criação de ficha
  const handleCreateFicha = () => {
    navigate("/criar-ficha"); // Redireciona para a página de criação de ficha
  };

  // Função para abrir o modal ao clicar no card
  const handleOpenModal = (ficha) => {
    setSelectedFicha(ficha);
    setModalOpen(true);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedFicha(null);
  };

  // Carrega as fichas do Firestore
  useEffect(() => {
    const fetchFichas = async () => {
      const querySnapshot = await getDocs(collection(db, "fichas"));
      const fichasData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFichas(fichasData);
    };
    fetchFichas();
  }, []);

  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: theme.palette.background.default, // Usa a cor de fundo do tema
        minHeight: "calc(100vh - 56px)", // Ajusta a altura, descontando a navbar
        overflowY: "auto", // Adiciona scroll dentro do Box se necessário
      }}
    >
      {/* Cabeçalho da página */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignContent: "center",
          marginBottom: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Fichas
        </Typography>
      </Box>

      {/* Exibe os cards de fichas */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {fichas.map((ficha) => (
          <Card
            key={ficha.id}
            sx={{
              width: "100%",
              padding: 2,
              backgroundColor: "#1f1f2e",
              cursor: "pointer",
            }}
            onClick={() => handleOpenModal(ficha)} // Abre o modal com a ficha selecionada
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {ficha.personagem.nome}
              </Typography>
              <Typography variant="body2">
                Classe: {ficha.personagem.classe}
              </Typography>
              <Typography variant="body2">
                Nível: {ficha.personagem.nivel}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Botão Flutuante para adicionar nova ficha */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 70, right: 16 }}
        onClick={handleCreateFicha} // Chama a função para redirecionar
      >
        <Plus />
      </Fab>

      {/* Modal para exibir ficha selecionada */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box
          sx={{
            backgroundColor: "#1f1f2e",
            padding: 3,
            borderRadius: 3,
            width: "100%",
            boxShadow: 24,
            margin: 1,
          }}
        >
          {selectedFicha && (
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", marginBottom: 2 }}
              >
                {selectedFicha.personagem.nome}
              </Typography>
              <Typography>Classe: {selectedFicha.personagem.classe}</Typography>
              <Typography>Nível: {selectedFicha.personagem.nivel}</Typography>
              <Typography>HP: {selectedFicha.hp}</Typography>
              <Typography>Mana: {selectedFicha.mana}</Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 }}
                onClick={() => navigate(`/ficha/${selectedFicha.id}`)} // Redireciona para a tela de visualização completa
              >
                Ver mais
              </Button>
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Fichas;
