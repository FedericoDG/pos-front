/* eslint-disable react/no-children-prop */
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Fade,
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
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';

import { CustomTable } from '../table';
import { useMyContext } from '../../context';
import { useGetProductsWOStock } from '../../hooks';

import { useProductColumns } from './hooks/useProductColumns';

import { CartItem, usePurchasesContext } from '.';

export const ProductsTable = () => {
  const { data: products } = useGetProductsWOStock();
  const { addItem } = usePurchasesContext();
  const { tableInput } = useMyContext();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const cancelRef = useRef<HTMLInputElement | null>(null);

  const [activeProduct, setActiveProduct] = useState({} as CartItem);

  const { columns } = useProductColumns({ onOpen, setActiveProduct });

  const handleClose = () => {
    setActiveProduct({} as CartItem);
    onClose();
    tableInput.current.select();
  };

  const handleAdd = () => {
    addItem(activeProduct!);
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

      <Modal finalFocusRef={tableInput} isOpen={isOpen} size="lg" onClose={handleClose}>
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
                    onChange={(e) =>
                      setActiveProduct((current) => ({
                        ...current,
                        quantity: Number(e.target.value),
                      }))
                    }
                  />
                  <InputRightAddon children={activeProduct?.unit?.code} />
                </InputGroup>
              </Box>
              <Box>
                <FormLabel htmlFor="cost">Precio de costo:</FormLabel>
                <InputGroup>
                  <InputLeftAddon children="$" />
                  <Input
                    defaultValue={activeProduct.price}
                    id="cost"
                    name="cost"
                    type="number"
                    onChange={(e) =>
                      setActiveProduct((current) => ({
                        ...current,
                        price: Number(e.target.value),
                      }))
                    }
                  />
                </InputGroup>
              </Box>
            </Stack>

            <Stack mt="4">
              <Alert status="warning">
                <AlertIcon />
                Si no proporciona un precio, éste no se actualizará.
              </Alert>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button
              colorScheme="brand"
              isDisabled={!activeProduct.quantity || activeProduct.price < 0}
              ml={3}
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

export default ProductsTable;
