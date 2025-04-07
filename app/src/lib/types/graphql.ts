export type GraphQLNodeT = {
  id: string;
  metatype_name: string;
};

export type GraphQLEdgeT = {
  origin_id: string;
  origin_metatype_name: string;
  destination_id: string;
  destination_metatype_name: string;
};

export type NodeResponseT = {
  data: {
    nodes: Array<GraphQLNodeT>;
  };
};

export type GraphQLResponse = {
  data: {
    graph: Array<any>;
  };
};

export type DeepLynxResponse = {
  data: {
    value: Array<any>;
  };
};
