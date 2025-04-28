/* eslint-disable @typescript-eslint/no-unused-vars */

// Types
import { TooltipProps } from "recharts";
import {
  Payload,
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

// IMPEDANCE
export const ImpedanceTooltip = (props: TooltipProps<ValueType, NameType>) => {
  if (props.active && props.payload) {
    const data = props.payload[0].payload.data;
    return (
      <>
        {Object.entries(data).map(([key, value]: [string, unknown]) => {
          return (
            <>
              <div className="bg-black prose text-white px-2">
                {key}: {value as number} <br />
              </div>
            </>
          );
        })}
      </>
    );
  }

  return null;
};

export const DRTTooltip = (props: TooltipProps<ValueType, NameType>) => {
  if (props.active && props.payload) {
    const payload = props.payload[0].payload;
    return (
      <>
        {Object.entries(payload).map(([key, value]: [string, unknown]) => {
          return (
            <>
              <div className="bg-black prose text-white px-2">
                {key}: {value as number}
              </div>
            </>
          );
        })}
      </>
    );
  }

  return null;
};

// PULSE WIDTH MODULATION
export const PWMTooltip = (props: TooltipProps<ValueType, NameType>) => {
  if (props.active && props.payload && props.payload.length) {
    const data = props.payload[0].payload.data;
    return (
      <>
        {Object.entries(data).map(([key, value]: [string, unknown]) => {
          return (
            <>
              <div className="bg-black prose text-white px-2">
                {key}: {value as number} <br />
              </div>
            </>
          );
        })}
      </>
    );
  }

  return null;
};

// POTENTIOSTATIC
export const PotentiostaticTooltip = (
  props: TooltipProps<ValueType, NameType>
) => {
  if (props.active && props.payload && props.payload.length) {
    const data = props.payload[0].payload.data;
    return (
      <>
        {Object.entries(data).map(([key, value]: [string, unknown]) => {
          return (
            <>
              <div className="bg-black prose text-white px-2">
                {key}: {value as number} <br />
              </div>
            </>
          );
        })}
      </>
    );
  }

  return null;
};
