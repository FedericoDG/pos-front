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
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Select,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useRef } from 'react';
import { FormikHelpers, useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';

import { Discharge, Reason, Warehouse } from '../../interfaces';
import { ErrorMessage } from '../common';
import { useCreateDischarge } from '../../hooks/';

import { schema } from './schemas';

interface Props {
  initialValues: Discharge;
  resetValues: Discharge;
  warehouses: Warehouse[];
  reasons: Reason[];
  isOpen: boolean;
  onClose: () => void;
  setinitialValues: Dispatch<SetStateAction<Discharge>>;
}

export const Drawer = ({
  initialValues,
  isOpen,
  onClose,
  reasons,
  resetValues,
  setinitialValues,
  warehouses,
}: Props) => {
  const firstField = useRef<HTMLInputElement | null>(null);

  const queryClient = useQueryClient();

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['stocks', 'discharges'] });
    toast.success('Baja de productos realizada');
  };

  const onError = (error: any) => {
    toast.error(error.response.data.body.message);
  };

  const { mutate: createDischarge } = useCreateDischarge(onSuccess, onError);

  const onSubmit = (values: Discharge, actions: FormikHelpers<Discharge>) => {
    const parsedValues = {
      warehouseId: Number(values.warehouseId),
      cart: [
        {
          productId: Number(values.productId),
          reasonId: Number(values.reasonId),
          quantity: Number(values.quantity),
          cost: Number(values.cost),
          info: values.info,
        },
      ],
    };

    createDischarge(parsedValues);

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
            Cargar Pérdida de stock
          </DrawerHeader>
          <form onSubmit={handleSubmit}>
            <DrawerBody>
              <Stack spacing="14px">
                <Flex gap="4" justifyContent="space-between">
                  <Box>
                    <FormLabel htmlFor="warehouseId">Depósito:</FormLabel>
                    <Select
                      autoFocus
                      id="warehouseId"
                      minW="224px"
                      name="warehouseId"
                      value={initialValues.warehouseId}
                      onChange={handleChange}
                    >
                      {warehouses.map((warehouse) => (
                        <option key={warehouse.code} value={warehouse.id}>
                          {warehouse.code}
                        </option>
                      ))}
                    </Select>
                    {errors.warehouseId && touched.warehouseId && (
                      <ErrorMessage>{errors.warehouseId}</ErrorMessage>
                    )}
                  </Box>

                  <Box>
                    <FormLabel htmlFor="reasonId">Razón:</FormLabel>
                    <Select
                      id="reasonId"
                      minW="224px"
                      name="reasonId"
                      value={initialValues.reasonId}
                      onChange={handleChange}
                    >
                      {reasons.map((reason) => (
                        <option key={reason.reason} value={reason.id}>
                          {reason.reason}
                        </option>
                      ))}
                    </Select>
                    {errors.reasonId && touched.reasonId && (
                      <ErrorMessage>{errors.reasonId}</ErrorMessage>
                    )}
                  </Box>
                </Flex>

                <Flex gap="4" justifyContent="space-between">
                  <Box>
                    <Box>
                      <FormLabel htmlFor="quantity">Cantidad:</FormLabel>
                      <InputGroup>
                        <Input
                          id="quantity"
                          name="quantity"
                          placeholder="0"
                          value={values.quantity}
                          onChange={handleChange}
                          onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                        />
                        <InputRightAddon children={initialValues.unit} />
                      </InputGroup>
                    </Box>
                    {errors.quantity && touched.quantity && (
                      <ErrorMessage>{errors.quantity}</ErrorMessage>
                    )}
                  </Box>
                  <Box>
                    <Box>
                      <FormLabel htmlFor="cost">Costo:</FormLabel>
                      <InputGroup>
                        <InputLeftAddon children="$" />
                        <Input
                          id="cost"
                          name="cost"
                          placeholder="0"
                          value={values.cost}
                          onChange={handleChange}
                          onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                        />
                      </InputGroup>
                    </Box>
                    {errors.cost && touched.cost && <ErrorMessage>{errors.cost}</ErrorMessage>}
                  </Box>
                </Flex>

                <Box>
                  <FormLabel htmlFor="info">Información extra:</FormLabel>
                  <Textarea
                    id="info"
                    name="info"
                    placeholder="Cuanquier otra información relevante..."
                    value={values.info}
                    onChange={handleChange}
                  />
                </Box>
              </Stack>
            </DrawerBody>

            <DrawerFooter borderTopWidth="1px" bottom="0" position="fixed" w="full">
              <Button mr={3} type="reset" variant="outline" w="full" onClick={close}>
                CANCELAR
              </Button>
              <Button colorScheme="brand" type="submit" w="full">
                GUARDAR
              </Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </ChakraDrawer>
    </>
  );
};
