"use client";

// Hooks
import { useEffect } from "react";

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
import { useAppDispatch } from "@/lib/store/hooks";
import { warehouseActions } from "@/lib/store/features/warehouse";

// Components
import { PWMTooltip } from "../../helpers/tooltips";

// Types
import { NodeT } from "@/lib/types/warehouse";
import { PWMDataT } from "@/lib/types/timeseries";

type Props = {
  timeseries: Array<PWMDataT> | undefined;
};

export function Visualization(props: Props) {
  const type: string = useAppSelector((state) => state.warehouse.data!.type);
  const leaf: NodeT = useAppSelector((state) => state.warehouse.leaf!);
  const storeDispatch = useAppDispatch();

  useEffect(() => {
    // TODO
    storeDispatch(warehouseActions.data(undefined));
  }, [leaf, storeDispatch]);

  return (
    <>
      <div className="prose">
        <h2>Visualization</h2>
        <p>
          Visualize {type} data for {leaf.name}
        </p>
        <div className="divider w-3/4"></div>
      </div>
      <br />
      <>
        {props.timeseries ? (
          <LineChart
            width={730}
            height={250}
            data={props.timeseries}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              domain={["auto", "auto"]}
              scale={"time"}
              tick={{ fontSize: ".75rem" }}
              type="number"
              tickFormatter={(value) => {
                return Math.ceil(value).toString();
              }}
              allowDataOverflow={true}
            />
            <YAxis
              domain={["auto", "auto"]}
              unit={"mA/m2"}
              tick={{ fontSize: ".75rem" }}
            />
            <Tooltip content={(props) => <PWMTooltip {...props} />} />
            <Legend />
            <Line
              type="monotone"
              dot={false}
              dataKey="current_density"
              stroke="palegoldenrod"
            />
          </LineChart>
        ) : (
          <div className="skeleton h-48 w-full"></div>
        )}
      </>
    </>
  );
}
