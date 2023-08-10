/* eslint-disable react/no-children-prop */
import {
  Box,
  Button,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { useRef, useState, useEffect } from 'react';

import { CustomTable } from '../table';
import { Warehouse } from '../../interfaces/interfaces';
import { useMyContext } from '../../context';
import { useGetReasons, useGetStock, useGetWarehouse } from '../../hooks';

import { useColumns } from './hooks/useColumns';

import { CartItem, useProductTransContext } from '.';

export const DischargesTable = () => {
  const [ware, setWare] = useState<Warehouse[]>([]);
  const [warehouseId, setWarehouseId] = useState<number | null>(null);
  const { addItem, warehouse } = useProductTransContext();
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
  const [quantity, setQuantity] = useState<number | null>(null);

  const { data: reasons } = useGetReasons();

  useEffect(() => {
    if (!activeProduct) return;

    setQuantity(activeProduct.quantity);
  }, [activeProduct]);

  const { columns } = useColumns({ onOpen, warehouses: ware, setActiveProduct });

  const handleClose = () => {
    setActiveProduct({} as CartItem);
    onClose();
    tableInput.current.select();
  };

  const handleAdd = () => {
    addItem(activeProduct);
    handleClose();
  };

  if (!stocks || !reasons) return null;

  return (
    <Box width="65%">
      <CustomTable
        showGlobalFilter
        showNavigation
        amount={stocks.filter((el) => el.stock > 0).length}
        columns={columns}
        data={stocks.filter((el) => el.stock > 0)}
        flag="products"
      />

      <Modal finalFocusRef={tableInput} isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay backdropFilter="blur(5px) hue-rotate(90deg)" bg="blackAlpha.300" />
        <ModalContent>
          <ModalHeader>{activeProduct?.products?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="14px">
              <Box>
                <FormLabel htmlFor="quantity">Cantidad:</FormLabel>
                <InputGroup>
                  <Input
                    ref={cancelRef}
                    autoFocus
                    id="quantity"
                    name="quantity"
                    tabIndex={1}
                    type="number"
                    onChange={(e) =>
                      setActiveProduct((current) => ({
                        ...current,
                        quantity: Number(e.target.value),
                      }))
                    }
                  />
                  <InputRightAddon children={activeProduct?.products?.unit?.code} />
                </InputGroup>
              </Box>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button tabIndex={3} onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="brand"
              isDisabled={!quantity}
              ml={3}
              tabIndex={2}
              onClick={handleAdd}
            >
              Agregar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
