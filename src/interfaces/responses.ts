import {
  CashMovement,
  CashRegister,
  Category,
  Client,
  Discharge,
  IVACondition,
  Identification,
  InvoceType,
  IvaType,
  OtherTribute,
  PaymentMethod,
  PriceList,
  Pricelists,
  Product,
  Purchase,
  Reason,
  Role,
  Settings,
  Stock2,
  Supplier,
  Transfer,
  Unit,
  User,
  Warehouse,
} from '.';

export interface SettingsResponse {
  body: {
    settings: Settings;
  };
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

export interface PriceListResponse {
  body: {
    pricelist: Pricelists;
  };
}
export interface PriceListByWareIdResponse {
  body: {
    pricelist: PriceList;
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

export interface StocksResponse {
  body: {
    stocks: Stock2[];
  };
}
export interface StockResponse {
  body: {
    stocks: Stock2[];
  };
}

export interface DischargesResponse {
  body: {
    discharges: Discharge[];
  };
}

export interface DischargesResponse {
  body: {
    discharges: Discharge[];
  };
}

export interface DischargeResponse {
  body: {
    discharge: Discharge;
  };
}

export interface ReasonsResponse {
  body: {
    reasons: Reason[];
  };
}

export interface ReasonResponse {
  body: {
    reason: Reason;
  };
}

export interface PurchasesResponse {
  body: {
    purchases: Purchase[];
  };
}

export interface PurchaseResponse {
  body: {
    purchase: Purchase;
  };
}

export interface TransfersResponse {
  body: {
    transfers: Transfer[];
  };
}

export interface TransferResponse {
  body: {
    transfer: Transfer;
  };
}

export interface CashRegistersResponse {
  body: {
    cashRegisters: CashRegister[];
  };
}

export interface CashRegisterResponse {
  body: {
    cashRegister: CashRegister;
  };
}

export interface PaymentMethodsResponse {
  body: {
    paymentMethods: PaymentMethod[];
  };
}

export interface CashMovementsResponse {
  body: {
    cashMovements: CashMovement[];
  };
}

export interface CashMovementResponse {
  body: {
    cashMovement: CashMovement;
  };
}

export interface UserResponse {
  body: {
    user: User;
  };
}

export interface UsersResponse {
  body: {
    users: User[];
  };
}

export interface RoleResponse {
  body: {
    role: Role;
  };
}

export interface RolesResponse {
  body: {
    roles: Role[];
  };
}

export interface IVAConditionResponse {
  body: {
    ivaConditions: IVACondition[];
  };
}

export interface IdentificationsResponse {
  body: {
    identifications: Identification[];
  };
}

export interface IvaTypesResponse {
  body: {
    ivaTypes: IvaType[];
  };
}

export interface InvoceTypesResponse {
  body: {
    invoceTypes: InvoceType[];
  };
}

export interface OtherTributesResponse {
  body: {
    otherTributes: OtherTribute[];
  };
}
