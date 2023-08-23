import { Box } from '@chakra-ui/react';

import { CustomTable } from '../componets/table';
import { DashBoard } from '../componets/common';
import { Loading } from '../componets/common';
import { useColumns } from '../componets/cash_registers/hooks';
import { useChasRegisters } from '../hooks';

export const CashRegisters = () => {
  const { data: cashRegisters, isFetching: isFetchingCashRegisters } = useChasRegisters();

  const isIndeterminate = isFetchingCashRegisters;

  const { columns } = useColumns();

  return (
    <DashBoard isIndeterminate={isIndeterminate} title="Cajas">
      {!cashRegisters ? (
        <Loading />
      ) : (
        <Box bg="white" p="4" rounded="md" shadow="md" w="full">
          <CustomTable
            showColumsSelector
            showNavigation
            showPrintOption
            amount={cashRegisters.length}
            columns={columns}
            data={cashRegisters}
          />
        </Box>
      )}
    </DashBoard>
  );
};
