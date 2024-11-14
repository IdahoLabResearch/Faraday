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
import { EdgeResponseT, NodeResponseT } from "@/lib/types/graphql";

export default function TypeSelection() {
  // Hooks
  const selectedCategory: NodeResponseT = useAppSelector(
    (state) => state.deeplynx.selectedCategory!
  );
  const root: EdgeResponseT = useAppSelector((state) => state.deeplynx.root!);
  const types: Array<EdgeResponseT> = useAppSelector(
    (state) => state.deeplynx.types!
  );

  const storeDispatch = useAppDispatch();
  const token: string = useAppSelector((state) => state.deeplynx.token!);

  useEffect(() => {
    async function get() {
      await axios
        .get(`/api/deeplynx/nodes/types`, {
          params: {
            originID: selectedCategory.id,
          },
          headers: {
            Authorization: `bearer ${token}`,
          },
        })
        .then((response) => {
          const edges: Array<EdgeResponseT> = response.data;
          storeDispatch(deeplynxActions.types(edges));
        });
    }

    if (selectedCategory) {
      get();
    }
  }, [selectedCategory]);

  const handleType = (type: EdgeResponseT) => {
    storeDispatch(deeplynxActions.selectedType(type));
    storeDispatch(deeplynxActions.step("Cells"));
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
          <Typography variant="h5">
            {selectedCategory.metatype_name}s
          </Typography>
          <br />
          <Typography variant="caption">
            {selectedCategory.metatype_name}s cataloged in DeepLynx
          </Typography>
        </Box>
        <br />
        <Divider sx={{ backgroundColor: "white" }} />
        {types.length ? (
          types.map((type: EdgeResponseT) => {
            return (
              <ListItemButton
                key={type.destination_id}
                sx={{ boxShadow: 5, width: "100%" }}
                onClick={() => handleType(type)}
              >
                <ListItemText primary={type.destination_metatype_name} />
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
