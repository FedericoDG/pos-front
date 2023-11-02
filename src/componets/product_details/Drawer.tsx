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
  InputLeftAddon,
  Select,
  Stack,
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { FormikHelpers, useFormik } from 'formik';
import { InputGroup, AlertIcon, Alert, Text } from '@chakra-ui/react';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';

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
  prices: (Price | null)[];
}

export const Drawer = ({
  initialValues,
  resetValues,
  setinitialValues,
  priceList,
  isOpen,
  onClose,
  prices,
}: Props) => {
  const firstField = useRef<HTMLSelectElement | null>(null);
  const [flag, setFlag] = useState(0);

  const queryClient = useQueryClient();

  const [_, setSearchParams] = useSearchParams();

  const onSuccess = (res: any) => {
    if (res.body.price) {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Precio actualizado');
    } else {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast('No fue necesario actualizar el precio');
    }
    setFlag(Math.random);
  };

  const { mutateAsync: createPrice } = useCreatePrice(onSuccess);

  const onSubmit = (values: Price, actions: FormikHelpers<Price>) => {
    const parsedValues = {
      ...values,
      pricelistId: Number(values.pricelistId),
      price: Number(values.price),
    };

    createPrice(parsedValues).finally(() => {
      setinitialValues(resetValues);
      actions.resetForm();
      onClose();
      setSearchParams('tab=0');
    });
  };

  const close = () => {
    formik.resetForm();
    setinitialValues(resetValues);
    onClose();
    setSearchParams('tab=0');
    setFlag(Math.random);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: () => toFormikValidationSchema(schema),
    onSubmit,
  });

  const { handleSubmit, handleChange, values, errors, touched, setFieldValue } = formik;

  useEffect(() => {
    const price = prices.find((el) => el?.pricelistId === Number(values.pricelistId))?.price || 0;

    setFieldValue('price', price);
  }, [flag, prices, setFieldValue, values.pricelistId]);

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
          <Alert status="warning">
            <AlertIcon />
            <Text>
              Los precios deben ser <span style={{ fontWeight: 'bold' }}>SIN IVA</span>
            </Text>
          </Alert>
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
                    <InputLeftAddon children="$" />
                    <Input
                      id="price"
                      name="price"
                      placeholder="800"
                      value={values.price}
                      onChange={handleChange}
                      onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                    />
                  </InputGroup>
                  {errors.price && touched.price && <ErrorMessage>{errors.price}</ErrorMessage>}
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
