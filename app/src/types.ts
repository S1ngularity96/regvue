// Interface representing the attributes of the root project description
export interface DesignRoot {
  display_name: string;
  links: {
    [key: string]: string;
  };
  version: string;
  children: string[];
}

// Interface representing the fields on a specific register
export interface RegisterField {
  access: string;
  doc: string;
  lsb: number;
  name: string;
  nbits: number;
  reset: number;
}

// Interface representing a register entry
export interface Register {
  display_name: string;
  version?: string;
  links: Map<string, string>;
  children: string[];
  id: string;
  doc: string;
  type: string;
  name: string;
  addr: number;
  offset: number;
  fields?: RegisterField[];
}

// Interface representing the fields necessary for a menu node
export interface MenuNode {
  key: string;
  styleClass: string;
  children?: MenuNode[];
  data: {
    name: string;
    addr: string;
  };
  depth?: number;
  isVisible?: boolean;
}

// Interface representing the overall sharedState object exported from store.ts
export interface SharedState {
  data: {
    root: DesignRoot;
    elements: {
      [key: string]: Register;
    };
  };
  fields: Map<string, string>;
  nodes: MenuNode[];
}
