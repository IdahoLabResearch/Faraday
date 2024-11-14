// MUI
import { Box, Container, Typography } from "@mui/material";

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

type Props = {
  data: Array<any>;
};

const CustomTooltip = (props: any) => {
  if (props.active && props.payload && props.payload.length) {
    const time = props.payload[0].payload.time;
    const dataKey = props.payload[0].dataKey;
    const value = props.payload[0].value;

    return (
      <div style={{ backgroundColor: "white", padding: "1rem" }}>
        <p>Time: {time} hours</p>
        <p>
          {dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}: {value} mA/m2
        </p>
      </div>
    );
  }

  return null;
};

export function PWM(props: Props) {
  const selectedType: EdgeResponseT = useAppSelector(
    (state) => state.deeplynx.selectedType!
  );
  const selectedCell: string = useAppSelector(
    (state) => state.deeplynx.selectedCell!
  );

  return (
    <Container sx={{ padding: "1.5rem" }}>
      <Typography variant="h4">{selectedCell}</Typography>

      <Typography variant="subtitle1">
        {selectedType.destination_metatype_name}
      </Typography>
      <br />
      <br />
      <Box sx={{ color: "black" }}>
        {props.data.length ? (
          <LineChart
            width={730}
            height={250}
            data={props.data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              domain={["auto", "auto"]}
              scale={"time"}
              tick={{ fontSize: ".75rem" }}
              type="number"
              tickFormatter={(value, index) => {
                return Math.ceil(value).toString();
              }}
              allowDataOverflow={true}
            />
            <YAxis
              domain={["auto", "auto"]}
              unit={"mA/m2"}
              tick={{ fontSize: ".75rem" }}
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
        ) : null}
      </Box>
    </Container>
  );
}
