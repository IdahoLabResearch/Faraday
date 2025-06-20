// Hooks
import { useRef, useState } from "react";

// Store
import { useAppSelector } from "@/lib/store/hooks";

// Types
import { RefObject } from "react";
import { NodeT } from "@/lib/types/warehouse";
import { GalvanostaticDataT } from "@/lib/types/timeseries";

// Components
import { CustomLineChart } from "./linechart";

type Props = {
  state: Array<string>;
  setState: (state: Array<string>) => void;
  timeseries: Array<GalvanostaticDataT>;
};

export function Visualization(props: Props) {
  // Props
  const state = props.state;
  const setState = props.setState;

  // Subset to control the state
  const [subset, setSubset] = useState<Array<GalvanostaticDataT>>([]);

  // Store
  const type: string = useAppSelector((state) => state.warehouse.data!.type);
  const leaf: NodeT = useAppSelector((state) => state.warehouse.leaf!);

  // Chart ref for report generation
  const chartRef = useRef<RefObject<HTMLDivElement>>(null);

  // Handlers
  const handleOptionSelect = (select: string) => {
    const existing = state.filter((state) => state === select);
    if (existing.length === 0) {
      setState([...state, select]);
    } else {
      if (state.length === 1) return;
      setState(state.filter((state) => state !== select));
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
            <CustomLineChart timeseries={props.timeseries} />
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
          <li
            onClick={() => handleOptionSelect("On Load")}
            className={`p-2 ${
              state.includes("On Load") ? "bg-base-100" : "bg-base-200"
            } bg-selected-unset`}
          >
            On Load <input type="checkbox" className="hidden" value={1} />
          </li>
        </ul>
      </details>
    </>
  );
}
