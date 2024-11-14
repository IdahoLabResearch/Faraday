"use client";

// Hooks
import { useState, useEffect } from "react";

// MUI
import { AppBar, Box, Button, Divider, Drawer, Toolbar } from "@mui/material";

// Icons
import MenuIcon from "@mui/icons-material/Menu";
import NavigateBefore from "@mui/icons-material/NavigateBefore";
import Footer from "../components/footer";

// Store
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { deeplynxActions } from "@/lib/store/features/deeplynx";

// Components
import CategorySelection from "./sidebar/CategorySelection";
import CellSelection from "./sidebar/CellSelection";

// Axios
import axios from "axios";
import TypeSelection from "./sidebar/TypeSelection";

export default function ContainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [drawer, setDrawer] = useState(true);

  const storeDispatch = useAppDispatch();
  const token = useAppSelector((state) => state.deeplynx.token);
  const step = useAppSelector((state) => state.deeplynx.step);

  // Handlers
  const handleDrawer = () => {
    setDrawer(!drawer);
  };
  const handleRestart = () => {
    storeDispatch(deeplynxActions.selectedCategory(undefined));
    storeDispatch(deeplynxActions.types([]));
    storeDispatch(deeplynxActions.batches([]));
    storeDispatch(deeplynxActions.cells([]));
    storeDispatch(deeplynxActions.step("Category Selection"));
  };

  // Retrieve a token
  useEffect(() => {
    const get = async () => {
      try {
        await axios.get("/api/deeplynx/oauth").then((response) => {
          const token = response.data;
          storeDispatch(deeplynxActions.token(token));
        });
      } catch {
        console.error("Failed to fetch DeepLynx auth token");
      }
    };

    if (!token) {
      get();
    }
  }, []);

  return (
    <Box className="bg-dark text-white">
      <AppBar
        position="sticky"
        sx={{
          color: "#FFD700",
          backgroundColor: "black",
          height: "5vh",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Toolbar>
          <Button onClick={() => handleDrawer()} sx={{ color: "#FFD700" }}>
            <MenuIcon />
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        open={drawer}
        onClose={handleDrawer}
        PaperProps={{
          sx: { width: "20vw" },
        }}
      >
        <AppBar
          position="sticky"
          sx={{
            color: "#FFD700",
            backgroundColor: "black",
            height: "5vh",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Toolbar>
            <Button onClick={() => handleDrawer()} sx={{ color: "#FFD700" }}>
              <MenuIcon />
            </Button>
          </Toolbar>
        </AppBar>
        <Button onClick={() => handleRestart()} sx={{ color: "white" }}>
          <NavigateBefore />
        </Button>
        {step === "Category Selection" ? (
          <CategorySelection />
        ) : step === "Test Types" ? (
          <TypeSelection />
        ) : step === "Cells" ? (
          <CellSelection />
        ) : null}
        <Box flexGrow={1}></Box>
        <Footer />
      </Drawer>
      {children}
    </Box>
  );
}
