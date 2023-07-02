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
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';

import { CustomTable } from '../table';
import { useMyContext } from '../../context';
import { useGetPriceListByWarehouseId } from '../../hooks';

import { useProductColumns } from './hooks/useProductColumns';

import { CartItem, usePosContext } from '.';

export const ProductsTable = () => {
  const { addItem, priceList, warehouse } = usePosContext();
  const { data: products } = useGetPriceListByWarehouseId(priceList?.id!, warehouse?.id!);
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
                <FormLabel htmlFor="price">Precio:</FormLabel>
                <InputGroup>
                  <InputLeftAddon children="$" />
                  <Input
                    disabled
                    id="price"
                    name="price"
                    type="number"
                    value={activeProduct.price}
                  />
                </InputGroup>
              </Box>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button
              colorScheme="brand"
              isDisabled={!activeProduct.quantity || !activeProduct.price}
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
