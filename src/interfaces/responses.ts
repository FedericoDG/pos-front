import {
  Afip,
  CashMovement,
  CashRegister,
  Category,
  Client,
  Discharge,
  IVACondition,
  Identification,
  InvoceType,
  IvaType,
  Movement,
  OtherTribute,
  PaymentMethod,
  PriceList,
  PriceList2,
  Pricelists,
  Product,
  ProductWithPrice,
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

type ClientWithTotal = Client & { total: number };
type UserWithTotal = User & { total: number };

export interface SettingsResponse {
  body: {
    settings: Settings;
  };
}

export interface AfipResponse {
  body: {
    afip: Afip;
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

export interface PriceListByIdResponse {
  body: {
    products: ProductWithPrice[];
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
    pricelists: Array<PriceList2[]>;
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

export interface BalanceResponse {
  body: {
    from: string;
    to: string;
    discounts: number;
    recharges: number;
    otherTributes: number;
    invoices: {
      invoiceAFIPCount: number;
      invoiceAFIPTotal: number;
      invoiceAFIPNCCount: number;
      invoiceAFIPNCTotal: number;
      invoiceNoAFIPCount: number;
      invoiceNoAFIPTotal: number;
      invoiceACount: number;
      invoiceATotal: number;
      invoiceBCount: number;
      invoiceBTotal: number;
      invoiceMCount: number;
      invoiceMTotal: number;
      invoiceXCount: number;
      invoiceXTotal: number;
      invoiceNCACount: number;
      invoiceNCATotal: number;
      invoiceNCBCount: number;
      invoiceNCBTotal: number;
      invoiceNCMCount: number;
      invoiceNCMTotal: number;
      invoiceNCXCount: number;
      invoiceNCXTotal: number;
    };
    incomes: {
      totalIncomes: number;
      totalCash: number;
      totalDebit: number;
      totalCredit: number;
      totalTransfer: number;
      totalMercadoPago: number;
    };
    outcomes: {
      purchases: number;
      destroys: number;
      totalOutcomes: number;
    };
    movements: Movement[];
    clients: ClientWithTotal[];
    users: UserWithTotal[];
    user?: User;
  };
}

export interface LibroIva {
  body: {
    from: string;
    to: string;
    totalSubTotal: number;
    totalIva: number;
    totalTotal: number;
    total0: number;
    total0025: number;
    total005: number;
    total0105: number;
    total021: number;
    total027: number;
    movements: {
      id: number;
      isCreditNote: boolean;
      subTotal: number;
      iva: number;
      total: number;
      invoceTypeId: number;
      posNumber: number;
      invoceNumberAfip: number;
      cae: string;
      vtoCae: string;
      creditNote: number;
      cbteTipo: number;
      info: string;
      ivaDetails: {
        '0': number;
        '0.21': number;
        '0.105': number;
        '0.025': number;
        '0.05': number;
        '0.27': number;
      };
      createdAt: string;
      client: Client;
    }[];
  };
}
