import numpy as np
import multiprocessing
from sklearn.utils import resample
from scipy.optimize import curve_fit
from deap import base, creator, tools, algorithms
from joblib import Parallel, delayed, parallel_backend


def SRE(t, M0, *params):
    """
    Sigmoidal Rate Expression (SRE) function that models the degradation process.

    Args:
        t (array-like): Array of time values.
        M0 (float): Initial improvement parameter.
        *params (float): Parameters for the SRE model, grouped in sets of three (a, b, M) for each mechanism.
                         Each mechanism's parameters are:
                         - a: rate constant
                         - b: order-of-reaction term
                         - M: maximum extent of aging progression possible under the test conditions

    Returns:
        tuple:
            - result (array-like): Sum of all mechanisms' contributions plus M0.
            - mechanisms (list of array-like): Individual mechanisms' contributions.
    """
    # Ensure params length is valid
    if len(params) % 3 != 0:
        raise ValueError(
            "The number of parameters must be a multiple of 3 (a, b, M for each mechanism)."
        )

    n_mechanisms = len(params) // 3

    total = np.zeros_like(t)

    mechanisms = []
    M0 = 0
    for i in range(n_mechanisms):
        # print('params: {}'.format(params), flush=True)

        a, b, M = params[3 * i: 3 * i + 3]

        # print('scalar a: {}'.format(a), flush=True)

        exp_term = np.exp(np.clip((a * t) ** b, -700, 700))

        # print('exp_term: {}'.format(exp_term), flush=True)

        mechanism = M0 + 2 * (M - M0) * (0.5 - 1 / (1 + exp_term))

        # print('mechanism: {}'.format(mechanism), flush=True)

        mechanisms.append(mechanism)
        total += mechanism

    return total, mechanisms


def objective_function(t, M0, *params):
    """
    Wrapper for the SRE function to be used in curve fitting.

    Args:
        t (array-like): Array of time values.
        M0 (float): Initial improvement parameter.
        *params (float): Parameters for the SRE model.

    Returns:
        array-like: Fitted life metric data.
    """

    return SRE(t, M0, *params)[0]


def sort_by(params, by):
    """
    Sort the mechanisms by parameter values.

    Args:
        params (list of float): Parameters for the SRE model.
        by (string): 'a', 'b', 'M'

    Returns:
        list of float: Sorted parameters.
    """
    if by == 'a':
        i = 1

    elif by == 'b':
        i = 2

    elif by == 'M':
        i = 3

    else:
        print("Invalid selection for sorting! Valid options: 'a' , 'b', or 'M'")
    p_values = params[i::3]
    sorted_indices = np.argsort(p_values)
    sorted_params = [params[0]]  # Include M0 at the beginning
    for idx in sorted_indices:
        sorted_params.extend(params[3 * idx + 1: 3 * idx + 4])
    return sorted_params


def feasible(individual):
    """
    Check if the sum of M values (including M0) in the individual is between 0 and 1 (inclusive).

    Args:
        individual (list of float): An individual solution from the genetic algorithm.

    Returns:
        bool: True if the sum of M values (including M0) is feasible, otherwise False.
    """
    M0 = individual[0]
    M_values = individual[3::3]
    total_sum = M0 + np.sum(M_values)
    return 0 <= total_sum <= 1.0


def distance(individual):
    """
    Calculate the distance to the feasibility constraint for penalty in the genetic algorithm.

    Args:
        individual (list of float): An individual solution from the genetic algorithm.

    Returns:
        float: Distance to the feasibility constraint.
    """
    M0 = individual[0]
    M_values = individual[3::3]
    return max(0, (M0 + np.sum(M_values)) - 1.0)


def evaluate_params(params, t_data, life_metric_data):
    """
    Evaluate the mean squared error (MSE) between the fitted data and the actual life metric data.

    Args:
        params (list of float): Parameters for the SRE model, with M0 as the first parameter.
        t_data (array-like): Array of time values.
        life_metric_data (array-like): Array of actual life metric values.

    Returns:
        tuple:
            - mse (float): Mean squared error of the fitted data.
    """

    M0 = params[0]
    mechanism_params = params[1:]
    fitted_data, _ = SRE(t_data, M0, *mechanism_params)

    if np.any(np.isnan(fitted_data)) or np.any(np.isinf(fitted_data)):
        return (float("inf"),)

    # mse = np.mean((fitted_data - life_metric_data) ** 2)
    mae = np.mean(abs(fitted_data - life_metric_data))
    return (mae,)


def clear_deap_creator():
    """
    Clear DEAP creator to avoid conflicts.

    Deletes FitnessMin and Individual attributes from creator if they exist.
    """

    if hasattr(creator, "FitnessMin"):
        del creator.FitnessMin
    if hasattr(creator, "Individual"):
        del creator.Individual


def genetic_fit(
    t_data,
    life_metric_data,
    n_mechanisms,
    bounds_low,
    bounds_high,
    population_size=50000,
    n_generations=500,
    mu=500,
    lambda_=2000,
    cxpb=0.35,
    mutpb=0.65,
    fitness_threshold=5e-9,
    avg_fitness_threshold=1e-6,
    random_state=0,
):
    """
    Perform genetic algorithm optimization to fit the SRE model.

    Args:
        t_data (array-like): Array of time values.
        life_metric_data (array-like): Array of actual life metric values.
        n_mechanisms (int): Number of mechanisms in the SRE model.
        bounds_low (dict): Lower bounds for the parameters.
        bounds_high (dict): Upper bounds for the parameters.
        population_size (int, optional): Size of the population. Defaults to 10000.
        n_generations (int, optional): Number of generations. Defaults to 5000.
        mu (int, optional): Number of individuals to select for the next generation. Defaults to 100.
        lambda_ (int, optional): Number of children to produce at each generation. Defaults to 250.
        cxpb (float, optional): Probability of crossover. Defaults to 0.35.
        mutpb (float, optional): Probability of mutation. Defaults to 0.65.
        fitness_threshold (float, optional): Difference between min & max fitness. Defaults to 1e-8.
        avg_fitness_threshold (float, optional): Average fitness threshold for termination. Defaults to 1e-6.
        random_state (int, optional): Seed for the random number generator. Defaults to 0.

    Returns:
        tuple:
            - best_individual (list of float): Best individual parameters found.
            - log (deap.tools.Logbook): Logbook of the genetic algorithm run.
    """

    clear_deap_creator()

    creator.create("FitnessMin", base.Fitness, weights=(-1.0,))
    creator.create("Individual", list, fitness=creator.FitnessMin)

    toolbox = base.Toolbox()

    low = [bounds_low["M0"]]
    high = [bounds_high["M0"]]
    for i in range(n_mechanisms):
        low.extend([bounds_low["a"], bounds_low["b"], bounds_low["M"]])
        high.extend([bounds_high["a"], bounds_high["b"], bounds_high["M"]])

    toolbox.register(
        "attr_float", np.random.uniform, bounds_low["a"], bounds_high["M"]
    )
    toolbox.register(
        "individual",
        tools.initIterate,
        creator.Individual,
        lambda: [
            np.random.uniform(low[i], high[i])
            for i in range(n_mechanisms * 3 + 1)
        ],
    )
    toolbox.register("population", tools.initRepeat, list, toolbox.individual)

    toolbox.register("mate", tools.cxBlend, alpha=0.7)
    toolbox.register(
        "mutate",
        tools.mutPolynomialBounded,
        low=low,
        up=high,
        eta=1.0,
        indpb=0.2,
    )
    toolbox.register("select", tools.selTournament, tournsize=100)
    toolbox.register(
        "evaluate",
        evaluate_params,
        t_data=t_data,
        life_metric_data=life_metric_data,
    )

    toolbox.decorate("evaluate", tools.DeltaPenalty(feasible, 1e9, distance))

    def check_bounds(low, high):
        def decorator(func):
            def wrapper(*args, **kargs):
                offspring = func(*args, **kargs)
                for child in offspring:
                    for i in range(len(child)):
                        if child[i] < low[i]:
                            child[i] = low[i]
                        elif child[i] > high[i]:
                            child[i] = high[i]
                return offspring

            return wrapper

        return decorator

    toolbox.decorate("mate", check_bounds(low, high))
    toolbox.decorate("mutate", check_bounds(low, high))

    if random_state is not None:
        np.random.seed(random_state)

    population = toolbox.population(n=population_size)

    stats = tools.Statistics(lambda ind: ind.fitness.values)
    stats.register("avg", np.mean)
    stats.register("std", np.std)
    stats.register("min", np.min)
    stats.register("max", np.max)

    logbook = tools.Logbook()
    logbook.header = ["gen", "nevals"] + stats.fields

    patience = 10
    converged_generations = 0

    best_individuals_per_gen = (
        []
    )  # List to store best individuals from each generation

    for gen in range(n_generations):
        result_pop, log = algorithms.eaMuPlusLambda(
            population,
            toolbox,
            mu,
            lambda_,
            cxpb,
            mutpb,
            1,
            stats=stats,
            verbose=False,
        )

        nevals = log.select('nevals')[-1]

        record = stats.compile(population)
        logbook.record(gen=gen, nevals=nevals, **record)

        # Store the best individual of this generation
        best_individuals_per_gen.append(tools.selBest(result_pop, k=1)[0])

        if record['std'] < fitness_threshold or record['avg'] < avg_fitness_threshold:
            converged_generations += 1
        else:
            converged_generations = 0

        if converged_generations >= patience:
            # print()
            # print(f"Algorithm converged after {gen+1} generations.")
            break

    best_individual = tools.selBest(result_pop, k=1)[0]

    return best_individual, logbook, best_individuals_per_gen


def evaluate_metrics(params, t_data, life_metric_data):
    """
    Evaluate various metrics for the fit between the SRE model and the actual data.

    Args:
        params (list of float): Parameters for the SRE model.
        t_data (array-like): Array of time values.
        life_metric_data (array-like): Array of actual life metric values.

    Returns:
        tuple:
            - sse (float): Sum of squared errors.
        - mse (float): Mean squared error.
        - rmse (float): Root mean squared error.
        - r_squared (float): R-squared value.
    """

    fitted_data, _ = SRE(t_data, *params)
    if np.any(np.isnan(fitted_data)) or np.any(np.isinf(fitted_data)):
        return float("inf"), float("inf"), float("inf"), float("inf")
    residuals = fitted_data - life_metric_data
    sse = np.sum(residuals**2)
    mse = np.mean(residuals**2)
    rmse = np.sqrt(mse)
    r_squared = 1 - (
        sse / np.sum((life_metric_data - np.mean(life_metric_data)) ** 2)
    )
    return sse, mse, rmse, r_squared


def run_hybrid_fit(
    t_data,
    life_metric_data,
    n_mechanisms,
    bounds_low,
    bounds_high,
    genetic_alg_settings,
):
    """
    Run genetic fit and fine-tune using curve fitting.

    Args:
        t_data (array-like): Array of time values.
        life_metric_data (array-like): Array of life metric values.
        n_mechanisms (int): Number of mechanisms in the SRE model.
        bounds_low (dict): Lower bounds for the parameters.
        bounds_high (dict): Upper bounds for the parameters.
        genetic_alg_settings (dict): Settings for the genetic algorithm.

    Returns:
        tuple:
            - sorted_best_params (list of float): Sorted best parameters found.
            - log (deap.tools.Logbook): Logbook of the genetic algorithm run.
            - best_individuals_per_gen (list of list of float): Best individual parameters from each generation.
    """

    optimal_params, log, best_individuals_per_gen = genetic_fit(
        t_data,
        life_metric_data,
        n_mechanisms=n_mechanisms,
        bounds_low=bounds_low,
        bounds_high=bounds_high,
        **genetic_alg_settings,
    )

    initial_guess = np.array(optimal_params)
    lower_bounds = [bounds_low["M0"]]
    upper_bounds = [bounds_high["M0"]]

    for i in range(n_mechanisms):
        a_low, b_low, M_low = bounds_low["a"], bounds_low["b"], bounds_low["M"]
        a_high, b_high, M_high = (
            bounds_high["a"],
            bounds_high["b"],
            bounds_high["M"],
        )

        lower_bounds.extend([a_low, b_low, M_low])
        upper_bounds.extend([a_high, b_high, M_high])

    initial_guess = np.clip(initial_guess, lower_bounds, upper_bounds)

    try:
        best_params, _ = curve_fit(
            objective_function,
            t_data,
            life_metric_data,
            p0=initial_guess,
            bounds=(lower_bounds, upper_bounds),
            method="trf",
            loss="soft_l1",
            jac="3-point",
            max_nfev=1e6,
        )

        sorted_best_params = sort_by(best_params, 'M')
        return sorted_best_params, log, best_individuals_per_gen
    except RuntimeError as e:
        print(f"TRF fit failed: {e}")
        return None, None, None


def extract_mechanism_params(params, n_mechanisms):
    """
    Extract mechanism parameters from the given parameter list.

    Args:
        params (list of float): Parameters for the SRE model.
        n_mechanisms (int): Number of mechanisms.

    Returns:
        list of list of float: List of mechanism parameters (a, b, M) for each mechanism.
    """
    mechanisms = []
    for i in range(n_mechanisms):
        a, b, M = params[3 * i + 1: 3 * i + 4]
        mechanisms.append([a, b, M])
    return mechanisms


def average_mechanisms(aligned_mechanisms):
    """
    Average the aligned mechanism parameters.

    Args:
        aligned_mechanisms (list of list of float): Aligned mechanism parameters for each run.

    Returns:
        list of float: Averaged mechanism parameters.
    """
    # Convert to a numpy array for easy averaging
    aligned_mechanisms_np = np.array(aligned_mechanisms)

    # Compute the average parameters for each mechanism
    averaged_params = np.median(aligned_mechanisms_np, axis=0)

    return averaged_params.flatten().tolist()


def multiple_runs(
    t_data,
    life_metric_data,
    n_mechanisms=3,
    n_runs=1,
    n_bootstrap_samples=50,
    bounds_low=None,
    bounds_high=None,
    genetic_alg_settings=None,
    use_parallel=True,
    random_state=0,
):
    """
    Perform multiple runs with clustering for robust parameter estimation using bootstrapping.

    Args:
        t_data (array-like): Array of time values.
        life_metric_data (array-like): Array of actual life metric values.
        n_mechanisms (int, optional): Number of mechanisms in the SRE model. Defaults to 3.
        n_runs (int, optional): Number of runs for the genetic algorithm. Defaults to 1.
        n_bootstrap_samples (int, optional): Number of bootstrap samples. Defaults to 1000.
        bounds_low (dict, optional): Lower bounds for the parameters. Defaults to None.
        bounds_high (dict, optional): Upper bounds for the parameters. Defaults to None.
        genetic_alg_settings (dict, optional): Settings for the genetic algorithm. Defaults to None.
        use_parallel (bool, optional): Flag to enable or disable parallel processing. Defaults to True.
        random_state (int, optional): Seed for the random number generator. Defaults to 0.

    Returns:
        tuple:
            - final_params (numpy.ndarray): Aggregated final parameter set.
            - all_params (list): List of all parameter sets found.
            - all_log (list): List of all logs from the genetic algorithm runs.
            - best_individuals_per_gen_all_runs (list): Best individual parameters from each generation across all runs.
    """

    all_params = []
    all_log = []
    best_individuals_per_gen_all_runs = []

    rng = np.random.default_rng(random_state)

    for run_idx in range(n_runs):
        clear_deap_creator()

        val_SSEs = []
        val_MSEs = []
        val_RMSEs = []
        val_R2s = []

        if use_parallel:
            num_cores = multiprocessing.cpu_count() - 1
            # print()
            # print(f"Using {num_cores} CPU cores for parallel processing.")
            with parallel_backend("loky", n_jobs=num_cores):
                results = Parallel()(
                    delayed(run_hybrid_fit)(
                        *resample(
                            t_data,
                            life_metric_data,
                            replace=False,
                            random_state=rng.integers(0, 2**32 - 1),
                        ),
                        n_mechanisms,
                        bounds_low,
                        bounds_high,
                        genetic_alg_settings,
                    )
                    for _ in range(n_bootstrap_samples)
                )
        else:
            # Initialize the inner progress bar outside the loop
            results = [
                run_hybrid_fit(
                    *resample(
                        t_data,
                        life_metric_data,
                        replace=False,
                        random_state=rng.integers(0, 2**32 - 1),
                    ),
                    n_mechanisms,
                    bounds_low,
                    bounds_high,
                    genetic_alg_settings,
                )
                for _ in range(n_bootstrap_samples)
            ]

        all_mechanism_params = []

        for bootstrap_idx, result in enumerate(results):
            best_params, log, best_individuals_per_gen = (
                result  # Unpacking three values now
            )
            if best_params is not None:
                all_params.append(
                    {
                        "run_idx": run_idx,
                        "bootstrap_idx": bootstrap_idx,
                        "params": best_params,
                    }
                )

                all_log.append(
                    {
                        "run_idx": run_idx,
                        "bootstrap_idx": bootstrap_idx,
                        "log": log,
                    }
                )

                best_individuals_per_gen_all_runs.append(
                    {
                        "run_idx": run_idx,
                        "bootstrap_idx": bootstrap_idx,
                        "best_individuals_per_gen": best_individuals_per_gen,
                    }
                )

                val_sse, val_mse, val_rmse, val_r_squared = evaluate_metrics(
                    best_params, t_data, life_metric_data
                )

                val_SSEs.append(val_sse)
                val_MSEs.append(val_mse)
                val_RMSEs.append(val_rmse)
                val_R2s.append(val_r_squared)

                # Extract mechanism parameters
                mechanism_params = extract_mechanism_params(
                    best_params, n_mechanisms
                )
                all_mechanism_params.append(mechanism_params)

        avg_val_SSE = np.mean(val_SSEs)
        avg_val_MSE = np.mean(val_MSEs)
        avg_val_RMSE = np.mean(val_RMSEs)
        avg_val_R2 = np.mean(val_R2s)

        # print(f"Average SSE: {avg_val_SSE}")
        # print(f"Average MSE: {avg_val_MSE}")
        # print(f"Average RMSE: {avg_val_RMSE}")

        # Average the aligned mechanisms for this run
        averaged_mechanisms = average_mechanisms(all_mechanism_params)

        # Aggregate the parameters for this run
        final_params = [
            np.median(
                [
                    params["params"][0]
                    for params in all_params
                    if params["run_idx"] == run_idx
                ]
            )
        ] + averaged_mechanisms

        # Store the final parameters for this run
        all_params.append({"run_idx": run_idx, "params": final_params})

    # Format the final parameters to 4 significant figures and print
    formatted_final_params = [float(f"{param:.4f}") for param in final_params]
    sse, mse, rmse, r2 = evaluate_metrics(
        final_params, t_data, life_metric_data
    )

    # print("Final (Median) Parameters:", formatted_final_params)
    # print(f"Final (Median) R2: {r2:.4f}")
    # print(f"Average R2: {avg_val_R2:.4f}")
    # print()

    return final_params, all_params, all_log, best_individuals_per_gen_all_runs


def choose_optimal_mechanisms(
    t_data,
    life_metric_data,
    max_mechanisms=3,
    bounds_low=None,
    bounds_high=None,
    genetic_alg_settings=None,
    n_runs=1,
    n_bootstrap_samples=10,
    use_parallel=True,
):
    """
    Select the optimal number of mechanisms based on AIC, BIC, and DIC.

    Args:
        t_data (array-like): Array of time values.
        life_metric_data (array-like): Array of actual life metric values.
        max_mechanisms (int, optional): Maximum number of mechanisms to consider. Defaults to 3.
        bounds_low (dict, optional): Lower bounds for the parameters. Defaults to None.
        bounds_high (dict, optional): Upper bounds for the parameters. Defaults to None.
        genetic_alg_settings (dict, optional): Settings for the genetic algorithm. Defaults to None.
        n_runs (int, optional): Number of runs for the fitting algorithm. Defaults to 1.

    Returns:
        tuple:
            - best_mechanisms (int): Optimal number of mechanisms.
            - best_params (list of float): Parameters for the optimal number of mechanisms.
            - results_per_mechanism (list of dict): Results for each number of mechanisms.
    """

    best_mechanisms = None
    best_params = None
    best_score = float("inf")
    results_per_mechanism = []

    for n_mechanisms in range(3, max_mechanisms + 1):

        final_params, params, logs, best_individuals_per_gen_all_runs = (
            multiple_runs(
                t_data,
                life_metric_data,
                n_mechanisms=n_mechanisms,
                n_runs=n_runs,
                bounds_low=bounds_low,
                bounds_high=bounds_high,
                genetic_alg_settings=genetic_alg_settings,
                n_bootstrap_samples=n_bootstrap_samples,
                use_parallel=use_parallel,
            )
        )

        # Evaluate the fit using the final aggregated parameters
        sse, _, _, _ = evaluate_metrics(final_params, t_data, life_metric_data)

        # Calculate AIC and BIC for model selection
        k = len(final_params)
        n = len(life_metric_data)
        aic = n * np.log(sse / n) + 2 * k
        aicc = aic + (2 * k**2 + 2 * k) / (n - k - 1)
        bic = n * np.log(sse / n) + np.log(n) * k

        # Calculate coefficient of variance of parameter estimates across bootstrap samples
        all_bootstrap_params = np.array([p["params"] for p in params])
        param_mean = np.mean(all_bootstrap_params, axis=0)
        param_std_dev = np.std(all_bootstrap_params, axis=0)
        param_cv = np.divide(param_std_dev, param_mean, where=param_mean != 0)
        mean_param_cv = param_cv.mean()

        aiccc = aicc + 0.1*abs(aicc)*(mean_param_cv)  # Penalize variability

        # Calculate DIC
        deviance_mean = -2 * np.log(sse / n)
        deviance_at_mean = -2 * \
            np.log(np.mean(
                [evaluate_metrics(p["params"], t_data, life_metric_data)[0] for p in params]))
        p_d = deviance_mean - deviance_at_mean
        dic = deviance_mean + 2 * p_d

        # Store the results for this number of mechanisms
        results_per_mechanism.append(
            {
                "n_mechanisms": n_mechanisms,
                "final_params": final_params,
                "params": params,
                "logs": logs,
                "aicc": aicc,
                "bic": bic,
                "param_std_dev": param_std_dev,
                "best_individuals_per_gen": best_individuals_per_gen_all_runs,
                "aiccc": aiccc,
                "dic": dic
            }
        )

        # Use corrected AICc to determine the best number of mechanisms
        if aiccc < best_score:
            best_score = aiccc
            best_mechanisms = n_mechanisms
            best_params = final_params

    #     print(
    #         f'AICc: {aicc:.4g}, BIC: {bic:.4g}, cAIC: {aiccc:.4g}, DIC: {dic:.4g}')
    #     print(f'Standard Deviation:{param_std_dev.mean():.4g}')
    #     print(f'Coefficient of Variation:{mean_param_cv:.4g}')
    #     print()

    # print('Analysis complete:')
    # print(f"Optimal number of mechanisms: {best_mechanisms}")

    return best_mechanisms, best_params, results_per_mechanism


def downsample_data(t_data, life_metric_data, factor=None, sample_rate=None):
    """
    Down-sample the data by the given factor or sample rate, ensuring an even representation across the time range.

    Args:
        t_data (array-like): Array of time values in hours.
        life_metric_data (array-like): Array of life metric values.
        factor (int, optional): Down-sampling factor.
        sample_rate (float, optional): Desired sample rate in points per hour (e.g., 10 points per hour).

    Returns:
        tuple:
            - t_data_downsampled (array-like): Down-sampled time values.
            - life_metric_data_downsampled (array-like): Down-sampled life metric values.
    """
    if factor is not None and sample_rate is not None:
        raise ValueError(
            "Specify only one of 'factor' or 'sample_rate', not both.")

    n = len(t_data)
    total_time = t_data[-1] - t_data[0]
    original_sample_rate = n / total_time

    if factor is not None:
        indices = np.linspace(0, n - 1, num=n // factor, dtype=int)
    elif sample_rate is not None:
        if sample_rate <= 0:
            raise ValueError("Sample rate must be a positive value.")
        # Calculate the step size based on the desired sample rate in points per hour
        step = max(2, int(original_sample_rate / sample_rate))
        if step >= n:
            raise ValueError(
                f"Desired sample rate is larger than the original data length of {n}.")
        indices = np.arange(0, n, step)
    else:

        raise ValueError("Either 'factor' or 'sample_rate' must be specified.")

    return t_data[indices], life_metric_data[indices]


def get_results_data(
    t_data,
    life_metric_data,
    t_data_fit,
    life_metric_data_fit,
    results_per_mechanism,
    cell_name,
    n_runs,
):
    """
    Get the results for different numbers of mechanisms and AIC/BIC scores.

    Args:
        t_data (array-like): Original time data.
        life_metric_data (array-like): Original life metric data.
        t_data_fit (array-like): Fitted time data.
        life_metric_data_fit (array-like): Fitted life metric data.
        results_per_mechanism (list): List of results per mechanism.
        cell_name (str): Name of the cell.
        n_runs (int): Number of runs.

    Returns:
        dict: A dictionary having the cell name and a dictionary of results including fitted data, downsampled data, and mechanisms
    """
    results_data = []

    for result in results_per_mechanism:
        params = result["final_params"]

        if len(params) % 3 != 1:
            raise ValueError(
                "The number of parameters must be M0 plus a multiple of 3 (a, b, M for each mechanism)."
            )

        fitted_data, mechanisms = SRE(t_data, *params)

        result_entry = {
            "fitted_data": fitted_data,
            "downsampled_data": {
                "t_data_fit": t_data_fit,
                "life_metric_data_fit": life_metric_data_fit,
            },
            "mechanisms": [mechanism for mechanism in mechanisms],
            "n_mechanisms": result["n_mechanisms"],
        }

        results_data.append(result_entry)

    return {
        "cell_name": cell_name,
        "results_data": results_data,
    }
