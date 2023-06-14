import { Box } from '@chakra-ui/react';

import { DashBoard } from '../componets/common';
import { Loading } from '../componets/common';
import { PriceListProvider } from '../componets/pricelistreport/context';
import { useGetProducts, useGetWarehouses } from '../hooks';

export const Purchases = () => {
  const { data: products, isFetching: isFetchingProducts } = useGetProducts();
  const { data: warehouses, isFetching: isFetchingWarehouses } = useGetWarehouses();

  const isIndeterminate = isFetchingProducts || isFetchingWarehouses;

  return (
    <PriceListProvider>
      <DashBoard isIndeterminate={isIndeterminate} title="Compras">
        {!products || !warehouses ? <Loading /> : <Box w="1080px" />}
        <p>Compras</p>
      </DashBoard>
    </PriceListProvider>
  );
};
