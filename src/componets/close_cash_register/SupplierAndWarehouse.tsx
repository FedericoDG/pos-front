import { Stack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Loading } from '../common';
import { useGetWarehouseByUserId } from '../../hooks';

import { useDischargesContext } from '.';

export const SupplierAndWarehouse = () => {
  const { id } = useParams();

  const { data: warehouses } = useGetWarehouseByUserId(Number(id));

  const { goToNext, setWarehouse } = useDischargesContext();

  useEffect(() => {
    if (!warehouses) return;

    const mappedWarehouses = [warehouses].map((el) => ({ ...el, value: el.id, label: el.code }));

    setWarehouse(mappedWarehouses[0]);
    goToNext();
  }, [goToNext, setWarehouse, warehouses]);

  if (!warehouses) return <Loading />;

  return <Stack bg="white" mb="4" p="4" rounded="md" w="full" />;
};
