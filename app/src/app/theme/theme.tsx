"use client";

// Style
import { createTheme, ThemeProvider } from "@mui/material/styles";
import config from "../../../tailwind.config";

let theme = createTheme({
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: config.theme?.extend?.colors?.dark,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "white",
        },
      },
    },
  },
});

const Theme = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </>
  );
};

export default Theme;
