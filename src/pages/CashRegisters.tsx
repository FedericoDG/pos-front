import { Box } from '@chakra-ui/react';

import { CustomTable } from '../componets/table';
import { DashBoard } from '../componets/common';
import { Loading } from '../componets/common';
import { useColumns } from '../componets/cash_registers/hooks';
import { useChasRegisters } from '../hooks';
import { exportToexcel } from '../componets/cash_registers';

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
            showExportToExcelButton
            showNavigation
            showPrintOption
            amount={cashRegisters.length}
            columns={columns}
            data={cashRegisters}
            exportToExcel={() => exportToexcel(cashRegisters)}
          />
        </Box>
      )}
    </DashBoard>
  );
};
