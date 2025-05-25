import { Category } from "./category.model";

export interface Product {
    id: number;
    name: string;
    sku: string;
    description: string;
    price: number;
    stockAlertThreshold: number;
    category: Category;
  }