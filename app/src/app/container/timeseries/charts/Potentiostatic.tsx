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
  Legend,
  Line,
  LineChart,
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
                key={payload.value}
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

export function Potentiostatic(props: Props) {
  const [data, setData] = useState<Array<any>>([]);
  const [voltage, setVoltage] = useState<string>("1.3");

  const selectedType: EdgeResponseT = useAppSelector(
    (state) => state.deeplynx.selectedType!
  );
  const selectedCell: string = useAppSelector(
    (state) => state.deeplynx.selectedCell!
  );

  useEffect(() => {
    if (props.data.length) {
      let subset = props.data.filter(
        (record: any) => record.voltage === parseFloat(voltage)
      );
      setData(subset);
    }
  }, [props.data, voltage, selectedCell]);

  // Handlers
  const handleVoltage = (event: SelectChangeEvent) => {
    setVoltage(event.target.value);
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
          Voltage
        </InputLabel>
        <Select
          labelId="voltage"
          id="voltage"
          value={voltage}
          label="Voltage"
          onChange={handleVoltage}
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
          <MenuItem value={"1.3"} sx={{ color: "white" }}>
            1.3V
          </MenuItem>
          <MenuItem value={"1.7"} sx={{ color: "white" }}>
            1.7V
          </MenuItem>
        </Select>
      </FormControl>
      <br />
      <br />
      <br />
      <Box>
        {data.length ? (
          <LineChart
            width={730}
            height={250}
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              domain={["auto", "auto"]}
              tick={{ fontSize: ".75rem" }}
              type={"number"}
            />
            <YAxis
              unit={"mA"}
              type={"number"}
              domain={["auto", "auto"]}
              tick={{ fontSize: ".75rem" }}
              tickFormatter={(value, index) => {
                return value.toFixed(2).toString();
              }}
            />
            <Tooltip content={(props) => <CustomTooltip {...props} />} />
            <Legend />
            <Line
              type="monotone"
              dot={false}
              dataKey="current_density"
              stroke="gold"
            />
          </LineChart>
        ) : (
          <>
            There is no {voltage}V data for {selectedCell}
          </>
        )}
      </Box>
    </Container>
  );
}
