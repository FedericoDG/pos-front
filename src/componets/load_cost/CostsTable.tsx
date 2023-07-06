/* eslint-disable react/no-children-prop */
import {
  Box,
  Button,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
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
import { useState } from 'react';

import { CustomTable } from '../table';
import { useMyContext } from '../../context';
import { useGetStocks } from '../../hooks';

import { useColumns } from './hooks/useColumns';

import { CartItem, useCostsContext } from '.';

export const CostTable = () => {
  const { addItem } = useCostsContext();
  const { tableInput } = useMyContext();

  const { data: stocks } = useGetStocks();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [activeProduct, setActiveProduct] = useState({} as CartItem);

  const { columns } = useColumns({ onOpen, setActiveProduct });

  const handleClose = () => {
    setActiveProduct({} as CartItem);
    onClose();
    tableInput.current.select();
  };

  const handleAdd = () => {
    addItem(activeProduct);
    handleClose();
  };

  if (!stocks) return null;

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
                <FormLabel htmlFor="cost">Precio de costo:</FormLabel>
                <InputGroup>
                  <InputLeftAddon children="$" />
                  <Input
                    autoFocus
                    defaultValue={activeProduct?.cost}
                    id="cost"
                    name="cost"
                    type="number"
                    onChange={(e) =>
                      setActiveProduct((current) => ({ ...current, cost: Number(e.target.value) }))
                    }
                    onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                  />
                </InputGroup>
              </Box>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button colorScheme="brand" ml={3} onClick={handleAdd}>
              Agregar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
