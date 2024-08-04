export type IProduct = {
  category: string;
  title: string;
  warranty: string;
  emi?: string;
  price: string;
  company: string;
  photo: string;
  status?: 'in stock' | 'out of stock';
};
