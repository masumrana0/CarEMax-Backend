export type IJobCategory = {
  label: string;
  value: string;
  subOption: {
    label: string;
    value: string;
    minCost: number;
  };
};
