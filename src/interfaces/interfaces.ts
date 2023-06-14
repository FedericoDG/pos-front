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
  name?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  info?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductResponse {
  body: {
    product: Product;
  };
}

export interface ProductsResponse {
  body: {
    products: Product[];
  };
}

export interface CategoryResponse {
  body: {
    category: Category;
  };
}

export interface CategoriesResponse {
  body: {
    categories: Category[];
  };
}

export interface UnitResponse {
  body: {
    unit: Unit;
  };
}

export interface UnitsResponse {
  body: {
    units: Unit[];
  };
}

export interface ClientResponse {
  body: {
    client: Client;
  };
}
export interface ClientsResponse {
  body: {
    clients: Client[];
  };
}
export interface PriceListsResponse {
  body: {
    pricelists: Pricelists[];
  };
}

export interface WarehouseResponse {
  body: {
    warehouse: Warehouse;
  };
}

export interface SupplierResponse {
  body: {
    supplier: Supplier;
  };
}

export interface SuppliersResponse {
  body: {
    suppliers: Supplier[];
  };
}

export interface WarehousesResponse {
  body: {
    warehouses: Warehouse[];
  };
}

export interface PriceListReportResponse {
  body: {
    pricelists: Array<PriceList[]>;
  };
}
