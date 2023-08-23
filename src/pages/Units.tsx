import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { HiPlus } from 'react-icons/Hi';
import { useMemo, useState, useEffect } from 'react';

import { ConfirmationModal, Drawer } from '../componets/units';
import { CustomTable } from '../componets/table';
import { DashBoard } from '../componets/common';
import { Loading } from '../componets/common';
import { Unit } from '../interfaces';
import { useColumns } from '../componets/units/hooks';
import { useGetUnits } from '../hooks';

export const Units = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenModal, onOpen: onOpenModal, onClose: onCloseModal } = useDisclosure();

  const resetValues: Unit = useMemo(
    () => ({
      code: '',
      name: '',
    }),
    []
  );

  const [initialValues, setinitialValues] = useState(resetValues);

  const { data: units, isFetching: isFetchingUnits } = useGetUnits();

  const isIndeterminate = isFetchingUnits;

  const { columns } = useColumns({ onOpen, onOpenModal, setinitialValues });

  useEffect(() => {
    const handleUserKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F9') {
        return onOpen();
      }
    };

    window.addEventListener('keydown', handleUserKeyPress);

    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  }, [onOpen]);

  return (
    <DashBoard isIndeterminate={isIndeterminate} title="Unidades">
      <Button colorScheme="brand" leftIcon={<HiPlus />} mb={4} ml="auto" size="lg" onClick={onOpen}>
        CREAR UNIDAD
      </Button>

      {!units ? (
        <Loading />
      ) : (
        <>
          <Box bg="white" maxW="800px" p="4" rounded="md" shadow="md" w="full">
            <CustomTable
              showColumsSelector
              showGlobalFilter
              showNavigation
              showPrintOption
              amount={units.length}
              columns={columns}
              data={units}
            />
          </Box>
          <Drawer
            initialValues={initialValues}
            isOpen={isOpen}
            resetValues={resetValues}
            setinitialValues={setinitialValues}
            onClose={onClose}
          />
          <ConfirmationModal
            initialValues={initialValues}
            isOpen={isOpenModal}
            resetValues={resetValues}
            setinitialValues={setinitialValues}
            onClose={onCloseModal}
          />
        </>
      )}
    </DashBoard>
  );
};
