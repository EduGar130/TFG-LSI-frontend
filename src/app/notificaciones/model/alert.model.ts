import { Product } from "../../inventario/model/product.model";
import { Warehouse } from "../../inventario/model/warehouse.model";

export interface Alert {
    id: number;
    product: Product;
    warehouse: Warehouse;
    alertType: string;
    message: string;
    createdAt: Date;
}