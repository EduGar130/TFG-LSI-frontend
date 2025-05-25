import { User } from "../../auth/model/user.model";
import { Product } from "../../inventario/model/product.model";
import { Warehouse } from "../../inventario/model/warehouse.model";

export interface Transaction {
    id: number;
    product: Product;
    warehouse: Warehouse;
    user: User;
    type: TransactionType;
    quantity: number;
    description: string;
    createdAt: Date;
}

export enum TransactionType {
    ADD,
    REMOVE,
    SALE,
    NULL
}
