// Recharts
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Store
import { useAppSelector } from "@/lib/store/hooks";

// Styles
import { charts } from "../styles/styles";

// Components
import { PWMTooltip } from "../../helpers/tooltips";

// Types
import { NodeT } from "@/lib/types/warehouse";
import { PWMDataT } from "@/lib/types/timeseries";

type Props = {
  timeseries: Array<PWMDataT> | undefined;
};

export function Visualization(props: Props) {
  const type: string = useAppSelector((state) => state.warehouse.data!.type);
  const leaf: NodeT = useAppSelector((state) => state.warehouse.leaf!);

  return (
    <>
      <div className="prose">
        <h2>Visualization</h2>
        <p>
          Visualize {type} data for {leaf.name}
        </p>
        <div className="divider w-3/4"></div>
      </div>
      <br />
      {props.timeseries ? (
        <LineChart
          width={730}
          height={250}
          data={props.timeseries}
          margin={{ top: 5, right: 30, left: 45, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={charts.grid} />
          <XAxis
            dataKey="data.time"
            domain={["auto", "auto"]}
            stroke={charts.axis}
            scale={"time"}
            tick={{ fontSize: ".75rem" }}
            type="number"
            tickFormatter={(value) => {
              return Math.ceil(value).toString();
            }}
            allowDataOverflow={true}
          >
            <Label
              value={"Current Density"}
              stroke={charts.label}
              position={"centerBottom"}
              dy={30}
            />
          </XAxis>
          <YAxis
            domain={["auto", "auto"]}
            stroke={charts.axis}
            unit={"mA/m2"}
            tick={{ fontSize: ".75rem" }}
          >
            <Label
              value={"Current Density"}
              stroke={charts.label}
              angle={-90}
              position={"left"}
              dy={-50}
              dx={-25}
            />
          </YAxis>
          <Tooltip content={(props) => <PWMTooltip {...props} />} />
          <Legend verticalAlign="top" align="right" />
          <Line
            type="monotone"
            name="current density"
            dot={false}
            dataKey="data.current_density"
            stroke="palegoldenrod"
          />
        </LineChart>
      ) : (
        <div className="skeleton h-48 w-full"></div>
      )}
    </>
  );
}
