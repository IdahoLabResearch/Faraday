export type OntologyT = {
  id: number;
  name: string;
};

export type NodeT = {
  id: number;
  name: string;
  cls_id: number;
  ontology_id: number;
  root: boolean;
};

export type GraphT = {
  name: string;
  cls: string;
  ontology: string;
  parent: string;
  children: Array<GraphT>;
};

export type UserT = {
  id: number;
  last_login: Date;
  is_superuser: boolean;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: Date;
  data_sources: Array<number>;
  groups: Array<string>;
  user_permissions: Array<string>;
};
