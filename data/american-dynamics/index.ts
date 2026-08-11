import productsData from "./products.json";

export type MainSoftwareProduct = {
  "Part Number": string;
  "License Category": string;
  "System Level": string;
  "License Type": string;
  "Description": string;
};

export type SSAProduct = {
  "Part Number": string;
  "License Category": string;
  "System Level": string;
  "License Type": string;
  "License Validity": string;
  "Description": string;
};

export type RecorderProduct = {
  "Part Number": string;
  "Recorder type": string;
  "Channels": string;
  "Raw Storage": string;
  "Form Factor": string;
  "OS HDD on RAID": string;
  "Feature": string;
  "Description": string;
};

export type HardwareAddonProduct = {
  "Part Number": string;
  "Hardware Category": string;
  "Compatability": string;
  "Feature": string;
  "Description": string;
};

export const mainSoftware: MainSoftwareProduct[] = productsData.mainSoftware as MainSoftwareProduct[];
export const ssa: SSAProduct[] = productsData.ssa as SSAProduct[];
export const recorders: RecorderProduct[] = productsData.recorders as RecorderProduct[];
export const hardwareAddons: HardwareAddonProduct[] = productsData.hardwareAddons as HardwareAddonProduct[];
