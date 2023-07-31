import { Box, useDisclosure } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';

import { CustomTable } from '../componets/table';
import { DashBoard } from '../componets/common';
import { Discharge, Warehouse } from '../interfaces';
import { Drawer } from '../componets/stocks';
import { Loading } from '../componets/common';
import { useColumns } from '../componets/stocks/hooks';
import { useGetReasons, useGetStocks, useGetWarehousesWOStock } from '../hooks';

export const Stocks = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const resetValues: Discharge = useMemo(
    () => ({
      warehouseId: 1,
      productId: 1,
      reasonId: 1,
      quantity: 0,
      cost: 0,
      unit: 'Kg.',
      info: '',
    }),
    []
  );

  const [initialValues, setinitialValues] = useState(resetValues);

  const { data: stocks, isFetching: isFetchingStocks } = useGetStocks();
  const { data: warehouses } = useGetWarehousesWOStock();
  const { data: reasons } = useGetReasons();
  const [ware, setWare] = useState<Warehouse[]>([]);

  useEffect(() => {
    if (!warehouses) return;

    setWare(warehouses.filter((el) => el.driver === 0));
  }, [warehouses]);

  useEffect(() => {
    if (!warehouses || !reasons) return;

    resetValues.warehouseId = warehouses[0].id!;
    resetValues.reasonId = reasons[0].id!;
  }, [reasons, resetValues, warehouses]);

  const isIndeterminate = isFetchingStocks;

  const { columns } = useColumns({ onOpen, warehouses: ware, setinitialValues });

  return (
    <DashBoard isIndeterminate={isIndeterminate} title="Stock">
      {!stocks || !warehouses || !reasons ? (
        <Loading />
      ) : (
        <>
          <Box w="full">
            <CustomTable
              showColumsSelector
              showGlobalFilter
              showNavigation
              showPrintOption
              amount={stocks.length}
              columns={columns}
              data={stocks}
            />
          </Box>
          <Drawer
            initialValues={initialValues}
            isOpen={isOpen}
            reasons={reasons}
            resetValues={resetValues}
            setinitialValues={setinitialValues}
            warehouses={warehouses}
            onClose={onClose}
          />
        </>
      )}
    </DashBoard>
  );
};
