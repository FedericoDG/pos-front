import { Box, Stack, useDisclosure } from '@chakra-ui/react';
import { useRef, useState } from 'react';

import { CustomTable } from '../table';
import { useMyContext } from '../../context';
import { useGetPriceListByWarehouseId } from '../../hooks';

import { useProductColumns } from './hooks/useProductColumns';

import { Basket, CartItem, Modal, usePosContext } from '.';

export const ProductsTable = () => {
  const { priceList, warehouse, cart } = usePosContext();
  const { data: products, refetch } = useGetPriceListByWarehouseId(priceList?.id!, warehouse?.id!);
  const { user, tableInput } = useMyContext();

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
          amount={
            user.role?.id !== 4
              ? products.length
              : products.filter((product) => product.stock! > 0).length
          }
          columns={columns}
          data={user.role?.id !== 4 ? products : products.filter((product) => product.stock! > 0)}
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
      <Basket refetch={refetch} />
    </Stack>
  );
};

export default ProductsTable;
