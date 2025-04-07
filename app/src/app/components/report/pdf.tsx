// react-pdf
import { PDFDownloadLink } from "@react-pdf/renderer";

// pdf
import Report from "./report";

// Store
import { useAppSelector } from "@/lib/store/hooks";

function PDF() {
  const imgsrc: Array<{ cell: string; data: string }> = useAppSelector(
    (state) => state.report.charts
  );

  return (
    <>
      <PDFDownloadLink
        document={<Report imgsrc={imgsrc} />}
        fileName="Faraday.pdf"
      >
        {<button className="btn btn-accent btn-sm">Generate Report</button>}
      </PDFDownloadLink>
    </>
  );
}

export default PDF;
