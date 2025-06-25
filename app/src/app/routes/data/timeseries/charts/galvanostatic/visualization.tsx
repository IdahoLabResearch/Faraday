// Hooks
import { useEffect, useRef, useState } from "react";

// Store
import { useAppSelector } from "@/lib/store/hooks";

// Types
import { RefObject } from "react";
import { NodeT } from "@/lib/types/warehouse";
import { GalvanostaticDataT } from "@/lib/types/timeseries";

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

// Styles
import { charts } from "../styles/styles";
import { GalvanostaticTooltip } from "../../helpers/tooltips";

const options = [
  "Heat Up",
  "On Load",
  "Production Ready",
  "Heat Down",
  "Hot Hold",
  "Load Ramp Up",
  "Trip",
  "Unknown",
];

type Props = {
  timeseries: Array<GalvanostaticDataT>;
};

export function Visualization(props: Props) {
  // Subset to control the state
  const [state, setState] = useState<Array<string>>(options);
  const [subset, setSubset] = useState<Array<GalvanostaticDataT>>([]);

  // Store
  const type: string = useAppSelector((state) => state.warehouse.data!.type);
  const leaf: NodeT = useAppSelector((state) => state.warehouse.leaf!);

  // Chart ref for report generation
  const chartRef = useRef<RefObject<HTMLDivElement>>(null);

  useEffect(() => {
    const selected = props.timeseries.filter((record: GalvanostaticDataT) => {
      return state.includes(record.data.state);
    });
    setSubset(selected);
  }, [props.timeseries, state]);

  // Handlers
  const handleOptionSelect = (selected: string) => {
    const existing = state.filter((state) => state === selected);
    if (existing.length === 0) {
      setState([...state, selected]);
    } else {
      if (state.length === 1) return;
      setState(state.filter((state) => state !== selected));
    }
  };

  return (
    <>
      <div className="prose">
        <h2>Visualization</h2>
        <p>
          Visualize {type.toLowerCase()} data for {leaf.name}
        </p>
        <div className="divider w-3/4"></div>
      </div>
      <br />
      <>
        {props.timeseries ? (
          <div ref={chartRef as RefObject<HTMLDivElement | null>}>
            <ScatterChart
              id={"galvanostatic-chart"}
              data={props.timeseries}
              width={730}
              height={250}
              margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={charts.grid} />
              <XAxis
                dataKey={"data.time"}
                stroke={charts.axis}
                domain={["dataMin", "dataMax"]}
                name="Time"
                type="number"
                tick={{ fontSize: ".75rem", dy: 10 }}
              >
                <Label
                  value={"Time"}
                  stroke={charts.label}
                  position={"centerBottom"}
                  dy={30}
                />
              </XAxis>
              <YAxis
                dataKey={"data.anonymized_current"}
                name="Normalized Current"
                stroke={charts.axis}
                type="number"
                tick={{ fontSize: ".75rem" }}
              >
                <Label
                  value="Normalized Current"
                  stroke={charts.label}
                  angle={-90}
                  position="left"
                  dy={-65}
                />
              </YAxis>
              <Tooltip
                content={(props) => <GalvanostaticTooltip {...props} />}
              />
              <Legend verticalAlign="top" align="right" iconSize={8} />
              {state.map((option: string) => {
                console.log(option);
                return (
                  <>
                    <Scatter
                      data={subset.filter(
                        (record: GalvanostaticDataT) =>
                          record.data.state === option
                      )}
                      fill="#FFD700"
                      isAnimationActive={false}
                    />
                  </>
                );
              })}
            </ScatterChart>
          </div>
        ) : null}
      </>
      <br />
      <div className="prose">
        <small>
          Select one or more measurement intervals to visualize galvanostatic
          data
        </small>
      </div>
      <details className="dropdown">
        <summary className="btn m-1">Click to Visualize State</summary>
        <ul className="menu dropdown-content bg-base-200 rounded-box w-52 z-auto shadow">
          {options.map((option: string) => {
            return (
              <li
                key={option}
                onClick={() => handleOptionSelect(option)}
                className={`p-2 ${
                  state.includes(option) ? "bg-base-100" : "bg-base-200"
                } bg-selected-unset`}
              >
                {option} <input type="checkbox" className="hidden" value={1} />
              </li>
            );
          })}
        </ul>
      </details>
    </>
  );
}
