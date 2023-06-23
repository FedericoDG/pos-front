/* eslint-disable react/no-children-prop */
import {
  Box,
  Button,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select as ChakraSelect,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { useRef, useState, useEffect } from 'react';

import { CustomTable } from '../table';
import { Warehouse } from '../../interfaces/interfaces';
import { useMyContext } from '../../context';
import { useGetReasons, useGetStock, useGetWarehouse } from '../../hooks';

import { useColumns } from './hooks/useColumns';

import { CartItem, useDischargesContext } from '.';

export const DischargesTable = () => {
  const [ware, setWare] = useState<Warehouse[]>([]);
  const [warehouseId, setWarehouseId] = useState<number | null>(null);
  const { addItem, warehouse } = useDischargesContext();
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
  const [cost, setCost] = useState<number | null>(null);

  const { data: reasons } = useGetReasons();

  useEffect(() => {
    if (!activeProduct) return;

    setCost(activeProduct.cost);
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
        amount={stocks.length}
        columns={columns}
        data={stocks}
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
                <FormLabel htmlFor="quantity">Razón de la pérdida:</FormLabel>
                <ChakraSelect
                  id="categoryId"
                  minW="224px"
                  name="categoryId"
                  value={reasons[0].id}
                  onChange={(e) =>
                    setActiveProduct((current) => ({
                      ...current,
                      reasonId: Number(e.target.value),
                    }))
                  }
                >
                  {reasons.map((reason) => (
                    <option key={reason.id} value={reason.id}>
                      {reason.reason}
                    </option>
                  ))}
                </ChakraSelect>
              </Box>
              <Box>
                <FormLabel htmlFor="quantity">Cantidad:</FormLabel>
                <InputGroup>
                  <Input
                    ref={cancelRef}
                    autoFocus
                    id="quantity"
                    name="quantity"
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
              <Box>
                <FormLabel htmlFor="cost">Precio de costo:</FormLabel>
                <InputGroup>
                  <InputLeftAddon children="$" />
                  <Input
                    defaultValue={activeProduct?.cost}
                    id="cost"
                    name="cost"
                    type="number"
                    onChange={(e) =>
                      setActiveProduct((current) => ({ ...current, cost: Number(e.target.value) }))
                    }
                  />
                </InputGroup>
              </Box>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button colorScheme="brand" isDisabled={!quantity || !cost} ml={3} onClick={handleAdd}>
              Agregar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
