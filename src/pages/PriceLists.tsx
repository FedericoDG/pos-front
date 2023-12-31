import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { HiPlus } from 'react-icons/Hi';
import { useMemo, useState } from 'react';

import { ConfirmationModal, Drawer } from '../componets/pricelist';
import { CustomTable } from '../componets/table';
import { DashBoard } from '../componets/common';
import { Loading } from '../componets/common';
import { Pricelists } from '../interfaces';
import { useColumns } from '../componets/pricelist/hooks';
import { useGetPriceLists } from '../hooks';

export const PriceLists = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenModal, onOpen: onOpenModal, onClose: onCloseModal } = useDisclosure();

  const resetValues: Pricelists = useMemo(
    () => ({
      code: '',
      description: '',
    }),
    []
  );

  const [initialValues, setinitialValues] = useState(resetValues);

  const { data: units, isFetching: isFetchingUnits } = useGetPriceLists();

  const isIndeterminate = isFetchingUnits;

  const { columns } = useColumns({ onOpen, onOpenModal, setinitialValues });

  return (
    <DashBoard isIndeterminate={isIndeterminate} title="Listas de Precios">
      <Button
        colorScheme="brand"
        leftIcon={<HiPlus />}
        mb={4}
        ml="auto"
        shadow="lg"
        size="lg"
        onClick={onOpen}
      >
        CREAR LISTA DE PRECIOS
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
