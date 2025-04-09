// Hooks
import { useEffect } from "react";
import { useNavigate } from "react-router";

// Store
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { uxActions } from "@/lib/store/features/ux";

// Components
import Explorer from "./sidebar/Explorer";
import Compare from "./timeseries/report/compare";

// Types
import { CellT, UserT } from "@/lib/types/warehouse";

export default function Visualizer({
  children,
}: {
  children: React.ReactNode;
}) {
  // Hooks
  const navigate = useNavigate();
  const user: UserT | undefined = useAppSelector(
    (state) => state.warehouse.user
  );

  // Store
  const storeDispatch = useAppDispatch();
  const snackbar: boolean = useAppSelector((state) => state.ux.snackbar);
  const drawer: boolean = useAppSelector((state) => state.ux.drawer);
  const cell: CellT | undefined = useAppSelector(
    (state) => state.warehouse.cell
  );

  // Handlers
  const handleFab = () => {
    storeDispatch(uxActions.snackbar(!snackbar));
  };

  // Retrieve a token
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [navigate, user]);

  return user ? (
    <div>
      <div className="drawer">
        <input
          id="my-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={drawer}
          onChange={() => storeDispatch(uxActions.drawer(!drawer))}
        />
        <div className="drawer-content">
          {/* Page content here */}
          <div className="navbar bg-base-300">
            <label htmlFor="my-drawer" className="btn btn-sm drawer-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-4"
              >
                <path
                  fillRule="evenodd"
                  d="M2 3.75A.75.75 0 0 1 2.75 3h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 3.75ZM2 8a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 8Zm0 4.25a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
          </div>
          {children}
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          {/* Sidebar content here */}
          <Explorer />
        </div>
      </div>
      {!snackbar ? (
        <>
          {cell ? (
            <div className="absolute -z-10 left-0 bottom-0 p-5">
              <button className="btn btn-accent" onClick={handleFab}>
                Compare
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <Compare />
      )}
    </div>
  ) : (
    <div className="h-screen w-screen flex justify-center align-center">
      <div className="prose">
        <small>Authenticating</small>
      </div>
    </div>
  );
}
