// Hooks
import { useEffect, useState } from "react";

// Store
import { useAppSelector } from "@/lib/store/hooks";

// Functions
import { NoorSigmoidRegression } from "@/lib/client/faraday";
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts";

// Types
import { PotentiostaticDataT } from "@/lib/types/timeseries";
import {
  SigmoidalRateExpressionI,
  SigmoidRegressionI,
} from "@/lib/types/statistics";
import { NodeT } from "@/lib/types/warehouse";

// Styles
import { charts } from "../../styles";

// Data
import { sigmoid_data } from "./sigmoid";

type PropsT = {
  timeseries: Array<PotentiostaticDataT>;
};

function zip(
  x: Array<number>,
  y: Array<number>
): Array<{ time: number; value: number }> {
  if (x.length !== y.length) {
    throw new Error("Input arrays must be of the same length");
  }

  return x.map((time, index) => ({ time, value: y[index] }));
}

export const SigmoidalRateExpressionModule = (props: PropsT) => {
  const timeseries = props.timeseries;
  const [ticks, setTicks] = useState<Array<number>>();

  // Sigmoid Data
  const [sigmoid, setSigmoid] = useState<SigmoidalRateExpressionI | undefined>(
    sigmoid_data
  );
  // Sigmoid Metadata
  const [regression, setRegression] = useState<
    | Array<{
        time: number;
        value: number;
      }>
    | undefined
  >();
  const [mechanisms, setMechanisms] = useState<
    Array<Array<number>> | undefined
  >();

  const leaf: NodeT = useAppSelector((state) => state.warehouse.leaf!);

  useEffect(() => {
    if (sigmoid) {
      const data: SigmoidRegressionI | undefined =
        sigmoid.data.results_data.find((n) => {
          return n.n_mechanisms == sigmoid.descriptors.best_mechanisms;
        });

      if (data) {
        const ticks = Array.from(
          new Set(
            data.downsampled_data.t_data_fit.map((time: number) => {
              const tick = Math.round(time);
              return tick % 25 === 0 ? tick : 0;
            })
          )
        );

        const regression: Array<{ time: number; value: number }> = zip(
          data.downsampled_data.t_data_fit,
          data.downsampled_data.life_metric_data_fit
        );

        setTicks(ticks);
        setRegression(regression);
        setMechanisms(data.mechanisms);
        console.log(data);
      }
    }
  }, [sigmoid]);

  const handleSigmoid = async () => {
    const response: SigmoidalRateExpressionI = await NoorSigmoidRegression(
      leaf.name,
      timeseries
    );
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
      {regression ? (
        <>
          <div className="prose">
            <h4>Sigmoidal Rate Expression</h4>
          </div>
          <br />
          <ScatterChart
            width={730}
            height={250}
            margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={charts.grid} />
            <XAxis
              dataKey="time"
              domain={["dataMin", "dataMax"]}
              tick={{ fontSize: ".75rem" }}
              ticks={ticks}
              stroke={charts.axis}
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
              unit={"mA"}
              domain={["auto", "auto"]}
              tick={{ fontSize: ".75rem" }}
              tickFormatter={(value) => {
                return value.toFixed(2).toString();
              }}
              stroke={charts.axis}
              type={"number"}
            >
              <Label
                value={"Life Metric"}
                stroke={charts.label}
                position={"centerBottom"}
                angle={-90}
                dx={-40}
              />
            </YAxis>
            <Legend verticalAlign="top" align="right" />
            <Scatter
              data={regression}
              type="monotone"
              name="Life Metric"
              line
              shape={() => {
                return <></>;
              }}
              dataKey="value"
              fill="white"
            />
            {mechanisms
              ? mechanisms.map((m: Array<number>, index: number) => {
                  return (
                    <>
                      <Scatter
                        key={index}
                        data={m}
                        type="monotone"
                        name={`Mechanism ${index}`}
                        dataKey="value"
                        fill="white"
                      />
                    </>
                  );
                })
              : null}
          </ScatterChart>
        </>
      ) : null}
    </>
  );
};
