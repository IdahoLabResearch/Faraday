export const ImpedanceTooltip = (props: any) => {
  if (props.active && props.payload && props.payload.length) {
    const time = props.payload[0].payload.time;
    return (
      <>
        <div className="bg-black prose text-white px-2">
          Time: {parseFloat(time)} hours
        </div>
        {props.payload.map((payload: any) => {
          return (
            <>
              <div className="bg-black prose text-white px-2">
                {payload.name}: {parseFloat(payload.value).toFixed(3)}
              </div>
            </>
          );
        })}
      </>
    );
  }

  return null;
};

export const PWMTooltip = (props: any) => {
  if (props.active && props.payload && props.payload.length) {
    const time = props.payload[0].payload.time;

    return (
      <>
        <div className="bg-black prose text-white px-2">
          Time: {parseFloat(time).toFixed(3)} hours
        </div>
        {props.payload.map((payload: any) => {
          return (
            <>
              <div className="bg-black prose text-white px-2">
                Current Density: {parseFloat(payload.value).toFixed(3)}
              </div>
            </>
          );
        })}
      </>
    );
  }

  return null;
};

export const PotentiostaticTooltip = (props: any) => {
  if (props.active && props.payload && props.payload.length) {
    const time = props.payload[0].payload.time;
    return (
      <>
        <div className="bg-black prose text-white px-2">
          Time: {parseFloat(time).toFixed(3)} hours
        </div>
        {props.payload.map((payload: any) => {
          return (
            <>
              <div className="bg-black prose text-white px-2">
                {payload.name}: {parseFloat(payload.value).toFixed(3)}
              </div>
            </>
          );
        })}
      </>
    );
  }

  return null;
};
