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
    real_impedance: string | number;
    imaginary_impedance: string | number;
  };
  metadata: {
    time: string | number;
    sweep: string | number;
    frequency: string | number;
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
    time: string | number;
    current_density: string | number;
  };
  metadata: {
    voltage: string | number;
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
    time: string | number;
    current_density: string | number;
  };
  metadata: {
    voltage: string | number;
  };
};

export type QueryResultT = {
  type: string;
  timeseries: Array<ImpedanceDataT | PWMDataT | PotentiostaticDataT>;
};
