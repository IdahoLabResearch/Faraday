export type ElectrolysisCellQuery = {
  provider: string;
  test: string;
  cell: string;
  batch: string;
};

export type ImpedanceData = {
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

export type PotentiostaticData = {
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

export type PWMData = {
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
