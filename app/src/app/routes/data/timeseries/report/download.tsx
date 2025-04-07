// Next
import dynamic from "next/dynamic";

// Components
const PDF = dynamic(() => import("@/app/components/report/pdf"), {
  ssr: false,
});

export const Download = () => {
  return <PDF />;
};
