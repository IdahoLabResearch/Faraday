// Hooks
import { useEffect, useState } from "react";

// Components
import { Visualization } from "./visualization";
import { DRT } from "./drt";

// Functions
import { FetchDRT } from "@/lib/client/faraday";

// Store
import { useAppSelector } from "@/lib/store/hooks";

// Types
import { NodeT } from "@/lib/types/warehouse";
import { ImpedanceDataT } from "@/lib/types/timeseries";
import { DistributionRelaxationT } from "@/lib/types/statistics";

export const Impedance = (props: { timeseries: Array<ImpedanceDataT> }) => {
  // Store
  const leaf: NodeT = useAppSelector((state) => state.warehouse.leaf!);

  // Hooks
  const [analytics, setAnalytics] = useState<
    Array<DistributionRelaxationT> | undefined
  >();
  const [sweeps, setSweeps] = useState<Array<number>>([1]);

  const handlePyDRT = () => {
    FetchDRT(props.timeseries, sweeps).then(
      (data: Array<DistributionRelaxationT>) => {
        setAnalytics(data);
      }
    );
  };

  useEffect(() => {
    setAnalytics(undefined);
  }, [leaf]);

  return (
    <div className="grid grid-cols-12 px-12 py-6">
      <div className="col-span-6">
        <Visualization
          timeseries={props.timeseries}
          sweeps={sweeps}
          setSweeps={setSweeps}
        />
      </div>
      <div className="col-span-6">
        <div className="prose">
          <h2>Analytics</h2>
          <p>Compute distribution relaxation times for {leaf.name}</p>
        </div>
        <div className="divider w-3/4"></div>
        <button onClick={handlePyDRT} className="btn btn-accent">
          Compute
        </button>
        <br />
        <br />
        {analytics ? <DRT data={analytics} sweeps={sweeps} /> : null}
      </div>
    </div>
  );
};
