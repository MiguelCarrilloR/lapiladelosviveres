// types/SaleTypes.ts
import { Product } from './ProductTypes';

export interface SaleProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Sale {
  _id: string;
  products: SaleProduct[];
  totalPrice: number;
  date: Date;
}

export interface SaleContextType {
  sales: Sale[];
  loading: boolean;
  error: string | null;
  addSale: (sale: Omit<Sale, '_id' | 'date'>) => Promise<void>;
  fetchSales: () => Promise<void>;
}