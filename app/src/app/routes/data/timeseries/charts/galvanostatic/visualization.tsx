// Hooks
import { useEffect, useRef, useState } from "react";

// Store
import { useAppSelector } from "@/lib/store/hooks";

// Types
import { RefObject } from "react";
import { NodeT } from "@/lib/types/warehouse";
import { GalvanostaticDataT } from "@/lib/types/timeseries";

// uPlot
import uPlot from "uplot";
import UplotReact from "uplot-react";
import "../styles/uPlot.min.css";

type Props = {
  state: Array<string>;
  setState: (state: Array<string>) => void;
  timeseries: Array<GalvanostaticDataT>;
};

const options: uPlot.Options = {
  title: "Electrolysis Stack Data",
  width: 400,
  height: 300,
  scales: {
    x: {
      time: false,
      range: [-0.5, 5.5],
    },
  },
  axes: [{}],
  series: [
    {
      points: {
        show: false,
        stroke: "yellow",
      },
    },
    {
      points: {
        show: true,
        stroke: "white",
      },
    },
  ],
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

  useEffect(() => {
    setSubset(props.timeseries);
    console.log(subset);
  }, [setSubset, subset, props.timeseries]);

  // useEffect(() => {
  //   if (props.timeseries.length) {
  //     const subset = props.timeseries.filter((record: GalvanostaticDataT) => {
  //       props.state.includes(record.data.state);
  //     });
  //     setSubset(subset);
  //   }
  // }, [props.timeseries, props.state, leaf]);

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
        {subset.length ? (
          <div ref={chartRef as RefObject<HTMLDivElement | null>}>
            <UplotReact
              options={options}
              data={[
                [0, 1, 2, 3],
                [0, 1, 2, 3],
              ]}
            />
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
