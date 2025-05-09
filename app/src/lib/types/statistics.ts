export type DistributionRelaxationT = {
  tau: number;
  gamma: number;
  sweep: number;
};

export interface SigmoidalRateExpressionI {
  data: {
    name: string;
    results_data: Array<SigmoidRegressionI>;
  };
  descriptors: SigmoidMetadataI;
}

export interface SigmoidRegressionI {
  fitted_data: Array<number>;
  downsampled_data: {
    t_data_fit: Array<number>;
    life_metric_data_fit: Array<number>;
  };
  mechanisms: Array<Array<number>>;
  n_mechanisms: number;
}

interface SigmoidMetadataI {
  best_mechanisms: number;
  best_params: Array<number>;
  name: string;
  date_time: number;
  results_per_mechanism: Array<{
    n_mechanisms: number;
    final_params: Array<number>;
    aicc: number;
    aiccc: number;
    param_std_dev: Array<number>;
    best_individuals_per_gen: Array<{
      run_idx: number;
      bootstrap_idx: number;
      best_individuals_per_gen: Array<Array<number>>;
    }>;
    params: Array<
      | {
          run_idx: number;
          bootstrap_idx: number;
          params: Array<number>;
        }
      | {
          run_idx: number;
          params: Array<number>;
        }
    >;
    bic: number;
    dic: number;
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
}
