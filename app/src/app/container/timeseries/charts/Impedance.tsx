// MUI
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Typography,
  Select,
} from "@mui/material";

// Recharts
import {
  CartesianGrid,
  Label,
  Legend,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Store
import { useAppSelector } from "@/lib/store/hooks";

// Types
import { EdgeResponseT } from "@/lib/types/graphql";
import { SelectChangeEvent } from "@mui/material";

type Props = {
  data: Array<any>;
};

// Hooks
import { useEffect, useState } from "react";

const CustomTooltip = (props: any) => {
  if (props.active && props.payload && props.payload.length) {
    const time = props.payload[0].payload.time;
    return (
      <>
        <div
          style={{ backgroundColor: "white", color: "black", padding: ".5rem" }}
        >
          <p>Time: {time} hours</p>
        </div>
        {props.payload.map((payload: any) => {
          return (
            <>
              <div
                style={{
                  backgroundColor: "white",
                  color: "black",
                  padding: ".5rem",
                }}
              >
                <p>
                  {payload.name}: {payload.value}
                </p>
              </div>
            </>
          );
        })}
      </>
    );
  }

  return null;
};

export function Impedance(props: Props) {
  const [data, setData] = useState<Array<any>>([]);
  const [times, setTimes] = useState<Array<string>>(["0"]);

  const selectedType: EdgeResponseT = useAppSelector(
    (state) => state.deeplynx.selectedType!
  );
  const selectedCell: string = useAppSelector(
    (state) => state.deeplynx.selectedCell!
  );

  useEffect(() => {
    if (props.data.length) {
      let subset = props.data.filter((record: any) =>
        times.includes(record.time.toString())
      );
      setData(subset);
    }
  }, [props.data, times, selectedCell]);

  // Handlers
  const handleTimes = (event: SelectChangeEvent<typeof times>) => {
    const {
      target: { value },
    } = event;
    setTimes(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <Container sx={{ padding: "1.5rem" }}>
      <Typography variant="h4">{selectedCell}</Typography>

      <Typography variant="subtitle1">
        {selectedType.destination_metatype_name}
      </Typography>
      <br />
      <br />
      <FormControl fullWidth>
        <InputLabel
          id="time"
          sx={{
            color: "white",
            "&.Mui-focused": {
              color: "white",
            },
          }}
        >
          Time
        </InputLabel>
        <Select
          labelId="time"
          id="time"
          multiple
          value={times}
          label="Time"
          onChange={handleTimes}
          sx={{
            width: "25%",
            color: "white",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "white",
            },
            "& .MuiSvgIcon-root": {
              color: "white",
            },
            "&:hover": {
              "&& fieldset": {
                border: `1px solid "white"`,
              },
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "white",
            },
          }}
        >
          <MenuItem value={"0"} sx={{ color: "white" }}>
            0 hours
          </MenuItem>
          <MenuItem value={"50"} sx={{ color: "white" }}>
            50 hours
          </MenuItem>
          <MenuItem value={"100"} sx={{ color: "white" }}>
            100 hours
          </MenuItem>
        </Select>
      </FormControl>
      <br />
      <br />
      <br />
      <Box>
        {data.length ? (
          <ScatterChart
            width={730}
            height={250}
            margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <Legend verticalAlign="bottom" iconSize={10} />
            <XAxis
              dataKey="real_impedance"
              name="Z'"
              type="number"
              tick={{ fontSize: ".75rem", dy: 10 }}
            >
              <Label
                position={"centerBottom"}
                dy={55}
                value={"Real Impedance"}
              />
            </XAxis>
            <YAxis
              dataKey="imaginary_impedance"
              name="Z''"
              type="number"
              tick={{ fontSize: ".75rem" }}
            >
              <Label
                value="Imaginary Impedance"
                angle={-90}
                position="left"
                dy={-65}
              />
            </YAxis>
            <Tooltip content={(props) => <CustomTooltip {...props} />} />
            <Legend />
            {data.filter((record) => record.time === 0).length ? (
              <Scatter
                name="0 Hours"
                data={data.filter((record) => record.time === 0)}
                fill="#FFFF00"
              />
            ) : null}
            {data.filter((record) => record.time === 50).length ? (
              <Scatter
                name="50 Hours"
                data={data.filter((record) => record.time === 50)}
                fill="#FFD700"
              />
            ) : null}
            {data.filter((record) => record.time === 100).length ? (
              <Scatter
                name="100 Hours"
                data={data.filter((record) => record.time === 100)}
                fill="#FFA500"
              />
            ) : null}
          </ScatterChart>
        ) : null}
      </Box>
    </Container>
  );
}
