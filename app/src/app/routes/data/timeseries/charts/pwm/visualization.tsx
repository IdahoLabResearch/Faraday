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
import { serverActions } from "@/lib/store/features/server";

// Components
import { PWMTooltip } from "../../helpers/tooltips";

type Props = {
  data: Array<any> | undefined;
};

export function Visualization(props: Props) {
  const type: { id: string; class: string } = useAppSelector(
    (state) => state.server.type!
  );
  const cell: { cell: string } = useAppSelector((state) => state.server.cell!);
  const storeDispatch = useAppDispatch();

  useEffect(() => {
    // TODO
    storeDispatch(serverActions.data(undefined));
  }, [cell, storeDispatch]);

  return (
    <>
      <div className="prose">
        <h2>Visualization</h2>
        <p>
          Visualize {type.class.toLowerCase()} data for {cell.cell}
        </p>
        <div className="divider w-3/4"></div>
      </div>
      <br />
      <>
        {props.data ? (
          <LineChart
            width={730}
            height={250}
            data={props.data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              domain={["auto", "auto"]}
              scale={"time"}
              tick={{ fontSize: ".75rem" }}
              type="number"
              tickFormatter={(value, index) => {
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
