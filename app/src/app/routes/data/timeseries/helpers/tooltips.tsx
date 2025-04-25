/* eslint-disable @typescript-eslint/no-unused-vars */

// Types
import { TooltipProps } from "recharts";
import {
  Payload,
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

export const ImpedanceTooltip = (props: TooltipProps<ValueType, NameType>) => {
  if (props.active && props.payload) {
    const time = props.payload[0].payload.metadata.time;
    return (
      <>
        <div className="bg-black prose text-white px-2">Time: {time} hours</div>
        {props.payload.map(
          (
            payload: Payload<ValueType, NameType>,
            _index: number,
            _array: Payload<ValueType, NameType>[]
          ) => {
            return (
              <>
                <div className="bg-black prose text-white px-2">
                  {payload.name}: {payload.value!}
                </div>
              </>
            );
          }
        )}
      </>
    );
  }

  return null;
};

export const PWMTooltip = (props: TooltipProps<ValueType, NameType>) => {
  if (props.active && props.payload && props.payload.length) {
    const time = props.payload[0].payload.data.time;
    return (
      <>
        <div className="bg-black prose text-white px-2">Time: {time} hours</div>
        {props.payload.map(
          (
            payload: Payload<ValueType, NameType>,
            _index: number,
            _array: Payload<ValueType, NameType>[]
          ) => {
            return (
              <>
                <div className="bg-black prose text-white px-2">
                  Current Density: {payload.value}
                </div>
              </>
            );
          }
        )}
      </>
    );
  }

  return null;
};

export const PotentiostaticTooltip = (
  props: TooltipProps<ValueType, NameType>
) => {
  if (props.active && props.payload && props.payload.length) {
    console.log(props.payload);
    const time = props.payload[0].payload.data.time;
    return (
      <>
        <div className="bg-black prose text-white px-2">
          Time: {parseFloat(time).toFixed(3)} hours
        </div>
        {props.payload.map(
          (
            payload: Payload<ValueType, NameType>,
            _index: number,
            _array: Payload<ValueType, NameType>[]
          ) => {
            return (
              <>
                <div className="bg-black prose text-white px-2">
                  {payload.name}: {payload.value}
                </div>
              </>
            );
          }
        )}
      </>
    );
  }

  return null;
};
