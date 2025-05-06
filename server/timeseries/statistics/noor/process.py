import time
import json
import numpy as np

from .data import bounds_low, bounds_high, sample_rate, max_mechanisms, genetic_alg_settings, n_bootstrap_samples, n_runs, parallelism
from .helpers import downsample_data, choose_optimal_mechanisms, get_results_data


def Noor_Sigmoid_Regression(name, t_data, life_metric_data):

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
        "name": name,
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
        name,
        n_runs,
    )

    return serialize_dict({
        "descriptors": result_dict,
        "data": data
    })


def serialize_dict(data):
    """
    Recursively convert numpy arrays in a dictionary to lists.

    Args:
        data (dict or list or numpy.ndarray): The input data to be converted.

    Returns:
        dict or list: The input data with numpy arrays converted to lists.
    """
    if isinstance(data, dict):
        return {key: serialize_dict(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [serialize_dict(item) for item in data]
    elif isinstance(data, np.ndarray):
        return data.tolist()
    else:
        return data
