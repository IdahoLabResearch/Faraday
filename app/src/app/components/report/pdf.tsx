// react-pdf
import { PDFDownloadLink } from "@react-pdf/renderer";

// pdf
import Report from "./report";

// Store
import { useAppSelector } from "@/lib/store/hooks";

// Types
import { NodeT } from "@/lib/types/warehouse";

function PDF() {
  const imgsrc: Array<{ node: NodeT; data: string }> = useAppSelector(
    (state) => state.report.charts
  );

  return (
    <>
      {imgsrc.length ? (
        <PDFDownloadLink
          key={"pdf"}
          document={<Report imgsrc={imgsrc} />}
          fileName="Faraday.pdf"
        >
          {<button className="btn btn-accent btn-sm">Generate Report</button>}
        </PDFDownloadLink>
      ) : null}
    </>
  );
}

export default PDF;
