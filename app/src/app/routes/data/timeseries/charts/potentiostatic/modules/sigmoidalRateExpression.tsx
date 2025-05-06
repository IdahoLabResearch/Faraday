// Hooks
import { useEffect, useState } from "react";

// Store
import { useAppSelector } from "@/lib/store/hooks";

// Functions
import { NoorSigmoidRegression } from "@/lib/client/faraday";
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";

// Types
import { PotentiostaticDataT } from "@/lib/types/timeseries";
import { NodeT } from "@/lib/types/warehouse";

type PropsT = {
  timeseries: Array<PotentiostaticDataT>;
};

export const SigmoidalRateExpressionModule = (props: PropsT) => {
  const timeseries = props.timeseries;
  const [ticks, setTicks] = useState<Array<number>>();
  const [sigmoid, setSigmoid] = useState<
    | {
        sre: Array<{ time: number; sigmoid_current_density: number }>;
        regression: Array<{ time: number; regression: number }>;
        coefficients: Array<number>;
      }
    | undefined
  >();
  const leaf: NodeT = useAppSelector((state) => state.warehouse.leaf!);

  useEffect(() => {
    if (sigmoid) {
      const ticks = Array.from(
        new Set(
          sigmoid.sre.map(
            (point: { time: number; sigmoid_current_density: number }) => {
              const tick = Math.round(point.time);
              return tick % 25 === 0 ? tick : 0;
            }
          )
        )
      );

      setTicks(ticks);
    }
  }, [sigmoid]);

  const handleSigmoid = async () => {
    const response = await NoorSigmoidRegression(leaf.name, timeseries);
    console.log(response);
    // setSigmoid(response);
  };

  return (
    <>
      <button className="btn w-48" onClick={() => handleSigmoid()}>
        Calculate
      </button>
      <br />
      <br />
      {sigmoid ? (
        <>
          <div className="prose">
            <h4>Sigmoidal Rate Expression</h4>
          </div>
          <br />
          <LineChart
            width={730}
            height={250}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              domain={["dataMin", "dataMax"]}
              tick={{ fontSize: ".75rem" }}
              ticks={ticks}
              type="number"
            />
            <YAxis
              unit={"mA"}
              type={"number"}
              domain={["auto", "auto"]}
              tick={{ fontSize: ".75rem" }}
              tickFormatter={(value) => {
                return value.toFixed(2).toString();
              }}
            />
            <Legend />
            <Line
              data={sigmoid.sre}
              type="monotone"
              name="Sigmoid Current Density"
              dot={false}
              dataKey="sigmoid_current_density"
              stroke="palegoldenrod"
            />
            {sigmoid.regression ? (
              <Line
                data={sigmoid.regression}
                type="monotone"
                name="Regression"
                dot={false}
                dataKey="regression"
                stroke="aliceblue"
              />
            ) : null}
          </LineChart>
          <br />
          <div className="prose">
            <h5>Coefficients</h5>
          </div>
          <div className="grid grid-rows-2 prose">
            <small>Slope: {sigmoid.coefficients[0].toExponential(2)}</small>
            <small>Intercept: {sigmoid.coefficients[1].toExponential(2)}</small>
          </div>
        </>
      ) : null}
    </>
  );
};
