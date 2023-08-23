import { Box, useDisclosure } from '@chakra-ui/react';
import { useRef, useState, useEffect } from 'react';

import { CustomTable } from '../table';
import { Warehouse } from '../../interfaces/interfaces';
import { useMyContext } from '../../context';
import { useGetReasons, useGetStock, useGetWarehouse } from '../../hooks';

import { useColumns } from './hooks/useColumns';

import { CartItem, Modal, useProductTransContext } from '.';

export const DischargesTable = () => {
  const [ware, setWare] = useState<Warehouse[]>([]);
  const [warehouseId, setWarehouseId] = useState<number | null>(null);
  const { warehouse } = useProductTransContext();
  const { tableInput } = useMyContext();

  const { data: stocks } = useGetStock(warehouseId);
  const { data: warehouseReq } = useGetWarehouse(warehouseId);

  useEffect(() => {
    if (!warehouse) return;
    setWarehouseId(warehouse.id!);
  }, [warehouse]);

  useEffect(() => {
    if (!warehouseReq) return;

    setWare([warehouseReq]);
  }, [warehouseReq]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const cancelRef = useRef<HTMLInputElement | null>(null);

  const [activeProduct, setActiveProduct] = useState({} as CartItem);

  const { data: reasons } = useGetReasons();

  const { columns } = useColumns({ onOpen, warehouses: ware, setActiveProduct });

  const handleClose = () => {
    setActiveProduct({} as CartItem);
    onClose();
    tableInput.current.select();
  };

  if (!stocks || !reasons) return null;

  return (
    <Box width="64%">
      <CustomTable
        showGlobalFilter
        showNavigation
        amount={stocks.filter((el) => el.stock > 0).length}
        columns={columns}
        data={stocks.filter((el) => el.stock > 0)}
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
