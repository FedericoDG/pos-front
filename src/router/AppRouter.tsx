import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import {
  CashRegisterDetails,
  CashRegisters,
  CashRegisterStatus,
  Categories,
  Clients,
  CloseCashRegister,
  DischargeDetails,
  Discharges,
  DriverDetails,
  Drivers,
  GeneratePriceListReport,
  Home,
  LoadCosts,
  LoadDischarges,
  LoadProductTrans,
  LoadProductTransDriver,
  LoadPurchase,
  Login,
  Pos,
  PriceListReport,
  PriceLists,
  ProductDetails,
  Products,
  PurchaseDetails,
  Purchases,
  SaleDetails,
  Settings,
  Stocks,
  Suppliers,
  TransferDetails,
  Transfers,
  TransfersDriver,
  Units,
  UpdatePriceListPercentage,
  UserProfile,
  Users,
  Warehouses,
} from '../pages';

import { PrivateRoute, PublicRoute } from './';

export const AppRouter = () => (
  <Router>
    <Routes>
      <Route element={<PrivateRoute />} path="/panel">
        {/* HOME */}
        <Route index element={<Home />} path="/panel" />
        {/* PRODUCTS */}
        <Route element={<Products />} path="/panel/productos" />
        <Route element={<ProductDetails />} path="/panel/productos/detalles/:id" />
        <Route element={<Categories />} path="/panel/productos/categorias" />
        <Route element={<Units />} path="/panel/productos/unidades" />
        <Route element={<LoadCosts />} path="/panel/productos/costos" />
        {/* STOCK */}
        <Route element={<Stocks />} path="/panel/stock" />
        <Route element={<Purchases />} path="/panel/stock/compras/" />
        <Route element={<PurchaseDetails />} path="/panel/stock/compras/detalles/:id" />
        <Route element={<LoadPurchase />} path="/panel/stock/compras/cargar" />
        <Route element={<Discharges />} path="/panel/stock/bajas" />
        <Route element={<DischargeDetails />} path="/panel/stock/bajas/detalles/:id" />
        <Route element={<LoadDischarges />} path="/panel/stock/bajas/cargar" />
        <Route element={<Warehouses />} path="/panel/stock/depositos" />
        <Route element={<Transfers />} path="/panel/stock/transferencias" />
        <Route element={<TransferDetails />} path="/panel/stock/transferencias/detalles/:id" />
        <Route element={<LoadProductTrans />} path="/panel/stock/transferencias/crear" />
        <Route element={<TransfersDriver />} path="/panel/stock/transferencias-choferes" />
        <Route
          element={<LoadProductTransDriver />}
          path="/panel/stock/transferencias-choferes/crear"
        />
        <Route
          element={<GeneratePriceListReport />}
          path="/panel/lista-de-precios/generar-reporte"
        />
        {/* PRICELISTS */}
        <Route element={<PriceLists />} path="/panel/lista-de-precios/" />
        <Route element={<PriceListReport />} path="/panel/lista-de-precios/reporte" />
        <Route
          element={<UpdatePriceListPercentage />}
          path="/panel/lista-de-precios/actualizar-porcentaje"
        />
        {/* CLIENTS */}
        <Route element={<Clients />} path="/panel/clientes" />
        {/* SUPPLIERS */}
        <Route element={<Suppliers />} path="/panel/proveedores" />
        {/* DRIVERS */}
        <Route element={<Drivers />} path="/panel/choferes" />
        <Route element={<DriverDetails />} path="/panel/choferes/detalles/:id" />
        {/* POS */}
        <Route element={<Pos />} path="/panel/pos" />
        {/* CASH REGISTER */}
        <Route element={<CashRegisters />} path="/panel/caja" />
        <Route element={<CashRegisterStatus />} path="/panel/caja/estado" />
        <Route element={<CashRegisterDetails />} path="/panel/caja/detalles/:id" />
        <Route element={<CloseCashRegister />} path="/panel/caja/detalles/:id/cerrar" />
        <Route element={<SaleDetails />} path="/panel/caja/detalles/venta/:id" />
        {/* USERS */}
        <Route element={<Users />} path="/panel/usuarios" />
        <Route element={<UserProfile />} path="/panel/usuarios/perfil" />
        {/* SETTINGS */}
        <Route element={<Settings />} path="/panel/parametros" />
        {/* DEFAULT */}
        <Route element={<Navigate replace to="/panel" />} path="*" />
      </Route>
      <Route element={<PublicRoute />} path="/">
        <Route element={<Login />} path="/" />
      </Route>
    </Routes>
  </Router>
);
