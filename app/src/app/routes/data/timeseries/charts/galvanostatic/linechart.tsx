// Hooks
import { useState } from "react";

// Recharts
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GalvanostaticTooltip } from "../../helpers/tooltips";

// Styles
import { charts } from "../styles/styles";

// Types
import { GalvanostaticDataT } from "@/lib/types/timeseries";

type PropsT = {
  timeseries: Array<GalvanostaticDataT>;
};
type BoundingBoxT = {
  data: Array<GalvanostaticDataT>;
  left: string;
  right: string;
  refAreaLeft: string | undefined;
  refAreaRight: string | undefined;
  top: string;
  bottom: string;
  top2: string;
  bottom2: string;
  animation: true;
};

export const CustomLineChart = (props: PropsT) => {
  const [state, setState] = useState<BoundingBoxT>({
    data: props.timeseries,
    left: "dataMin",
    right: "dataMax",
    refAreaLeft: "",
    refAreaRight: "",
    top: "dataMax",
    bottom: "dataMin",
    top2: "dataMax+1",
    bottom2: "dataMin-1",
    animation: true,
  });

  const zoom = () => {
    // Your zoom logic here
    // You can use the state and props to update the data and axis ranges
    setState({
      ...state,
      refAreaLeft: state.refAreaLeft,
      refAreaRight: state.refAreaRight,
      data: props.timeseries,
      left: "dataMin",
      right: "dataMax",
      top: "dataMax",
      bottom: "dataMin",
      top2: "dataMax+1",
      bottom2: "dataMin-1",
    });
  };

  return (
    <LineChart
      width={730}
      height={250}
      margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
      onMouseDown={(e) =>
        setState({
          ...state,
          refAreaLeft: e.activeLabel ? e.activeLabel : undefined,
        })
      }
      onMouseMove={(e) =>
        state.refAreaLeft &&
        setState({
          ...state,
          refAreaRight: e.activeLabel ? e.activeLabel : undefined,
        })
      }
      onMouseUp={zoom} // What goes here?
    >
      <CartesianGrid strokeDasharray="3 3" stroke={charts.grid} />
      <XAxis
        allowDataOverflow
        dataKey="data.time"
        stroke={charts.axis}
        domain={[state.left, state.right]}
        tick={{ fontSize: ".75rem" }}
        type="number"
      >
        <Label
          value={"Time"}
          stroke={charts.label}
          position={"centerBottom"}
          dy={25}
        />
      </XAxis>
      <YAxis
        allowDataOverflow
        unit={"mA"}
        dataKey="data.anonymized_current"
        stroke={charts.axis}
        type={"number"}
        domain={[state.bottom, state.top]}
        tick={{ fontSize: ".75rem" }}
        tickFormatter={(value) => {
          return value.toFixed(2).toString();
        }}
      >
        <Label
          value={"Current"}
          stroke={charts.label}
          angle={-90}
          position={"left"}
          dy={-65}
          dx={-5}
        />
      </YAxis>
      {/* <Tooltip content={(props) => <GalvanostaticTooltip {...props} />} /> */}
      <Legend verticalAlign="top" align="right" />
      <Line
        data={props.timeseries}
        type="monotone"
        name="Current"
        dot={false}
        dataKey="data.anonymized_current"
        stroke="palegoldenrod"
      />
      {state.refAreaLeft && state.refAreaRight ? (
        <ReferenceArea
          x1={state.refAreaLeft}
          x2={state.refAreaRight}
          strokeOpacity={0.3}
        />
      ) : null}
    </LineChart>
  );
};
