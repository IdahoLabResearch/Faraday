"use client";
// MUI
import { Box, Container, Typography } from "@mui/material";

const Footer = () => {
  return (
    <>
      <Box
        sx={{
          height: "7.5vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          component={"img"}
          src="INL-Logo_Left-White.png"
          sx={{
            height: "6vh",
            padding: ".5rem 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      </Box>
    </>
  );
};

export default Footer;
