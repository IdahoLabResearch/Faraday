// Functions
import { FetchToken } from "../api/client";

// Hooks
import { createContext, useContext, useEffect } from "react";

// Store
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { deeplynxActions } from "../store/features/deeplynx";

let TokenContext = createContext<string | undefined>(undefined);

export default function TokenProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = useAppSelector((state) => state.deeplynx.token);
  const storeDispatch = useAppDispatch();

  useEffect(() => {
    const fetch = async () => {
      await await FetchToken().then((token) => {
        storeDispatch(deeplynxActions.token(token));
      });
    };

    if (!token) {
      fetch();
    }
  }, [storeDispatch, token]);

  return (
    <TokenContext.Provider value={token}>{children}</TokenContext.Provider>
  );
}

export const useToken = () => {
  return useContext(TokenContext);
};
