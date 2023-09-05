import { Box, Stack } from '@chakra-ui/react';

import { CustomTable } from '../table';
import { useGetPriceListById } from '../../hooks';

import { useProductColumns } from './hooks/useProductColumns';

import { Basket, useUpdatePricePercentageContext } from '.';

export const ProductsTable = () => {
  const { priceList, cart } = useUpdatePricePercentageContext();
  const { data: products, refetch } = useGetPriceListById(priceList?.id!);

  const { columns } = useProductColumns();

  if (!products) return null;

  return (
    <Stack
      alignItems={cart.length === 0 ? 'center' : 'flex-start'}
      bg="white"
      direction="row"
      p="4"
      rounded="md"
      shadow="md"
    >
      <Box width="64%">
        <CustomTable
          showGlobalFilter
          showNavigation
          amount={products.length}
          columns={columns}
          data={products}
          flag="products"
        />
      </Box>
      <Basket products={products} refetch={refetch} />
    </Stack>
  );
};

export default ProductsTable;
