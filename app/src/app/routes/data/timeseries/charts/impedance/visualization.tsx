// Hooks
import { useEffect, useRef, useState } from "react";

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

// Components
import { ImpedanceTooltip } from "../../helpers/tooltips";

// Types
import { RefObject } from "react";
import { NodeT } from "@/lib/types/warehouse";
import { ImpedanceDataT } from "@/lib/types/timeseries";

type Props = {
  sweeps: Array<number>;
  setSweeps: (sweeps: Array<number>) => void;
  timeseries: Array<ImpedanceDataT>;
};

export function Visualization(props: Props) {
  // Props
  const sweeps = props.sweeps;
  const setSweeps = props.setSweeps;

  // Subset to control the sweeps
  const [subset, setSubset] = useState<Array<ImpedanceDataT>>([]);

  // Store
  const type: string = useAppSelector((state) => state.warehouse.data!.type);
  const leaf: NodeT = useAppSelector((state) => state.warehouse.leaf!);

  // Chart ref for report generation
  const chartRef = useRef<RefObject<HTMLDivElement>>(null);

  useEffect(() => {
    if (props.timeseries.length) {
      const subset = props.timeseries.filter((record: ImpedanceDataT) =>
        props.sweeps.includes(record.metadata.sweep)
      );
      setSubset(subset);
    }
  }, [props.timeseries, props.sweeps, leaf]);

  // Handlers
  const handleOptionSelect = (interval: number) => {
    const existing = sweeps.filter((sweep) => sweep === interval);

    console.log(existing);
    if (existing.length === 0) {
      setSweeps([...sweeps, interval]);
    } else {
      if (sweeps.length === 1) return;
      setSweeps(sweeps.filter((sweep) => sweep !== interval));
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
        {subset.length ? (
          <div ref={chartRef as RefObject<HTMLDivElement | null>}>
            <ScatterChart
              id={"impedance-chart"}
              data={subset}
              width={730}
              height={250}
              margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <Legend verticalAlign="bottom" iconSize={10} />
              <XAxis
                dataKey={"data.real_impedance"}
                name="Z'"
                type="number"
                tick={{ fontSize: ".75rem", dy: 10 }}
                ticks={[0, 0.2, 0.4, 0.6, 0.8, 1]}
              >
                <Label
                  position={"centerBottom"}
                  dy={55}
                  value={"Real Impedance"}
                />
              </XAxis>
              <YAxis
                dataKey={"data.imaginary_impedance"}
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
              <Tooltip content={(props) => <ImpedanceTooltip {...props} />} />
              <Legend />
              {subset.filter((record) => record.metadata.sweep === 1).length ? (
                <Scatter
                  name="0 Hours"
                  data={subset.filter((record) => record.metadata.sweep === 1)}
                  fill="#FFFF00"
                />
              ) : null}
              {subset.filter((record) => record.metadata.sweep === 2).length ? (
                <Scatter
                  name="50 Hours"
                  data={subset.filter((record) => record.metadata.sweep === 2)}
                  fill="#FFD700"
                />
              ) : null}
              {subset.filter((record) => record.metadata.sweep === 3).length ? (
                <Scatter
                  name="100 Hours"
                  data={subset.filter((record) => record.metadata.sweep === 3)}
                  fill="#FFA500"
                />
              ) : null}
            </ScatterChart>
          </div>
        ) : null}
      </>
      <br />
      <div className="prose">
        <small>
          Select one or more measurement intervals to visualize impedance
        </small>
      </div>
      <details className="dropdown">
        <summary className="btn m-1">Click to Visualize Sweeps</summary>
        <ul className="menu dropdown-content bg-base-200 rounded-box z-[1] w-52 shadow">
          <li
            onClick={() => handleOptionSelect(1)}
            className={`p-2 ${
              sweeps.includes(1) ? "bg-base-100" : "bg-base-200"
            } bg-selected-unset`}
          >
            0 hours <input type="checkbox" className="hidden" value={1} />
          </li>
          <li
            onClick={() => handleOptionSelect(2)}
            className={`p-2 ${
              sweeps.includes(2) ? "bg-base-100" : "bg-base-200"
            }`}
          >
            50 hours <input type="checkbox" className="hidden" value={2} />
          </li>
          <li
            onClick={() => handleOptionSelect(3)}
            className={`p-2 ${
              sweeps.includes(3) ? "bg-base-100" : "bg-base-200"
            }`}
          >
            100 hours <input type="checkbox" className="hidden" value={3} />
          </li>
        </ul>
      </details>
    </>
  );
}
