// Hooks
import { useEffect, useState } from "react";

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
  voltage: number;
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
      const subset = props.timeseries.filter(
        (record: PotentiostaticDataT) => record.metadata.voltage === voltage
      );
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
    <div>
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
          <option value={1.3}>1.3</option>
          <option value={1.7}>1.7</option>
        </select>
      </fieldset>
      <br />
      <br />
      <div>
        {data.length ? (
          <LineChart
            width={730}
            height={250}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="data.time"
              domain={["dataMin", "dataMax"]}
              tick={{ fontSize: ".75rem" }}
              ticks={ticks}
              type="number"
            />
            <YAxis
              unit={"mA"}
              type={"number"}
              domain={["auto", "auto"]}
              tick={{ fontSize: ".75rem" }}
              tickFormatter={(value) => {
                return value.toFixed(2).toString();
              }}
            />
            <Tooltip
              content={(props) => <PotentiostaticTooltip {...props} />}
            />
            <Legend />
            <Line
              data={data}
              type="monotone"
              name="Current Density"
              dot={false}
              dataKey="data.current_density"
              stroke="palegoldenrod"
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
          </LineChart>
        ) : (
          <div className="prose">
            <small>
              There is no {voltage}V data for {leaf.name}
            </small>
          </div>
        )}
      </div>
    </div>
  );
}
