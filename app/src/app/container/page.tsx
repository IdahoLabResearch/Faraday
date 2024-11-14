"use client";

// MUI
import { Container } from "@mui/material";

// Store
import { useAppSelector } from "@/lib/store/hooks";

// Components
import { PWM } from "./timeseries/charts/PWM";
import { Impedance } from "./timeseries/charts/Impedance";
import { Potentiostatic } from "./timeseries/charts/Potentiostatic";

// Types
import { EdgeResponseT } from "@/lib/types/graphql";
import { useEffect, useState } from "react";

export default function Faraday({
  params: { id },
}: {
  params: { id: string };
}) {
  let [test, setTest] = useState<string>("");

  const selectedType: EdgeResponseT = useAppSelector(
    (state) => state.deeplynx.selectedType!
  );
  const selectedCell: string = useAppSelector(
    (state) => state.deeplynx.selectedCell!
  );
  const data: Array<any> = useAppSelector((state) => state.deeplynx!.data);

  useEffect(() => {
    if (selectedType) {
      setTest(selectedType.destination_metatype_name);
    }
  }, [selectedType, data]);

  return (
    <Container maxWidth={false} sx={{ height: "95vh" }}>
      {data && selectedCell ? (
        test === "Pulse Width Modulation Accelerated Stress Test" ? (
          <PWM data={data} />
        ) : test === "Impedance Test" ? (
          <Impedance data={data} />
        ) : test === "Potentiostatic Test" ? (
          <Potentiostatic data={data} />
        ) : null
      ) : null}
    </Container>
  );
}
