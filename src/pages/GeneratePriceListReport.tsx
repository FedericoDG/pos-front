import { Box } from '@chakra-ui/react';

import { CustomTable } from '../componets/table';
import { DashBoard } from '../componets/common';
import { Loading } from '../componets/common';
import {
  usePriceListsColumns,
  useProductColumns,
  useWarehousesColumns,
} from '../componets/pricelist_report/hooks';
import { PriceListProvider } from '../componets/pricelist_report/context';
import { StepperWrapper, Stepper, MakeRequest } from '../componets/pricelist_report';
import { useGetPriceLists, useGetProducts, useGetWarehouses } from '../hooks';

export const GeneratePriceListReport = () => {
  const { data: products, isFetching: isFetchingProducts } = useGetProducts();
  const { data: priceLists, isFetching: isFetchingPriceLists } = useGetPriceLists();
  const { data: warehouses, isFetching: isFetchingWarehouses } = useGetWarehouses();

  const isIndeterminate = isFetchingProducts || isFetchingPriceLists || isFetchingWarehouses;

  const { columns } = useProductColumns();
  const { columns: priceListColumns } = usePriceListsColumns();
  const { columns: warehouseColumns } = useWarehousesColumns();

  return (
    <PriceListProvider>
      <DashBoard isIndeterminate={isIndeterminate} title="Listas de Precios / Generar Reporte">
        <Stepper />

        {!products || !priceLists || !warehouses ? (
          <Loading />
        ) : (
          <Box bg="white" p="4" rounded="md" shadow="md" w="full">
            <StepperWrapper step={1}>
              <CustomTable
                showGlobalFilter
                showNavigation
                showSelectButton
                amount={products.length}
                columns={columns}
                data={products}
                flag="products"
              />
            </StepperWrapper>
            <StepperWrapper step={2}>
              <CustomTable
                showGlobalFilter
                showNavigation
                showSelectButton
                amount={priceLists.length}
                columns={priceListColumns}
                data={priceLists}
                flag="priceLists"
              />
            </StepperWrapper>
            <StepperWrapper step={3}>
              <CustomTable
                showGlobalFilter
                showNavigation
                showSelectButton
                amount={warehouses.length}
                columns={warehouseColumns}
                data={warehouses}
                flag="warehouses"
              />
            </StepperWrapper>
            <StepperWrapper step={4}>
              <MakeRequest />
            </StepperWrapper>
          </Box>
        )}
      </DashBoard>
    </PriceListProvider>
  );
};
