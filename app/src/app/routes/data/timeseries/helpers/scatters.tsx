// Recharts
import { Dot, DotProps } from "recharts";

// Types
import { GalvanostaticDataT } from "@/lib/types/timeseries";

export const RenderDot: React.FC<DotProps & GalvanostaticDataT> = (props) => {
  if (props.data.state === "Heat Up")
    return (
      <Dot
        cx={props.cx}
        cy={props.cy}
        fill="oklch(97% 0.014 254.604)"
        r={3.5}
      />
    );
  if (props.data.state === "On Load")
    return (
      <Dot
        cx={props.cx}
        cy={props.cy}
        fill="oklch(95.1% 0.026 236.824)"
        r={3.5}
      />
    );
  if (props.data.state === "Production Ready")
    return (
      <Dot
        cx={props.cx}
        cy={props.cy}
        fill="oklch(90.1% 0.058 230.902)"
        r={3.5}
      />
    );
  if (props.data.state === "Heat Down")
    return (
      <Dot
        cx={props.cx}
        cy={props.cy}
        fill="oklch(82.8% 0.111 230.318)"
        r={3.5}
      />
    );
  if (props.data.state === "Hot Hold")
    return (
      <Dot
        cx={props.cx}
        cy={props.cy}
        fill="oklch(74.6% 0.16 232.661)"
        r={3.5}
      />
    );
  if (props.data.state === "Load Ramp Up")
    return (
      <Dot
        cx={props.cx}
        cy={props.cy}
        fill="oklch(68.5% 0.169 237.323)"
        r={3.5}
      />
    );
  if (props.data.state === "Trip")
    return (
      <Dot
        cx={props.cx}
        cy={props.cy}
        fill="oklch(58.8% 0.158 241.966)"
        r={3.5}
      />
    );
  if (props.data.state === "Unknown")
    return (
      <Dot
        cx={props.cx}
        cy={props.cy}
        fill="oklch(50% 0.134 242.749)"
        r={3.5}
      />
    );
};
