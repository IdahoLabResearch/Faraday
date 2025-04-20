// Hooks
import { useState } from "react";
import { useNavigate } from "react-router";

// Functions
import { Login } from "@/lib/client/auth";

// Store
import { useAppDispatch } from "@/lib/store/hooks";
import { warehouseActions } from "@/lib/store/features/warehouse";

// Types
import { UserT } from "@/lib/types/warehouse";

const Auth = () => {
  // Hooks
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Stores
  const storeDispatch = useAppDispatch();

  // Router
  const navigate = useNavigate();

  const authenticate = async () => {
    const user: UserT = await Login(username, password);

    if (user) {
      storeDispatch(warehouseActions.user(user));
      navigate("/data");
    }
  };

  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center">
        <label className="input">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input
            type="email"
            placeholder="Email"
            required
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
        </label>
        <br />
        <label className="input">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
              <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
            </g>
          </svg>
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </label>
        <br />
        <div className="prose justify-center items-center flex flex-col">
          <button
            className="btn btn-accent btn-xs w-1/2"
            onClick={() => {
              authenticate();
            }}
          >
            Authenticate
          </button>
          <br />
          <small>Developed by Digital Engineering</small>
        </div>
      </div>
    </>
  );
};

export default Auth;
