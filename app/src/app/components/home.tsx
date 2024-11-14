"use client";

// Hooks
import { useEffect } from "react";

// MUI
import { Button, Container, Grid, Typography } from "@mui/material";

// Router
import { useRouter } from "next/navigation";

// Styles
import { styles } from "../theme/styles";

// Store
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { deeplynxActions } from "@/lib/store/features/deeplynx";

// Axios
import axios from "axios";

function Home() {
  const router = useRouter();

  // Store
  const storeDispatch = useAppDispatch();
  const token = useAppSelector((state) => state.deeplynx.token!);

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
  }, [storeDispatch, token]);

  return (
    <>
      <Container>
        <Grid container direction={"column"}>
          <Grid item xs={10} sx={{ minHeight: "25vh" }}>
            <Typography variant="h1" sx={styles.text}>
              Welcome to Faraday
            </Typography>
            <Typography variant="subtitle1">
              A high temperature electrolysis data explorer
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Button
              sx={{ color: "gold" }}
              onClick={() => {
                router.push("/container");
              }}
            >
              Get Started
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Home;
