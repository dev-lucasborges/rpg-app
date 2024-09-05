import { useState } from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { Home, FileText, Package, Settings } from "react-feather";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState(location.pathname); // Define o valor inicial com base no caminho atual

  const handleNavigationChange = (event, newValue) => {
    setValue(newValue);
    navigate(newValue); // Navega para o caminho selecionado
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "secondary.main",
      }}
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={handleNavigationChange}
        sx={{ backgroundColor: "secondary.main" }}
      >
        <BottomNavigationAction
          value="/home"
          icon={<Home />}
          sx={{
            color: value === "/home" ? "primary.main" : "custom.iconInactive",
            backgroundColor:
              value === "/home" ? "custom.onAccent" : "transparent",
            borderRadius: "8px",
          }}
        />
        <BottomNavigationAction
          value="/fichas"
          icon={<FileText />}
          sx={{
            color: value === "/fichas" ? "primary.main" : "custom.iconInactive",
            backgroundColor:
              value === "/fichas" ? "custom.onAccent" : "transparent",
            borderRadius: "8px",
          }}
        />
        <BottomNavigationAction
          value="/items"
          icon={<Package />}
          sx={{
            color: value === "/items" ? "primary.main" : "custom.iconInactive",
            backgroundColor:
              value === "/items" ? "custom.onAccent" : "transparent",
            borderRadius: "8px",
          }}
        />
        <BottomNavigationAction
          value="/settings"
          icon={<Settings />}
          sx={{
            color:
              value === "/settings" ? "primary.main" : "custom.iconInactive",
            backgroundColor:
              value === "/settings" ? "custom.onAccent" : "transparent",
            borderRadius: "8px",
          }}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default Navbar;
