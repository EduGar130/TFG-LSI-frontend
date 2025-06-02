import { environment } from "../../environments/environment";

export const TOKEN_KEY = 'auth_token';
const API_URL = environment.apiUrl;

// Roles
export const ROLE_ADMIN = 'admin';
export const ROLE_MANAGER = 'manager';
export const ROLE_MARKETING = 'marketing';
export const ROLE_REPONEDOR = 'reponedor';

// Permisos
export const PERMISO_FULL_ACCESS = 'full_access';
export const PERMISO_VIEW_REPORTS = 'view_reports';
export const PERMISO_VIEW_STATS = 'view_stats';
export const PERMISO_MANAGE_INVENTORY = 'manage_inventory';
export const PERMISO_VIEW_INVENTORY = 'view_inventory';
export const PERMISO_VIEW_ALERTS = 'view_alerts';
export const PERMISO_MANAGE_TRANSACTIONS = 'manage_transactions';
export const PERMISO_CREATE_USERS = 'create_users';