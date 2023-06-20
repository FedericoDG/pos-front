import { Box, Stack } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

import { DashBoard } from '../componets/common';
import { Loading } from '../componets/common';
import {
  SelectSupplierAndWarehouse,
  PurchasesProvider,
  ProductsTable,
  Basket,
  SelectedWarehouse,
  SelectedSupplier,
} from '../componets/purchases';
import { useGetProductsWOStock, useGetSuppliers, useGetWarehousesWOStock } from '../hooks';

export const Purchases = () => {
  const { data: products, isFetching: isFetchingProducts } = useGetProductsWOStock();
  const { data: warehouses, isFetching: isFetchingWarehouses } = useGetWarehousesWOStock();
  const { data: suppliers, isFetching: isFetchingSuppliers } = useGetSuppliers();

  const isIndeterminate = isFetchingProducts || isFetchingSuppliers || isFetchingWarehouses;

  const [mappedSuppliers, setMappedSuppliers] = useState<SelectedSupplier[]>([]);
  const [mappedWarehouses, setMappedWarehouses] = useState<SelectedWarehouse[]>([]);

  useEffect(() => {
    if (!suppliers || !warehouses) return;

    const mappedSuppliers = suppliers.map((el) => ({
      ...el,
      value: el.id,
      label: `${el.cuit} - ${el.name}`,
    }));
    const mappedWarehouses = warehouses.map((el) => ({ ...el, value: el.id, label: el.code }));

    setMappedSuppliers(mappedSuppliers);
    setMappedWarehouses(mappedWarehouses);
  }, [products, suppliers, warehouses]);

  return (
    <PurchasesProvider>
      <DashBoard isIndeterminate={isIndeterminate} title="Compras">
        {!products || !suppliers || !warehouses ? (
          <Loading />
        ) : (
          <Box color="black" w="1080px">
            <SelectSupplierAndWarehouse
              mappedSuppliers={mappedSuppliers}
              mappedWarehouses={mappedWarehouses}
            />
            <Stack alignItems="flex-start" direction="row" gap="4">
              <ProductsTable products={products} />
              <Basket />
            </Stack>
          </Box>
        )}
      </DashBoard>
    </PurchasesProvider>
  );
};
