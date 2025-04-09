/* eslint-disable @typescript-eslint/no-unused-expressions */
// Hooks
import { useNavigate } from "react-router";

// Store
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { warehouseActions } from "@/lib/store/features/warehouse";

export const Buttons = () => {
  // Router
  const navigate = useNavigate();

  // Store
  const category = useAppSelector((state) => state.warehouse.category);
  const type = useAppSelector((state) => state.warehouse.type);
  const batch = useAppSelector((state) => state.warehouse.batch);
  const cell = useAppSelector((state) => state.warehouse.cell);

  const storeDispatch = useAppDispatch();

  const handleBack = () => {
    // When the user clicks the back button, clear the state from the previous selection
    if (cell) {
      storeDispatch(warehouseActions.cell(undefined));
      storeDispatch(warehouseActions.batch(undefined));
      return;
    }
    if (batch) {
      storeDispatch(warehouseActions.batch(undefined));
      return;
    }
    if (type) {
      storeDispatch(warehouseActions.type(undefined));
      return;
    }
    if (category) {
      storeDispatch(warehouseActions.category(undefined));
    }
  };

  return (
    <>
      <div className="flex justify-items p-2">
        <button className="btn btn-sm" onClick={() => navigate("/")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="size-4"
          >
            <path d="M8.543 2.232a.75.75 0 0 0-1.085 0l-5.25 5.5A.75.75 0 0 0 2.75 9H4v4a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V9h1.25a.75.75 0 0 0 .543-1.268l-5.25-5.5Z" />
          </svg>
          Home
        </button>
        <div className="grow"></div>
        {category ? (
          <button className="btn btn-sm" onClick={handleBack}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="size-4"
            >
              <path
                fillRule="evenodd"
                d="M14 8a.75.75 0 0 1-.75.75H4.56l3.22 3.22a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 1.06L4.56 7.25h8.69A.75.75 0 0 1 14 8Z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </button>
        ) : null}
      </div>
    </>
  );
};

export default Buttons;
