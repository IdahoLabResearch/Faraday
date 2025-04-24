import time

from .data import bounds_low, bounds_high, sample_rate, max_mechanisms, genetic_alg_settings, n_bootstrap_samples, n_runs, parallelism
from .helpers import downsample_data, choose_optimal_mechanisms, get_results_data


def Noor_Sigmoid_Regression(cell_name, t_data, life_metric_data):

    # Downsample the data
    t_data_downsampled, life_metric_data_downsampled = downsample_data(
        t_data, life_metric_data,
        sample_rate=sample_rate
    )

    # Update bounds with the current data
    bounds_low["M"] = life_metric_data.min()
    bounds_high["M"] = life_metric_data.max()

    start_time = time.time()
    print("Start time:" + str(start_time))

    # Fit the model and choose optimal mechanisms
    best_mechanisms, best_params, results_per_mechanism = (
        choose_optimal_mechanisms(
            t_data_downsampled,
            life_metric_data_downsampled,
            max_mechanisms=max_mechanisms,
            bounds_low=bounds_low,
            bounds_high=bounds_high,
            genetic_alg_settings=genetic_alg_settings,
            n_runs=n_runs,
            n_bootstrap_samples=n_bootstrap_samples,
            use_parallel=parallelism,
        )
    )
    fit_time = time.time() - start_time
    print("Fit time:" + str(fit_time))

    result_dict = {
        "cell_name": cell_name,
        "best_mechanisms": best_mechanisms,
        "best_params": best_params,
        "results_per_mechanism": results_per_mechanism,
        "time_taken": fit_time,
        "date_time": time.time(),
    }

    print("Get Results")
    # Organize the data structure for plotting
    data = get_results_data(
        t_data,
        life_metric_data,
        t_data_downsampled,
        life_metric_data_downsampled,
        results_per_mechanism,
        cell_name,
        n_runs,
    )

    return {
        "descriptors": result_dict,
        "data": data
    }
