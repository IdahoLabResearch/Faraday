const server = import.meta.env.VITE_DJANGO_PROXY!;

export const Login = async (user: string, password: string) => {
  try {
    const response = await fetch(`${server}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: user, password: password }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const auth = await response.json();
    return auth;
  } catch (error) {
    console.log("Error: " + error);
    return error;
  }
};

export const FetchDRT = async (data: Array<any>, sweeps: Array<any>) => {
  try {
    const response = await fetch(`${server}/api/pydrt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data, sweeps }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const drt = await response.json();
    return drt;
  } catch (error) {
    console.log("Error: " + error);
    return error;
  }
};

export const SigmoidRegression = async (cell: string, data: Array<any>) => {
  try {
    const response = await fetch(`${server}/api/sigmoid`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cell: cell,
        data: data,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    console.log("Error: " + error);
    return error;
  }
};

export const LinearRegression = async (data: Array<any>) => {
  try {
    const response = await fetch(`${server}/api/statistics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    console.log("Error: " + error);
    return error as Error;
  }
};
