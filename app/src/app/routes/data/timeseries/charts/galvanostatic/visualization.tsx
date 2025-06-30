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

// Helpers
import { RenderDot } from "../../helpers/scatters";
import { GalvanostaticTooltip } from "../../helpers/tooltips";

// Styles
import { charts } from "../styles/styles";

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

const fill = [
  {
    state: "Heat Up",
    fill: "oklch(97% 0.014 254.604)",
  },
  {
    state: "On Load",
    fill: "oklch(95.1% 0.026 236.824)",
  },
  {
    state: "Production Ready",
    fill: "oklch(90.1% 0.058 230.902)",
  },
  {
    state: "Heat Down",
    fill: "oklch(82.8% 0.111 230.318)",
  },
  {
    state: "Hot Hold",
    fill: "oklch(74.6% 0.16 232.661)",
  },
  {
    state: "Load Ramp Up",
    fill: "oklch(68.5% 0.169 237.323)",
  },
  {
    state: "Trip",
    fill: "oklch(58.8% 0.158 241.966)",
  },
  {
    state: "Unknown",
    fill: "oklch(50% 0.134 242.749)",
  },
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
              id={"galvanostatic-current-chart"}
              width={1250}
              height={250}
              margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={charts.grid} />
              <XAxis
                dataKey={"data.time"}
                stroke={charts.axis}
                domain={["dataMin", "dataMax"]}
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
                stroke={charts.axis}
                type="number"
                tick={{ fontSize: ".75rem" }}
              >
                <Label
                  value="Anonymized Current"
                  stroke={charts.label}
                  angle={-90}
                  position="left"
                  dy={-65}
                />
              </YAxis>
              <Tooltip
                content={(props) => <GalvanostaticTooltip {...props} />}
              />
              <Legend
                layout="horizontal"
                align="center"
                iconSize={5}
                height={12}
                wrapperStyle={{ paddingTop: "2.25rem" }}
              />
              {state.map((option: string, index: number) => {
                const filteredSubset = subset.filter(
                  (record: GalvanostaticDataT) => {
                    return record.data.state === option;
                  }
                );
                return (
                  <Scatter
                    key={option}
                    name={option}
                    data={filteredSubset}
                    isAnimationActive={false}
                    // @ts-expect-error - TypeScript wants RenderDot to have props
                    shape={<RenderDot />}
                    fill={fill[index].fill}
                  />
                );
              })}
            </ScatterChart>
            <br />
            <ScatterChart
              id={"galvanostatic-voltage-chart"}
              data={subset}
              width={1250}
              height={250}
              margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={charts.grid} />
              <XAxis
                dataKey={"data.time"}
                stroke={charts.axis}
                domain={["dataMin", "dataMax"]}
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
                dataKey={"data.anonymized_voltage"}
                stroke={charts.axis}
                type="number"
                tick={{ fontSize: ".75rem" }}
              >
                <Label
                  value="Anonymized Voltage"
                  stroke={charts.label}
                  angle={-90}
                  position="left"
                  dy={-65}
                />
              </YAxis>
              <Tooltip
                content={(props) => <GalvanostaticTooltip {...props} />}
              />
              <Legend
                layout="horizontal"
                align="center"
                iconSize={5}
                height={12}
                wrapperStyle={{ paddingTop: "2.25rem" }}
              />
              {state.map((option: string, index: number) => {
                const filteredSubset = subset.filter(
                  (record: GalvanostaticDataT) => {
                    return record.data.state === option;
                  }
                );
                return (
                  <Scatter
                    key={option}
                    name={option}
                    data={filteredSubset}
                    isAnimationActive={false}
                    // @ts-expect-error - TypeScript wants RenderDot to have props
                    shape={<RenderDot />}
                    fill={fill[index].fill}
                  />
                );
              })}
            </ScatterChart>
          </div>
        ) : null}
      </>
      <br />
      <div className="prose">
        <small>Add or remove a test state from the galvanostatic data</small>
      </div>
      <details>
        <summary className="btn m-1">Click to Visualize States</summary>
        <ul className="menu dropdown-content bg-base-200 rounded-box w-52 z-auto shadow">
          {options.map((option: string) => {
            return (
              <div
                key={option}
                onClick={() => handleOptionSelect(option)}
                className={`p-2 ${
                  state.includes(option) ? "bg-base-100" : "bg-base-200"
                } bg-selected-unset flex flex-row z-auto`}
              >
                <>
                  {option}
                  <div className="grow" />
                  <input type="checkbox" className="hidden" value={1} />
                  {state.includes(option) ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="white"
                      className="size-4 bg-transparent"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                  ) : null}
                </>
              </div>
            );
          })}
        </ul>
      </details>
    </>
  );
}
