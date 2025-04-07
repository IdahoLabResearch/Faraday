const server = import.meta.env.VITE_DJANGO_PROXY;

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
    return error;
  }
};
