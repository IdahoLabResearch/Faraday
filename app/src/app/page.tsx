"use client";

// MUI
import { Grid } from "@mui/material";

// Styling
import Theme from "./theme/theme";
import "./globals.css";

// Components
import Header from "./components/header";
import Home from "./components/home";

function Landing() {
  return (
    <>
      <Theme>
        <Grid container direction={"column"}>
          <Grid item xs={10} sx={{ minHeight: "25vh", color: "white" }}>
            <Header />
          </Grid>
          <Grid item xs={2} sx={{ minHeight: "65vh" }}>
            <Home />
          </Grid>
        </Grid>
      </Theme>
    </>
  );
}

export default Landing;
