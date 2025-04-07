// Recharts
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Components
import { ImpedanceTooltip } from "../../helpers/tooltips";

// Types
type Props = {
  data: Array<any>;
  sweeps: Array<string>;
};

export function DRT(props: Props) {
  const data: Array<any> = props.data;

  if (!data.length) {
    return;
  }

  const sweeps: Array<string> = props.sweeps;
  const ticks = Array.from(
    new Set(
      data.map((point) => {
        return `1E${Math.ceil(Math.log10(point.tau))}`;
      })
    )
  );

  return (
    <>
      {sweeps.map((sweep: string, index: number) => {
        const subset = data.filter((point) => point.sweep === sweep);

        if (!subset.length) return;

        return (
          <>
            <LineChart
              key={sweep}
              width={715}
              height={235}
              margin={{ top: 5, right: 30, left: 20, bottom: 45 }}
              data={data.filter((point) => point.sweep === sweep)}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="tau"
                scale={"log"}
                ticks={ticks}
                allowDataOverflow={true}
                domain={["dataMin", "auto"]}
                name="tau"
                type="number"
                tick={{ fontSize: ".75rem", dy: 10 }}
                interval={"preserveStart"}
              >
                <Label position={"centerBottom"} dy={45} value={"tau"} />
              </XAxis>

              <YAxis
                dataKey="gamma"
                name="gamma"
                type="number"
                tick={{ fontSize: ".75rem" }}
              >
                <Label value="gamma" angle={-90} position="left" dy={-45} />
              </YAxis>
              <Tooltip content={(props) => <ImpedanceTooltip {...props} />} />
              <Legend verticalAlign="top" align="right" />
              {sweep === "0" ? (
                <Line
                  dataKey={"gamma"}
                  stroke={"#FFFF00"}
                  legendType="plainline"
                  label={"gamma"}
                  strokeWidth={3}
                  dot={false}
                />
              ) : null}
              {sweep === "50" ? (
                <Line
                  dataKey={"gamma"}
                  stroke={"#FFD700"}
                  legendType="plainline"
                  strokeWidth={3}
                  dot={false}
                />
              ) : null}
              {sweep === "100" ? (
                <Line
                  dataKey={"gamma"}
                  stroke={"#FFA500"}
                  legendType="plainline"
                  strokeWidth={3}
                  dot={false}
                />
              ) : null}
            </LineChart>
          </>
        );
      })}
    </>
  );
}
