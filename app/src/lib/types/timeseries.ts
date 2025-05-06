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

export interface SigmoidalRateExpressionI {
  data: {
    name: string;
    results_data: Array<{
      downsampled_data: Array<{
        life_metric_data_fit: Array<number>;
        t_data_fit: Array<number>;
      }>;
      fitted_data: Array<number>;
      mechanisms: Array<Array<number>>;
      n_mechanisms: number;
    }>;
  };
  descriptors: {
    best_mechanism: number;
    best_params: Array<number>;
    name: string;
    date_time: number;
    results_per_mechanism: Array<{
      aicc: number;
      aiccc: number;
      best_individuals_per_gen: Array<{
        best_individuals_per_gen: Array<Array<number>>;
        bootstrap_idx: number;
        run_idx: number;
      }>;
      bic: number;
      dic: number;
      final_params: Array<number>;
      logs: Array<{
        run_idx: number;
        bootstrap_idx: number;
        log: Array<{
          avg: number;
          gen: number;
          max: number;
          min: number;
          nevals: number;
          std: number;
        }>;
      }>;
    }>;
    time_taken: number;
  };
}
