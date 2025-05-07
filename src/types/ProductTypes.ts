// types/ProductTypes.ts

export interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  sizeProduct: string;
  imageUrl?: string;
}

export interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, '_id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  fetchProducts: () => Promise<void>;
}