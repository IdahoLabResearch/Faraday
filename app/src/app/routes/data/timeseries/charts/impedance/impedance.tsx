// Hooks
import { useEffect, useState } from "react";

// Components
import { Visualization } from "./visualization";
import { DRT } from "./drt";

// Functions
import { FetchDRT } from "@/lib/api/server";

// Store
import { useAppSelector } from "@/lib/store/hooks";

type Props = {
  data: Array<any>;
};

export function Impedance(props: Props) {
  const [data, setData] = useState<Array<any>>([]);
  const [analytics, setAnalytics] = useState<Array<any> | undefined>();
  const [sweeps, setSweeps] = useState<Array<string>>(["0"]);

  const cell: { cell: string } = useAppSelector((state) => state.server.cell!);

  useEffect(() => {
    if (props.data.length) {
      // Filter impedance data for just the selected cell
      let subset = props.data.filter((record: any) =>
        sweeps.includes(record.time.toString())
      );
      setData(subset);
    }
  }, [props.data, sweeps, cell]);

  const handlePyDRT = () => {
    FetchDRT(data, sweeps).then((data) => {
      setAnalytics(data);
    });
  };

  useEffect(() => {
    setAnalytics(undefined);
  }, [cell]);

  return (
    <div className="grid grid-cols-12 px-12 py-6">
      <div className="col-span-6">
        <Visualization data={data} sweeps={sweeps} setSweeps={setSweeps} />
      </div>
      <div className="col-span-6">
        <div className="prose">
          <h2>Analytics</h2>
          <p>Compute distribution relaxation times for {cell.cell}</p>
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
}
