import { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  FormControl,
  Select,
  MenuItem,
  LinearProgress,
  Fab,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import { Save } from "react-feather";
import { useTheme } from "@mui/material/styles";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const CriarFicha = () => {
  const theme = useTheme();

  const [step, setStep] = useState(0); // Estado para o controle do passo
  const [personagem, setPersonagem] = useState({
    nome: "",
    classe: "",
    subClasse: "",
    nivel: "",
    hp: "",
    mana: "",
  });

  const [atributos, setAtributos] = useState({
    forca: "10",
    agilidade: "10",
    inteligencia: "10",
    carisma: "10",
    resistencia: "10",
    sabedoria: "10",
  });

  const [bonusProficiencia, setBonusProficiencia] = useState(2);
  const [informacoesPessoais, setInformacoesPessoais] = useState({
    idade: "",
    altura: "",
    peso: "",
    raca: "",
    pele: "",
    olhos: "",
    cabelo: "",
    idioma: "",
    deslocamento: "",
  });

  const [outros, setOutros] = useState({
    antecedente: "",
    tracoPersonalidade: "",
    ideal: "",
    vinculo: "",
    defeito: "",
  });

  const handleInputChange = (e, stateSetter) => {
    const { name, value } = e.target;
    stateSetter((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const calcularResistencias = () => {
    return {
      forca: Math.floor((atributos.forca - 10) / 2 + bonusProficiencia),
      agilidade: Math.floor((atributos.agilidade - 10) / 2 + bonusProficiencia),
      inteligencia: Math.floor(
        (atributos.inteligencia - 10) / 2 + bonusProficiencia
      ),
      carisma: Math.floor((atributos.carisma - 10) / 2 + bonusProficiencia),
      resistencia: Math.floor(
        (atributos.resistencia - 10) / 2 + bonusProficiencia
      ),
      sabedoria: Math.floor((atributos.sabedoria - 10) / 2 + bonusProficiencia),
    };
  };

  const calcularPericias = () => {
    return {
      acrobacia: Math.floor((atributos.agilidade - 10) / 2 + bonusProficiencia), // Agilidade
      arcanismo: Math.floor(
        (atributos.inteligencia - 10) / 2 + bonusProficiencia
      ), // Inteligência
      atletismo: Math.floor((atributos.forca - 10) / 2 + bonusProficiencia), // Força
      atuacao: Math.floor((atributos.carisma - 10) / 2 + bonusProficiencia), // Carisma
      enganacao: Math.floor((atributos.carisma - 10) / 2 + bonusProficiencia), // Carisma
      furtividade: Math.floor(
        (atributos.agilidade - 10) / 2 + bonusProficiencia
      ), // Agilidade
      historia: Math.floor(
        (atributos.inteligencia - 10) / 2 + bonusProficiencia
      ), // Inteligência
      intimidacao: Math.floor((atributos.carisma - 10) / 2 + bonusProficiencia), // Carisma
      intuicao: Math.floor((atributos.sabedoria - 10) / 2 + bonusProficiencia), // Sabedoria
      investigacao: Math.floor(
        (atributos.inteligencia - 10) / 2 + bonusProficiencia
      ), // Inteligência
      adestrarAnimais: Math.floor(
        (atributos.sabedoria - 10) / 2 + bonusProficiencia
      ), // Sabedoria
      medicina: Math.floor((atributos.sabedoria - 10) / 2 + bonusProficiencia), // Sabedoria
      natureza: Math.floor(
        (atributos.inteligencia - 10) / 2 + bonusProficiencia
      ), // Inteligência
      percepcao: Math.floor((atributos.sabedoria - 10) / 2 + bonusProficiencia), // Sabedoria
      persuacao: Math.floor((atributos.carisma - 10) / 2 + bonusProficiencia), // Carisma
      prestidigitacao: Math.floor(
        (atributos.agilidade - 10) / 2 + bonusProficiencia
      ), // Agilidade
      religiao: Math.floor(
        (atributos.inteligencia - 10) / 2 + bonusProficiencia
      ), // Inteligência
      sobrevivencia: Math.floor(
        (atributos.sabedoria - 10) / 2 + bonusProficiencia
      ), // Sabedoria
    };
  };

  // Função para calcular Pontos de Vida
  const calcularHP = () => {
    const nivel = personagem.nivel;
    const forca = Math.floor((atributos.forca - 10) / 2);
    const resistencia = Math.floor((atributos.resistencia - 10) / 2);

    if (nivel) {
      return 50 + forca + (4 + resistencia) * nivel - (4 + forca);
    } else {
      return 6 + resistencia;
    }
  };

  // Função para calcular Pontos de Mana
  const calcularMana = () => {
    const nivel = personagem.nivel;
    const inteligencia = Math.floor((atributos.inteligencia - 10) / 2);
    const sabedoria = Math.floor((atributos.sabedoria - 10) / 2);

    if (nivel) {
      return 30 + inteligencia + (4 + sabedoria) * nivel - (4 + inteligencia);
    } else {
      return 6 + sabedoria;
    }
  };

  const resistencias = calcularResistencias();
  const pericias = calcularPericias();
  const hp = calcularHP();
  const mana = calcularMana();

  // Funções para navegar entre os passos
  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => setStep((prevStep) => prevStep - 1);

  const saveFicha = async () => {
    try {
      const docRef = await addDoc(collection(db, "fichas"), {
        personagem,
        atributos,
        bonusProficiencia,
        informacoesPessoais,
        outros,
        resistencias,
        pericias,
        hp,
        mana,
        createdAt: new Date(), // Adiciona um timestamp para quando a ficha foi criada
      });
      console.log("Ficha adicionada com ID: ", docRef.id);
      // Você pode adicionar lógica para redirecionar o usuário ou exibir uma mensagem de sucesso
    } catch (e) {
      console.error("Erro ao adicionar ficha: ", e);
    }
  };

  // Função para exibir o conteúdo de acordo com o passo
  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" marginBottom={3}>
              Informações do Personagem
            </Typography>
            <TextField
              label="Nome"
              name="nome"
              fullWidth
              variant="outlined"
              value={personagem.nome}
              onChange={(e) => handleInputChange(e, setPersonagem)}
              sx={{ marginBottom: 2 }}
            />
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel id="classe-label">Classe</InputLabel>
              <Select
                labelId="classe-label"
                name="classe"
                value={personagem.classe}
                onChange={(e) => handleInputChange(e, setPersonagem)}
                label="Classe"
              >
                <MenuItem value="" disabled>
                  Selecione
                </MenuItem>
                <MenuItem value="Guerreiro">Guerreiro</MenuItem>
                <MenuItem value="Mago">Mago</MenuItem>
                <MenuItem value="Ladino">Ladino</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Nível"
              name="nivel"
              type="number"
              fullWidth
              variant="outlined"
              value={personagem.nivel}
              onChange={(e) => handleInputChange(e, setPersonagem)}
              sx={{ marginBottom: 2 }}
            />
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" marginBottom={3}>
              Atributos
            </Typography>
            {[
              "forca",
              "agilidade",
              "inteligencia",
              "carisma",
              "resistencia",
              "sabedoria",
            ].map((atributo) => (
              <TextField
                key={atributo}
                label={atributo.charAt(0).toUpperCase() + atributo.slice(1)}
                name={atributo}
                type="number"
                fullWidth
                variant="outlined"
                value={atributos[atributo]}
                onChange={(e) => handleInputChange(e, setAtributos)}
                sx={{ marginBottom: 2 }}
              />
            ))}
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" marginBottom={3}>
              Informações Pessoais e Bônus de Proficiência
            </Typography>
            <TextField
              label="Bônus de Proficiência"
              name="bonusProficiencia"
              type="number"
              fullWidth
              variant="outlined"
              value={bonusProficiencia}
              onChange={(e) => setBonusProficiencia(Number(e.target.value))}
              sx={{ marginBottom: 2 }}
            />
            {/* Informações Pessoais */}
            {[
              { name: "idade", type: "number" },
              { name: "altura", type: "number" },
              { name: "peso", type: "number" },
              { name: "raca", type: "text" },
              { name: "pele", type: "text" },
              { name: "olhos", type: "text" },
              { name: "cabelo", type: "text" },
              { name: "idioma", type: "text" },
              { name: "deslocamento", type: "text" },
            ].map((info) => (
              <TextField
                key={info.name}
                label={info.name.charAt(0).toUpperCase() + info.name.slice(1)}
                name={info.name}
                type={info.type}
                fullWidth
                variant="outlined"
                value={informacoesPessoais[info.name]}
                onChange={(e) => handleInputChange(e, setInformacoesPessoais)}
                sx={{ marginBottom: 2 }}
              />
            ))}
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" marginBottom={3}>
              Outros
            </Typography>
            {[
              { name: "antecedente", label: "Antecedente" },
              { name: "tracoPersonalidade", label: "Traço de Personalidade" },
              { name: "ideal", label: "Ideal" },
              { name: "vinculo", label: "Vínculo" },
              { name: "defeito", label: "Defeito" },
            ].map((outro) => (
              <TextField
                key={outro.name}
                label={outro.label}
                name={outro.name}
                fullWidth
                variant="outlined"
                value={outros[outro.name]}
                onChange={(e) => handleInputChange(e, setOutros)}
                sx={{ marginBottom: 2 }}
              />
            ))}
          </Box>
        );
      case 4:
        return (
          <Box>
            <Typography variant="h6" marginBottom={3}>
              Resultados
            </Typography>

            {/* Seção HP e Mana */}
            <Box
              sx={{
                marginBottom: 2,
                backgroundImage: "linear-gradient(140deg, #181B2A, #0C0E2C)",
                padding: 1,
                borderRadius: 3,
                border: "solid #21232A",
                borderWidth: 1,
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: "#C9CACD",
                  marginBottom: "7px",
                }}
              >
                HP E MANA
              </Typography>
              <TableContainer
                component={Paper}
                sx={{ backgroundColor: "transparent", boxShadow: "none" }}
              >
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ color: "#C9CACD" }}>HP:</TableCell>
                      <TableCell sx={{ color: "#C9CACD" }}>{hp}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ color: "#C9CACD" }}>Mana:</TableCell>
                      <TableCell sx={{ color: "#C9CACD" }}>{mana}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Seção Testes de Resistência */}
            <Box
              sx={{
                marginBottom: 2,
                backgroundImage: "linear-gradient(140deg, #181B2A, #0F2C3B)",
                padding: 1,
                borderRadius: 3,
                border: "solid #21232A",
                borderWidth: 1,
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: "#C9CACD",
                  marginBottom: "7px",
                }}
              >
                TESTES DE RESISTÊNCIA
              </Typography>
              <TableContainer
                component={Paper}
                sx={{ backgroundColor: "transparent", boxShadow: "none" }}
              >
                <Table>
                  <TableBody>
                    {Object.keys(resistencias).map((key) => (
                      <TableRow key={key}>
                        <TableCell sx={{ color: "#C9CACD" }}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </TableCell>
                        <TableCell sx={{ color: "#C9CACD" }}>
                          {resistencias[key]}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Seção Perícias */}
            <Box
              sx={{
                marginBottom: 2,
                backgroundImage: "linear-gradient(140deg, #181B2A, #291836)",
                padding: 1,
                borderRadius: 3,
                border: "solid #21232A",
                borderWidth: 1,
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: "#C9CACD",
                  marginBottom: "7px",
                }}
              >
                PERÍCIAS
              </Typography>
              <TableContainer
                component={Paper}
                sx={{ backgroundColor: "transparent", boxShadow: "none" }}
              >
                <Table>
                  <TableBody>
                    {Object.keys(pericias).map((key, index, arr) => (
                      <TableRow
                        key={key}
                        sx={{
                          borderBottom:
                            index === arr.length - 1
                              ? "1px solid red"
                              : "1px solid #C9CACD", // Oculta a borda inferior na última linha
                        }}
                      >
                        <TableCell
                          sx={{
                            color: "#C9CACD",
                            borderColor: "rgb(94 94 94 / 33%)",
                          }}
                        >
                          {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#C9CACD",
                            borderColor: "rgb(94 94 94 / 33%)",
                          }}
                        >
                          {pericias[key]}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: theme.palette.background.default,
        minHeight: "calc(100vh - 56px)",
        overflowY: "auto",
      }}
    >
      {/* Barra de progresso linear */}
      <LinearProgress
        variant="determinate"
        value={(step + 1) * 20} // Calcula o progresso com base no passo atual
        sx={{ marginBottom: 3 }}
      />

      {/* Renderiza o conteúdo da etapa atual */}
      {renderStepContent()}

      {/* Botões de navegação */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column-reverse",
          gap: 2,
          justifyContent: "space-between",
          marginTop: 3,
        }}
      >
        {step > 0 && (
          <Button variant="outlined" onClick={prevStep}>
            Voltar
          </Button>
        )}
        {step < 4 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={nextStep}
            sx={{ width: "100%" }}
          >
            Próximo
          </Button>
        ) : (
          <Fab
            color="primary"
            aria-label="save"
            sx={{ position: "fixed", bottom: 70, right: 16 }}
            onClick={saveFicha} // Chama a função para salvar no Firestore
          >
            <Save />
          </Fab>
        )}
      </Box>
    </Box>
  );
};

export default CriarFicha;
