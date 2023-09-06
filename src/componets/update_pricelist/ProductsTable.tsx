import { Box, Stack, useDisclosure } from '@chakra-ui/react';
import { useRef, useState } from 'react';

import { CustomTable } from '../table';
import { useGetPriceListById } from '../../hooks';
import { useMyContext } from '../../context';

import { useProductColumns } from './hooks/useProductColumns';

import { Basket, CartItem, Modal, useUpdatePriceContext } from '.';

export const ProductsTable = () => {
  const { priceList, cart } = useUpdatePriceContext();
  const { data: products } = useGetPriceListById(priceList?.id!);
  const { tableInput } = useMyContext();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const cancelRef = useRef<HTMLInputElement | null>(null);

  const [activeProduct, setActiveProduct] = useState({} as CartItem);

  const { columns } = useProductColumns({ onOpen, setActiveProduct });

  const handleClose = () => {
    setActiveProduct({} as CartItem);
    onClose();
    tableInput.current.select();
  };

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
        <Modal
          activeProduct={activeProduct}
          cancelRef={cancelRef}
          handleClose={handleClose}
          isOpen={isOpen}
          setActiveProduct={setActiveProduct}
          tableInput={tableInput}
        />
      </Box>
      <Basket />
    </Stack>
  );
};

export default ProductsTable;
