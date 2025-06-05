import { Product } from "../../inventario/model/product.model";
import { Warehouse } from "../../inventario/model/warehouse.model";

export interface Alert {
    activa: any;
    id: number;
    product: Product;
    warehouse: Warehouse;
    alertType: string;
    message: string;
    createdAt: Date;
}