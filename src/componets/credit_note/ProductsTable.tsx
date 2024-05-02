import { Alert, AlertIcon, Box, Stack, useDisclosure } from '@chakra-ui/react';
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

  const { columns } = useProductColumns({ onOpen, setActiveProduct, cashMovement });

  const handleClose = () => {
    setActiveProduct({} as CashMovementsDetail);
    onClose();
    tableInput.current.select();
  };

  if (!cashMovement) return null;

  // console.log({ cashMovement });

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
          {(cashMovement.recharge > 0 || cashMovement.discount > 0) && (
            <Alert status="warning">
              <AlertIcon />
              Esta factura posee un descuento o recargo sobre el total, por lo tanto no es posible
              anularla parcialmente. Utilice el botón de &apos;AGREGAR TODOS&apos;.
            </Alert>
          )}
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
