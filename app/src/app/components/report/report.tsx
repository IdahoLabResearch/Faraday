// react-pdf
import { Document, Page, Text, View, Image } from "@react-pdf/renderer";

// Styles
import { styles } from "./styles";

type PropsT = {
  imgsrc: Array<{ cell: string; data: string }>;
};

function Report(props: PropsT) {
  const imgsrc = props.imgsrc;

  return (
    <Document author="Idaho National Laboratory">
      <Page style={styles.page}>
        <View>
          <Text style={styles.header}>Faraday Report</Text>
          {imgsrc
            ? imgsrc.map((img) => {
                return (
                  <View key={img.cell}>
                    <Text>{img.cell}</Text>
                    <Image src={img.data} />
                  </View>
                );
              })
            : null}
        </View>
      </Page>
    </Document>
  );
}

export default Report;
