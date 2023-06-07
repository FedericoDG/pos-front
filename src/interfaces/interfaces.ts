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

/* export interface Product {
  id?: number;
  code: string;
  barcode: string;
  name: string;
  status: string;
  allownegativestock: string;
  description: string | null;
  categoryId: number;
  unitId: number;
  totalStock?: number;
  createdAt?: string;
  updatedAt?: string;
  units?: Unit;
  categories?: Category;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  products: Product[];
}

export interface Unit {
  id: number;
  code: string;
  name: string;
  createdAt: string;
  updatedAt: string;
} */

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
  totalStock?: number;
  createdAt?: string;
  updatedAt?: string;
  unit?: Unit;
  category?: Category;
  stocks?: Stock[];
  prices?: Array<Price | null>;
  priceDetails?: Array<Price[]>;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  code?: string;
}

export interface Unit {
  id: number;
  code: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Price {
  id: number;
  productId: number;
  pricelistId: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  products: Product;
  pricelists: Pricelists;
}

export interface Pricelists {
  code: string;
  description: string;
  createdAt: string;
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
  warehouses: Warehouses;
}

export interface Warehouses {
  id: number;
  code: string;
  description: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}
