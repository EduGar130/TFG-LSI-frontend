import { Role } from "./role.model";
import { Warehouse } from "../../inventario/model/warehouse.model";

export interface User {
    id: number;
    username: string;
    email: string;
    role: Role;
    passwordHash?: string;
    warehouse: Warehouse | null;
}