// Hooks
import { useState } from "react";

// Components
import { Visualization } from "./visualization";

// Store
import { useAppSelector } from "@/lib/store/hooks";

// Types
import { NodeT } from "@/lib/types/warehouse";
import { GalvanostaticDataT } from "@/lib/types/timeseries";

export const Galvanostatic = (props: {
  timeseries: Array<GalvanostaticDataT>;
}) => {
  // Store
  const leaf: NodeT = useAppSelector((state) => state.warehouse.leaf!);

  // Hooks
  const [state, setState] = useState<Array<string>>([
    "Heat Up",
    "On Load",
    "Production Ready",
    "Heat Down",
    "Hot Hold",
    "Load Ramp Up",
    "Trip",
    "Unknown",
  ]);

  return (
    <div className="grid grid-cols-12 px-12 py-6">
      <div className="col-span-6">
        <Visualization
          timeseries={props.timeseries}
          state={state}
          setState={setState}
        />
      </div>
      <div className="col-span-6">
        <div className="prose">
          <h2>Analytics</h2>
          <p>Compute distribution relaxation times for {leaf.name}</p>
        </div>
        <div className="divider w-3/4"></div>
        <button className="btn btn-accent">Compute</button>
        <br />
        <br />
      </div>
    </div>
  );
};
