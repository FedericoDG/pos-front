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
  id?: number;
  name: string;
  lastname: string;
  email: string;
  roleId: number;
  logged?: boolean;
  password?: string;
  password2?: string;
  role?: Role;
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
  price?: number;
  stock?: number;
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
  products: Product[];
  createdAt: string;
  totalStock: number;
  totalStockPosta: number;
}

export interface Warehouse {
  id?: number;
  code: string;
  description: string;
  address: string;
  password?: string;
  password2?: string;
  driver: number;
  createdAt?: string;
  updatedAt?: string;
  stocks?: Stock[];
  user?: User;
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
  dischargeDetails?: DischargeDetails[];
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

export interface Transfer {
  id?: number;
  warehouseOriginId: number;
  warehouseDestinationId: number;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
  user: User;
  warehouseOrigin: Warehouse;
  warehouseDestination: Warehouse;
  transferDetails: TransferDetail[];
}

export interface TransferDetail {
  id?: number;
  transferId: number;
  productId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  products: Product;
}

export interface CashRegister {
  id?: number;
  openingDate: string;
  closingDate?: string;
  initialBalance: number;
  finalBalance: number;
  userId: number;
  isOpen?: boolean;
  createdAt?: string;
  updatedAt?: string;
  cash: number;
  debit: number;
  credit: number;
  transfer: number;
  mercadoPago: number;
  user?: User;
  cashMovements?: CashMovement[];
}

export interface CashMovement {
  id?: number;
  subtotal: number;
  discount: number;
  recharge: number;
  total: number;
  cashRegisterId: number;
  clientId: number;
  warehouseId: number;
  userId: number;
  paymentMethodId: number;
  info: string;
  createdAt?: string;
  updatedAt?: string;
  client?: Client;
  user?: User;
  warehouse?: Warehouse;
  paymentMethod?: PaymentMethod;
  cashMovementsDetails?: CashMovementsDetail[];
  paymentMethodDetails?: PaymentMethodDetails[];
}

export interface CashMovementsDetail {
  id?: number;
  cashMovementId: number;
  productId: number;
  price: number;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
  product?: Product;
}

export interface PaymentMethod {
  id?: number;
  code: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethodDetails {
  id?: number;
  cashMovementId: number;
  amount: number;
  paymentMethodId: number;
  createdAt: number;
  updatedAt: number;
  paymentMethod: PaymentMethod;
}
