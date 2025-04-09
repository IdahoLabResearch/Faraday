// Environment
const base = import.meta.env.VITE_DJANGO_PROXY;

// Types
import { UserT } from "@/lib/types/warehouse";

export const Login = async (user: string, password: string) => {
  return await fetch(`${base}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user: user, password: password }),
  }).then(async (response) => {
    const auth: { data: UserT } = await response.json();
    return auth.data;
  });
};
