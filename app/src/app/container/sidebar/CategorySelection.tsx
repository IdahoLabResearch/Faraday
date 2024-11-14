"use client";

// Hooks
import { useEffect } from "react";

// MUI
import {
  Box,
  Container,
  Divider,
  ListItemButton,
  ListItemText,
  Skeleton,
  Typography,
} from "@mui/material";

// Axios
import axios from "axios";

// Store
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { deeplynxActions } from "@/lib/store/features/deeplynx";

// Types
import { NodeResponseT } from "@/lib/types/graphql";

export default function DataSourceSelection() {
  // Hooks
  const categories: Array<NodeResponseT> = useAppSelector(
    (state) => state.deeplynx.categories!
  );
  const token: string = useAppSelector((state) => state.deeplynx.token!);
  const storeDispatch = useAppDispatch();

  useEffect(() => {
    async function get() {
      await axios
        .get(`/api/deeplynx/nodes/categories`, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        })
        .then((response) => {
          let categories: Array<NodeResponseT> = response.data;
          storeDispatch(deeplynxActions.categories(categories));
        });
    }

    if (token && !categories.length) {
      get();
    }
  }, [token]);

  const handleNodes = async (category: NodeResponseT) => {
    storeDispatch(deeplynxActions.selectedCategory(category));
    storeDispatch(deeplynxActions.step("Test Types"));
  };

  return (
    <>
      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4">Faraday Button Cells</Typography>
          <br />
          <Typography variant="h5">Categories</Typography>
          <br />
          <Typography variant="caption">
            Select a category to begin exploring data
          </Typography>
        </Box>
        <br />
        <Divider sx={{ backgroundColor: "white" }} />
        {categories.length ? (
          categories.map((category: NodeResponseT) => {
            return (
              <ListItemButton
                key={category.id}
                sx={{ boxShadow: 5, width: "100%" }}
                onClick={() => {
                  handleNodes(category);
                }}
              >
                <ListItemText primary={category.metatype_name} />
              </ListItemButton>
            );
          })
        ) : (
          <>
            <Skeleton width={"100%"} height={"100px"} />
            <Skeleton width={"100%"} height={"100px"} />
            <Skeleton width={"100%"} height={"100px"} />
          </>
        )}
      </Container>
    </>
  );
}
