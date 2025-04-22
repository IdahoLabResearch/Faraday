export type ElectrolysisCellQuery = {
  provider: string;
  test: string;
  cell: string;
  batch: string;
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

export type QueryResultT = {
  type: string;
  timeseries: {
    data: Array<ImpedanceDataT | PWMDataT | PotentiostaticDataT>;
  };
};
