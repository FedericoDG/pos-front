import { Box, useDisclosure } from '@chakra-ui/react';
import { useRef, useState } from 'react';

import { CustomTable } from '../table';
import { useMyContext } from '../../context';
import { useGetPriceListByWarehouseId } from '../../hooks';

import { useProductColumns } from './hooks/useProductColumns';

import { CartItem, Modal, usePosContext } from '.';

export const ProductsTable = () => {
  const { priceList, warehouse } = usePosContext();
  const { data: products } = useGetPriceListByWarehouseId(priceList?.id!, warehouse?.id!);
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
    <Box width="65%">
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
  );
};

export default ProductsTable;
