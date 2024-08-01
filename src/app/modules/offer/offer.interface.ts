type IPackage = {
  internet?: string;
  voice?: string;
};

export type IOffer = {
  operator: string;
  package: IPackage;
  banner: string;
  discountPercentage?: string;
  regularPrice: string;
  duration: string;
  termsAndConditions: string[];
};
