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

type Props = {
  data: Array<any>;
  sweeps: Array<string>;
  setSweeps: Function;
};

export function Visualization(props: Props) {
  const [data, setData] = useState<Array<any>>([]);
  const sweeps = props.sweeps;
  const setSweeps = props.setSweeps;

  const type: { id: string; class: string } = useAppSelector(
    (state) => state.server.type!
  );
  const cell: { cell: string } = useAppSelector((state) => state.server.cell!);
  const chartRef = useRef<RefObject<HTMLElement | null>>(null);

  useEffect(() => {
    if (props.data.length) {
      let subset = props.data.filter((record: any) =>
        props.sweeps.includes(record.time.toString())
      );
      setData(subset);
    }
  }, [props.data, props.sweeps, cell]);

  // Handlers
  const handleOptionSelect = (time: string) => {
    const existing = sweeps.filter((sweep) => sweep === time);

    if (existing.length === 0) {
      setSweeps((sweeps: Array<string>) => [...sweeps, time]);
    } else {
      if (sweeps.length === 1) return;
      setSweeps((sweeps: Array<string>) =>
        sweeps.filter((sweep) => sweep !== time)
      );
    }
  };

  return (
    <>
      <div className="prose">
        <h2>Visualization</h2>
        <p>
          Visualize {type.class.split(" ")[0].toLowerCase()} data for{" "}
          {cell.cell}
        </p>
        <div className="divider w-3/4"></div>
      </div>
      <br />
      <>
        {data.length ? (
          <div ref={chartRef as RefObject<any>}>
            <ScatterChart
              id={"impedance-chart"}
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
                ticks={[0, 0.2, 0.4, 0.6, 0.8, 1]}
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
              <Tooltip content={(props) => <ImpedanceTooltip {...props} />} />
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
            onClick={() => handleOptionSelect("0")}
            className={`p-2 ${
              sweeps.includes("0") ? "bg-base-100" : "bg-base-200"
            } bg-selected-unset`}
          >
            0 hours <input type="checkbox" className="hidden" value="0" />
          </li>
          <li
            onClick={() => handleOptionSelect("50")}
            className={`p-2 ${
              sweeps.includes("50") ? "bg-base-100" : "bg-base-200"
            }`}
          >
            50 hours <input type="checkbox" className="hidden" value="50" />
          </li>
          <li
            onClick={() => handleOptionSelect("100")}
            className={`p-2 ${
              sweeps.includes("100") ? "bg-base-100" : "bg-base-200"
            }`}
          >
            100 hours <input type="checkbox" className="hidden" value="100" />
          </li>
        </ul>
      </details>
    </>
  );
}
