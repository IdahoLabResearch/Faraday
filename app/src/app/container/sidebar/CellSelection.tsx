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

export default function CellSelection() {
  // Hooks
  const cells: Array<{ cell: string }> = useAppSelector(
    (state) => state.deeplynx.cells!
  );
  const batches: Array<{ cell_batch: string }> = useAppSelector(
    (state) => state.deeplynx.batches!
  );
  const selectedBatch: string = useAppSelector(
    (state) => state.deeplynx.selectedBatch!
  );
  const selectedType: EdgeResponseT = useAppSelector(
    (state) => state.deeplynx.selectedType!
  );

  const storeDispatch = useAppDispatch();
  const token: string = useAppSelector((state) => state.deeplynx.token!);

  useEffect(() => {
    async function get() {
      await axios
        .get(`/api/deeplynx/nodes/batches`, {
          params: {
            nodeId: selectedType.destination_id,
            type: selectedType.destination_metatype_name,
          },
          headers: {
            Authorization: `bearer ${token}`,
          },
        })
        .then((response) => {
          const batches: Array<{ cell_batchL: string }> = response.data;
          storeDispatch(deeplynxActions.batches(batches));
        });
    }

    if (selectedType) {
      get();
    }
  }, [selectedType]);

  useEffect(() => {
    async function get() {
      await axios
        .get(`/api/deeplynx/nodes/cells`, {
          params: {
            type: selectedType.destination_metatype_name,
            nodeId: selectedType.destination_id,
            cellBatch: selectedBatch,
          },
          headers: {
            Authorization: `bearer ${token}`,
          },
        })
        .then((response) => {
          const cells: Array<EdgeResponseT> = response.data;
          storeDispatch(deeplynxActions.cells(cells));
        });
    }

    if (selectedBatch) {
      get();
    }
  }, [selectedBatch]);

  const handleCell = async (cell: string) => {
    storeDispatch(deeplynxActions.selectedCell(cell));
    await axios
      .get("/api/deeplynx/timeseries", {
        params: {
          nodeId: selectedType.destination_id,
          cellId: cell,
          cellBatch: selectedBatch,
          type: selectedType.destination_metatype_name,
        },
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((response) => {
        storeDispatch(deeplynxActions.data(response.data));
      });
  };

  const handleBatch = async (batch: string) => {
    storeDispatch(deeplynxActions.selectedBatch(batch));
    await axios
      .get(`/api/deeplynx/nodes/cells`, {
        params: {
          batch: batch,
          typeId: selectedType.destination_id,
        },
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((response) => {
        const cells: Array<EdgeResponseT> = response.data;
        storeDispatch(deeplynxActions.cells(cells));
      });
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
          <Typography variant="h5">Electrolysis Cells</Typography>
          <br />
          <Typography variant="caption">
            Select a cell batch whose cells performed{" "}
            {selectedType.destination_metatype_name}s
          </Typography>
        </Box>
        <br />
        <Divider sx={{ backgroundColor: "white" }} />
        {batches.length ? (
          batches.map((batch: { cell_batch: string }) => {
            return (
              <ListItemButton
                key={batch.cell_batch}
                sx={
                  selectedBatch
                    ? selectedBatch === batch.cell_batch
                      ? {
                          ...{
                            boxShadow: 5,
                            width: "100%",
                            backgroundColor: "gray",
                          },
                          ":hover": { backgroundColor: "gray" },
                        }
                      : { boxShadow: 5, width: "100%" }
                    : null
                }
                onClick={() => handleBatch(batch.cell_batch)}
              >
                <ListItemText primary={batch.cell_batch} />
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
        <br />
        <Divider sx={{ backgroundColor: "white" }} />
        <br />
        <Typography variant="caption">
          Select an electrolysis cell to visualize its performance
        </Typography>
        <br />
        {cells.length ? (
          cells.map((cell: { cell: string }) => {
            return (
              <ListItemButton
                key={cell.cell}
                sx={{ boxShadow: 5, width: "100%" }}
                onClick={() => handleCell(cell.cell)}
              >
                <ListItemText primary={cell.cell} />
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
