// Hooks
import { useEffect, useState } from "react";

// Recharts
import {
  CartesianGrid,
  ComposedChart,
  Dot,
  Label,
  Legend,
  Line,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Store
import { useAppSelector } from "@/lib/store/hooks";

// Styles
import { charts } from "../styles/styles";

// Components
import { PotentiostaticTooltip } from "../../helpers/tooltips";

// Types
import { NodeT } from "@/lib/types/warehouse";
import { PotentiostaticDataT } from "@/lib/types/timeseries";

type Props = {
  timeseries: Array<PotentiostaticDataT>;
  regression:
    | {
        fit: { time: number; regression: number }[];
        coefficients: number[];
      }
    | undefined;
  voltage: number | undefined;
  setVoltage: (voltage: number) => void;
};

export function Visualization(props: Props) {
  const [data, setData] = useState<Array<PotentiostaticDataT>>([]);
  const regression = props.regression;
  const voltage = props.voltage;
  const [ticks, setTicks] = useState<Array<number>>();

  const type: string = useAppSelector((state) => state.warehouse.data!.type);
  const leaf: NodeT = useAppSelector((state) => state.warehouse.leaf!);

  useEffect(() => {
    if (props.timeseries.length) {
      let subset = props.timeseries;
      if (voltage) {
        subset = props.timeseries.filter(
          (record: PotentiostaticDataT) => record.metadata.voltage === voltage
        );
      }

      setData(subset);

      const ticks = Array.from(
        new Set(
          subset.map((point: PotentiostaticDataT) => {
            const tick = Math.round(point.data.time);
            return tick % 25 === 0 ? tick : 0;
          })
        )
      );

      setTicks(ticks);
    }
  }, [props.timeseries, voltage]);

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
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Select a Voltage</legend>
        <select
          defaultValue={props.voltage}
          className="select"
          onChange={(event) => {
            props.setVoltage(parseFloat(event.target.value));
          }}
        >
          <option disabled>Voltage</option>
          <option value={undefined}>Any</option>
          <option value={1.3}>1.3</option>
          <option value={1.7}>1.7</option>
        </select>
      </fieldset>
      <br />
      <br />
      <div>
        {data.length ? (
          <ComposedChart
            width={730}
            height={250}
            margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={charts.grid} />
            <XAxis
              dataKey="data.time"
              stroke={charts.axis}
              domain={["dataMin", "dataMax"]}
              tick={{ fontSize: ".75rem" }}
              ticks={ticks}
              type="number"
            >
              <Label
                value={"Time"}
                stroke={charts.label}
                position={"centerBottom"}
                dy={25}
              />
            </XAxis>
            <YAxis
              unit={"mA"}
              stroke={charts.axis}
              type={"number"}
              domain={["auto", "auto"]}
              tick={{ fontSize: ".75rem" }}
              tickFormatter={(value) => {
                return value.toFixed(2).toString();
              }}
            >
              <Label
                value={"Current Density"}
                stroke={charts.label}
                angle={-90}
                position={"left"}
                dy={-65}
                dx={-5}
              />
            </YAxis>
            <Tooltip
              content={(props) => <PotentiostaticTooltip {...props} />}
            />
            <Legend verticalAlign="top" align="right" />
            <Scatter
              data={data}
              type="monotone"
              name="Current Density"
              dataKey="data.current_density"
              fill={"palegoldenrod"}
              shape={<Dot fill="palegoldenrod" r={1.5} />}
            />
            {regression ? (
              <Line
                data={regression.fit}
                type="monotone"
                name="Regression"
                dot={false}
                dataKey="data.regression"
                stroke="white"
              />
            ) : null}
          </ComposedChart>
        ) : (
          <div className="prose">
            <small>
              There is no {voltage}V data for {leaf.name}
            </small>
          </div>
        )}
      </div>
    </>
  );
}
