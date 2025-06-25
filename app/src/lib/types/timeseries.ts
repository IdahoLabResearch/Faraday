export type ElectrolysisCellQuery = {
  provider: string;
  test: string;
  cell: string;
  batch: string;
};

export type ElectrolysisStackQuery = {
  provider: string;
  test: string;
  stackid: string;
};

export type ImpedanceDataT = {
  uuid: string;
  cell: string;
  date: number;
  provider: string;
  test: string;
  batch: string;
  data: {
    real_impedance: number;
    imaginary_impedance: number;
  };
  metadata: {
    time: number;
    sweep: number;
    frequency: number;
  };
};

export type PotentiostaticDataT = {
  uuid: string;
  cell: string;
  date: number;
  provider: string;
  test: string;
  batch: string;
  data: {
    time: number;
    current_density: number;
  };
  metadata: {
    voltage: number;
  };
};

export type PWMDataT = {
  uuid: string;
  cell: string;
  date: number;
  provider: string;
  test: string;
  batch: string;
  data: {
    time: number;
    current_density: number;
  };
  metadata: {
    voltage: number;
  };
};

export type ElectrolysisCellQueryResultT = {
  type: string;
  timeseries: {
    data: Array<ImpedanceDataT | PWMDataT | PotentiostaticDataT>;
  };
};

export type GalvanostaticDataT = {
  uuid: string;
  date: number;
  provider: string;
  test: string;
  stackid: string;
  data: {
    time: number;
    state: string;
    anonymized_current: number;
    anonymized_voltage: number;
    air_flow: number;
    air_temperature: number;
    furnace_temperature: number;
    h2_flow: number;
    n2_flow: number;
  };
  metadata: object;
};

export type ElectrolysisStackQueryResultT = {
  type: string;
  timeseries: {
    data: Array<GalvanostaticDataT>;
  };
};
