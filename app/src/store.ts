import { defineStore } from "pinia";
import {
  DesignRoot,
  DisplayType,
  Register,
  RegisterDescriptionFile,
  RegisterField,
} from "src/types";
import parse from "src/parse";

export const useStore = defineStore("store", {
  state: () => {
    return {
      // Object representing info about the overall design (e.g. name, version, and root elements)
      root: {} as DesignRoot,

      // A map of id : Register for elements (reg/blk/mem) in the design
      elements: new Map<string, Register>(),

      // Whether or not store.load() has been called successfully
      loaded: false,

      // URL where the Register Description File was loaded from ("" for local files)
      url: "",

      // Whether or not to display the register value as byte swapped in RegLayout
      useByteSwap: false,

      // Which display type to show field and register values as in RegLayout
      selectedDisplayType: "hexadecimal" as DisplayType,
    };
  },
  actions: {
    // Returns the first element in elements that has type "reg"
    getFirstRegister() {
      for (const key of this.elements.keys()) {
        if (this.elements.get(key)?.type == "reg") {
          return key;
        }
      }

      return "";
    },

    // Try to get data from a url and call load() with that data
    // Return true on successful load and false if load fails
    async loadUrl(url: string) {
      try {
        const result = await fetch(url);
        const data = await result.json();
        await this.load(data, url);
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    },

    // Try load the store by parsing the provided JSON string
    // Return true on successful load and false if load fails
    async loadFile(jsonString: string) {
      try {
        const data = await JSON.parse(jsonString);
        await this.load(data);
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    },

    // Parse JSON data and populate the store variables
    async load(data: RegisterDescriptionFile, url = "") {
      for (const element of Object.values(data.elements)) {
        const fields = element.fields;

        // Set the field.value to be a Bit[] that represents the field.reset or 0
        fields?.forEach((field: RegisterField) => {
          if (field.reset) {
            field.value = parse.stringToBitArray(
              field.reset.toString(),
              field.nbits
            );
          } else {
            field.value = parse.stringToBitArray("0", field.nbits);
          }
        });
      }

      this.elements = new Map<string, Register>();
      for (const key of Object.keys(data.elements)) {
        this.elements.set(key, data.elements[key] as Register);
      }

      this.root = data.root;
      this.url = url;
      this.loaded = true;
    },
  },
});
