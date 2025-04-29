// react-pdf
import { Document, Page, Text, View, Image } from "@react-pdf/renderer";

// Styles
import { styles } from "./styles";

// Types
import { NodeT } from "@/lib/types/warehouse";

type PropsT = {
  imgsrc: Array<{ node: NodeT; data: string }>;
};

function Report(props: PropsT) {
  const imgsrc = props.imgsrc;

  return (
    <Document author="Idaho National Laboratory">
      <Page style={styles.page}>
        <View>
          <Text style={styles.header}>Faraday Report</Text>
          {imgsrc.length
            ? imgsrc.map((img) => {
                return (
                  <View key={img.node.name}>
                    <Text>{img.node.name}</Text>
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
