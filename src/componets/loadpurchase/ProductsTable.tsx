/* eslint-disable react/no-children-prop */
import {
  Button,
  useDisclosure,
  Input,
  FormLabel,
  Box,
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
  Stack,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';

import { CustomTable } from '../table';
import { Product } from '../../interfaces/interfaces';
import { useMyContext } from '../../context';
import { useGetProductsWOStock } from '../../hooks';

import { useProductColumns } from './hooks/useProductColumns';

import { usePurchasesContext } from '.';

interface Props {
  products: Product[];
}

export const ProductsTable = () => {
  const { data: products } = useGetProductsWOStock();
  const { addItem } = usePurchasesContext();
  const { tableInput } = useMyContext();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const cancelRef = useRef<HTMLInputElement | null>(null);

  const [activeProduct, setActiveProduct] = useState<Product>();
  const [quantity, setQuantity] = useState<number | null>(null);
  const [cost, setCost] = useState<number | null>(null);

  const { columns } = useProductColumns({ onOpen, setActiveProduct });

  const handleClose = () => {
    setActiveProduct({} as Product);
    setQuantity(null);
    setCost(null);
    onClose();
    tableInput.current.select();
  };

  const handleAdd = () => {
    addItem(activeProduct!, quantity!, cost!);
    handleClose();
  };

  if (!products) return null;

  return (
    <Box width="65%">
      <CustomTable
        showGlobalFilter
        showNavigation
        amount={products.length}
        columns={columns}
        data={products}
        flag="products"
      />

      <Modal finalFocusRef={tableInput} isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay backdropFilter="blur(5px) hue-rotate(90deg)" bg="blackAlpha.300" />
        <ModalContent>
          <ModalHeader>{activeProduct?.name}</ModalHeader>
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
                    type="number"
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                  <InputRightAddon children={activeProduct?.unit?.code} />
                </InputGroup>
              </Box>
              <Box>
                <FormLabel htmlFor="cost">Precio de costo:</FormLabel>
                <InputGroup>
                  <InputLeftAddon children="$" />
                  <Input
                    id="cost"
                    name="cost"
                    type="number"
                    onChange={(e) => setCost(Number(e.target.value))}
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

export default ProductsTable;
