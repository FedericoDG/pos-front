/* eslint-disable react/no-children-prop */
import {
  Box,
  Button,
  Drawer as ChakraDrawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormLabel,
  Input,
  InputLeftElement,
  Select,
  Stack,
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useRef } from 'react';
import { FormikHelpers, useFormik } from 'formik';
import { InputGroup } from '@chakra-ui/react';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { ErrorMessage } from '../common';
import { Price, Pricelists } from '../../interfaces';
import { useCreatePrice } from '../../hooks/';

import { schema } from './schemas';

interface Props {
  initialValues: Price;
  resetValues: Price;
  priceList: Pricelists[];
  isOpen: boolean;
  onClose: () => void;
  setinitialValues: Dispatch<SetStateAction<Price>>;
}

export const Drawer = ({
  initialValues,
  resetValues,
  setinitialValues,
  priceList,
  isOpen,
  onClose,
}: Props) => {
  const firstField = useRef<HTMLSelectElement | null>(null);

  const queryClient = useQueryClient();

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
    toast.success('Precio Actualizado', {
      theme: 'light',
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 3000,
      closeOnClick: true,
    });
  };

  const { mutate: createPrice } = useCreatePrice(onSuccess);

  const onSubmit = (values: Price, actions: FormikHelpers<Price>) => {
    const parsedValues = {
      ...values,
      pricelistId: Number(values.pricelistId),
      price: Number(values.price),
    };

    createPrice(parsedValues);

    setinitialValues(resetValues);
    actions.resetForm();
    onClose();
  };

  const close = () => {
    formik.resetForm();
    setinitialValues(resetValues);
    onClose();
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: () => toFormikValidationSchema(schema),
    onSubmit,
  });

  const { handleSubmit, handleChange, values, errors, touched } = formik;

  return (
    <>
      <ChakraDrawer
        initialFocusRef={firstField}
        isOpen={isOpen}
        placement="right"
        size="md"
        onClose={close}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton color="white" />
          <DrawerHeader
            bgGradient="linear(to-r, brand.600, blue.500)"
            borderBottomWidth="1px"
            color="white"
          >
            Actualizar Precio
          </DrawerHeader>
          <form onSubmit={handleSubmit}>
            <DrawerBody>
              <Stack spacing="14px">
                <Flex gap="4" justifyContent="space-between">
                  <Box w="full">
                    <FormLabel htmlFor="pricelistId">Lista de Precio:</FormLabel>
                    <Select
                      ref={firstField}
                      id="pricelistId"
                      minW="224px"
                      name="pricelistId"
                      onChange={handleChange}
                    >
                      {priceList.map((priceList) => (
                        <option key={priceList.code} value={priceList.id}>
                          {priceList.code} ∷ {priceList.description}
                        </option>
                      ))}
                    </Select>
                    {errors.pricelistId && touched.pricelistId && (
                      <ErrorMessage>{errors.pricelistId}</ErrorMessage>
                    )}
                  </Box>
                </Flex>

                <Box>
                  <FormLabel htmlFor="price">Precio:</FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      children="$"
                      color="gray.500"
                      fontSize="1.25rem"
                      pointerEvents="none"
                      pt="6px"
                    />
                    <Input
                      id="price"
                      name="price"
                      placeholder="20"
                      size="lg"
                      value={values.price}
                      onChange={handleChange}
                      onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                    />
                    {errors.price && touched.price && <ErrorMessage>{errors.price}</ErrorMessage>}
                  </InputGroup>
                </Box>
              </Stack>
            </DrawerBody>

            <DrawerFooter borderTopWidth="1px" bottom="0" position="fixed" w="full">
              <Button mr={3} type="reset" variant="outline" w="full" onClick={close}>
                Cancelar
              </Button>
              <Button colorScheme="brand" type="submit" w="full">
                Guardar
              </Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </ChakraDrawer>
    </>
  );
};
