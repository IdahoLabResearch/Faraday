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
import { TypeT, CellT } from "@/lib/types/warehouse";

type Props = {
  data: Array<any>;
  regression:
    | {
        regression: { time: number; regression: number }[];
        coefficients: number[];
      }
    | undefined;
  voltage: string;
  setVoltage: Function;
};

export function Visualization(props: Props) {
  const [data, setData] = useState<Array<any>>([]);
  const regression = props.regression;
  const voltage = props.voltage;
  const [ticks, setTicks] = useState<any>();

  const type: TypeT = useAppSelector((state) => state.warehouse.type!);
  const cell: CellT = useAppSelector((state) => state.warehouse.cell!);

  useEffect(() => {
    if (props.data.length) {
      const subset = props.data.filter(
        (record: any) => record.voltage === parseFloat(voltage)
      );
      setData(subset);

      const ticks = Array.from(
        new Set(
          subset.map(
            (point: {
              time: string;
              current_density: string;
              voltage: number;
            }) => {
              const tick = Math.round(parseFloat(point.time));
              return tick % 25 === 0 ? tick : 0;
            }
          )
        )
      );

      setTicks(ticks);
    }
  }, [props.data, voltage, cell]);

  return (
    <div>
      <div className="prose">
        <h2>Visualization</h2>
        <p>
          Visualize {type.name.split(" ")[0].toLowerCase()} data for {cell.name}
        </p>
        <div className="divider w-3/4"></div>
      </div>
      <br />
      <div className="label">
        <span className="label-text">Voltage</span>
      </div>
      <select
        defaultValue={props.voltage}
        onChange={(event) => {
          props.setVoltage(event.target.value);
        }}
        className="select select-bordered w-full max-w-xs"
      >
        <option disabled>Voltage</option>
        <option>1.3</option>
        <option>1.7</option>
      </select>
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
              dataKey="time"
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
              tickFormatter={(value, index) => {
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
              dataKey="current_density"
              stroke="palegoldenrod"
            />
            {regression ? (
              <Line
                data={regression.regression}
                type="monotone"
                name="Regression"
                dot={false}
                dataKey="regression"
                stroke="aliceblue"
              />
            ) : null}
          </LineChart>
        ) : (
          <div className="prose">
            <small>
              There is no {voltage}V data for {cell.name}
            </small>
          </div>
        )}
      </div>
    </div>
  );
}
