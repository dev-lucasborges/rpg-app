import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // Importar Firestore
import { Box, Typography } from "@mui/material";

const VisualizarFicha = () => {
  const { id } = useParams(); // Obtém o ID da ficha da URL
  const [ficha, setFicha] = useState(null); // Estado para armazenar os detalhes da ficha

  // Carrega os dados da ficha do Firestore
  useEffect(() => {
    const fetchFicha = async () => {
      const fichaDoc = await getDoc(doc(db, "fichas", id));
      if (fichaDoc.exists()) {
        setFicha(fichaDoc.data());
      } else {
        console.log("Ficha não encontrada");
      }
    };
    fetchFicha();
  }, [id]);

  return (
    <Box sx={{ padding: 3 }}>
      {ficha ? (
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            {ficha.personagem.nome}
          </Typography>
          <Typography>Classe: {ficha.personagem.classe}</Typography>
          <Typography>Nível: {ficha.personagem.nivel}</Typography>
          <Typography>HP: {ficha.hp}</Typography>
          <Typography>Mana: {ficha.mana}</Typography>

          {/* Exibindo todos os dados da ficha de forma solta */}
          <Box
            sx={{
              overflowX: "auto",
              backgroundColor: "black",
              color: "green",
              marginTop: 2,
              padding: 2,
            }}
          >
            {Object.entries(ficha).map(([key, value]) => (
              <Typography key={key} sx={{ marginBottom: 1 }}>
                {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
                {typeof value === "object" ? JSON.stringify(value) : value}
              </Typography>
            ))}
          </Box>
          {/* Exiba outros detalhes da ficha aqui */}
        </Box>
      ) : (
        <Typography>Carregando ficha...</Typography>
      )}
    </Box>
  );
};

export default VisualizarFicha;
