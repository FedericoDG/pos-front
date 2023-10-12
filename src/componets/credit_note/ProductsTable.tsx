import { Box, Stack, useDisclosure } from '@chakra-ui/react';
import { useRef, useState } from 'react';

import { CustomTable } from '../table';
import { useMyContext } from '../../context';
import { CashMovement, CashMovementsDetail } from '../../interfaces';

import { useProductColumns } from './hooks/useProductColumns';

import { Basket, Modal, usePosContext } from '.';

interface Props {
  cashMovement: CashMovement;
}

export const ProductsTable = ({ cashMovement }: Props) => {
  const { cart } = usePosContext();
  const { tableInput } = useMyContext();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const cancelRef = useRef<HTMLInputElement | null>(null);

  const [activeProduct, setActiveProduct] = useState({} as CashMovementsDetail);

  const { columns } = useProductColumns({ onOpen, setActiveProduct });

  const handleClose = () => {
    setActiveProduct({} as CashMovementsDetail);
    onClose();
    tableInput.current.select();
  };

  if (!cashMovement) return null;

  return (
    <Stack bg="white">
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
            amount={cashMovement.cashMovementDetails?.length || 0}
            columns={columns}
            data={cashMovement.cashMovementDetails!}
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
        <Basket cashMovement={cashMovement} />
      </Stack>
    </Stack>
  );
};

export default ProductsTable;
