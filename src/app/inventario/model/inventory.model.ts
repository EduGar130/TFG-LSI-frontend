import { Product } from "./product.model";
import { Warehouse } from "./warehouse.model";

export interface Inventory {
    id: number;
    product: Product;
    warehouse: Warehouse;
    quantity: number;
  }