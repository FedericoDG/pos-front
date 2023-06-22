export enum ActionType {
  LOGIN,
  LOGOUT,
}

export interface Actions {
  type: ActionType;
  payload: {
    user: User;
  };
}

export interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  roleId: number;
  logged: boolean;
  role: Role;
}

export interface Role {
  id: number;
  name: string;
  description: string | null;
}

export interface Product {
  id?: number;
  code: string;
  barcode: string;
  name: string;
  status: string;
  allownegativestock: string;
  description: string;
  categoryId: number;
  unitId: number;
  alertlowstock: string;
  lowstock: number;
  totalStock?: number;
  createdAt?: string;
  updatedAt?: string;
  unit?: Unit;
  category?: Category;
  stocks?: Stock[];
  prices?: Array<Price | null>;
  priceDetails?: Array<Price[]>;
  costs?: Cost[];
}

export interface Category {
  id?: number;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Unit {
  id?: number;
  code: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Price {
  id?: number;
  productId: number;
  pricelistId: number;
  price: number;
  createdAt?: string;
  updatedAt?: string;
  products?: Product;
  pricelists?: Pricelists;
}

export interface Pricelists {
  id?: number;
  code: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PriceList {
  id?: number;
  price: number;
  productId: number;
  pricelistId: number;
  pricelists: Pricelists;
  products: Product;
  createdAt: string;
  totalStock: number;
  totalStockPosta: number;
}

export interface Warehouse {
  id?: number;
  code: string;
  description: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
  stocks?: Stock[];
}

export interface Stock {
  id: number;
  productId: number;
  warehouseId: number;
  stock: number;
  prevstock: number;
  prevdate: string;
  createdAt: string;
  updatedAt: string;
  products: Product[];
  warehouse: Warehouse;
}

export interface Stock2 {
  id: number;
  productId: number;
  warehouseId: number;
  stock: number;
  prevstock: number;
  prevdate: string;
  createdAt: string;
  updatedAt: string;
  products: Product;
  warehouse: Warehouse;
}

export interface Cost {
  price: number;
  productId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id?: number;
  name: string;
  lastname: string;
  document: string;
  email: string;
  password: string;
  password2?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  info?: string;
  roleId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Supplier {
  id?: number;
  cuit: string;
  name: string;
  email?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  info?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Discharge {
  id?: number;
  productId: number;
  warehouseId: number;
  quantity: number | string;
  cost: number | string;
  unit: string;
  info?: string;
  createdAt?: string;
  updatedAt?: string;
  reasonId?: number;
  products?: Product;
  reason?: Reason;
  warehouses?: Warehouse;
  user?: User;
  dischargeDetails: DischargeDetails[];
}

export interface DischargeDetails {
  id?: number;
  dischargeId: number;
  productId: number;
  quantity: number;
  cost: number;
  reasonId: number;
  info: string;
  createdAt?: string;
  updatedAt?: string;
  products?: Product;
  reason: Reason;
}

export interface Reason {
  id: number;
  reason: string;
  createdAt: string;
  updatedAt: string;
}

export interface Purchase {
  id: number;
  supplierId: number;
  warehouseId: number;
  total: number;
  date: string;
  driver: string;
  transport: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  supplier?: Supplier;
  user?: User;
  warehouse?: Warehouse;
  purchaseDetails?: PurchaseDetail[];
}

export interface PurchaseDetail {
  id: number;
  purchaseId: number;
  productId: number;
  price: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: Product;
}
