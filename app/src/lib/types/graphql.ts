export type NodeResponseT = {
  id: string;
  original_id: string;
  metatype_id: string;
  metatype_name: string;
  properties: {
    [key: string]: any;
  };
  data_source_id: string;
};

export type EdgeResponseT = {
  origin_id: string;
  origin_metatype_name: string;
  relationship_name: string;
  destination_id: string;
  destination_metatype_name: string;
  destination_properties: {
    id: string;
    [key: string]: any;
  };
  edge_direction: string;
};
