import {
  Category,
  Client,
  Discharge,
  PriceList,
  Pricelists,
  Product,
  Purchase,
  Reason,
  Stock2,
  Supplier,
  Transfer,
  Unit,
  Warehouse,
} from '.';

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
