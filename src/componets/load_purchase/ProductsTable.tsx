/* eslint-disable react/no-children-prop */
import {
  Alert,
  AlertIcon,
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
import { FormikHelpers, useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { z } from 'zod';

import { CustomTable } from '../table';
import { useMyContext } from '../../context';
import { useGetProductsWOStock } from '../../hooks';
import { ErrorMessage } from '../common';

import { useProductColumns } from './hooks/useProductColumns';

import { CartItem, usePurchasesContext } from '.';

interface Values {
  quantity: number;
  price: number;
}

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
    formik.resetForm();
    tableInput.current.select();
  };

  console.log(activeProduct);
  const onSubmit = (values: Values, actions: FormikHelpers<Values>) => {
    const price = Number(values.price);
    const quantity = Number(values.quantity);

    addItem({ ...activeProduct, quantity, price });

    setActiveProduct({} as CartItem);
    actions.resetForm();
    handleClose();
  };

  const initialValues = {
    quantity: activeProduct.quantity,
    price: activeProduct.price,
  };

  const schema = () =>
    z.object({
      quantity: z.preprocess(
        (val) => Number(val),
        z
          .number({
            invalid_type_error: 'Sólo se permiten números',
          })
          .min(1, 'Mínimo: 1')
      ),
    });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: () => toFormikValidationSchema(schema()),
    onSubmit,
  });

  const { handleSubmit, handleChange, errors, touched } = formik;

  if (!products) return null;

  return (
    <Box width="64%">
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
        <form onSubmit={handleSubmit}>
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
                      defaultValue={activeProduct?.quantity}
                      id="quantity"
                      name="quantity"
                      tabIndex={1}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                    />
                    <InputRightAddon children={activeProduct?.unit?.code} />
                  </InputGroup>
                  {errors.quantity && touched.quantity && (
                    <ErrorMessage>{errors.quantity}</ErrorMessage>
                  )}
                </Box>
                <Box>
                  <FormLabel htmlFor="price">Precio:</FormLabel>
                  <InputGroup>
                    <InputLeftAddon children="$" />
                    <Input
                      defaultValue={activeProduct.price}
                      id="price"
                      name="price"
                      tabIndex={2}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
                  </InputGroup>
                </Box>
              </Stack>

              <Stack mt="4">
                <Alert status="warning">
                  <AlertIcon />
                  No modifique el precio si no desea actualizarlo.
                </Alert>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button tabIndex={4} type="reset" onClick={handleClose}>
                Cancelar
              </Button>
              <Button colorScheme="brand" ml={3} tabIndex={3} type="submit">
                Agregar
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </Box>
  );
};

export default ProductsTable;
