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
  Select,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useRef } from 'react';
import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { toast } from 'sonner';
import { useQueryClient } from 'react-query';

import { State, Supplier } from '../../interfaces';
import { useCreateSupplier, useUpdateSupplier } from '../../hooks/';
import { ErrorMessage } from '../common';

import { schema } from './schemas';

interface Props {
  initialValues: Supplier;
  resetValues: Supplier;
  states: State[];
  isOpen: boolean;
  onClose: () => void;
  setinitialValues: Dispatch<SetStateAction<Supplier>>;
}

export const Drawer = ({
  initialValues,
  states,
  isOpen,
  onClose,
  resetValues,
  setinitialValues,
}: Props) => {
  const firstField = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  const onSuccess = (res: any) => {
    queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    toast.success(res.message);
  };

  const onError = (error: any) => {
    toast.error(error.response.data.message);
  };

  const { mutate: createSupplier } = useCreateSupplier(onSuccess, onError);
  const { mutate: updateSupplier } = useUpdateSupplier(onSuccess, onError);

  const onSubmit = (values: Supplier) => {
    const parsedValues = {
      ...values,
      stateId: Number(values.stateId),
      city: values.city.toUpperCase(),
    };

    if (values?.id) {
      updateSupplier(parsedValues);
    } else {
      createSupplier(parsedValues);
    }

    close();
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
            {initialValues.id ? 'Editar Proveedor' : 'Crear Proveedor'}
          </DrawerHeader>
          <form onSubmit={handleSubmit}>
            <DrawerBody>
              <Stack spacing="14px">
                <Box>
                  <FormLabel htmlFor="cuit">Cuit:</FormLabel>
                  <Input
                    ref={firstField}
                    id="cuit"
                    isDisabled={!!initialValues.id}
                    name="cuit"
                    placeholder="35281236871"
                    value={values.cuit}
                    onChange={handleChange}
                    onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                  />
                  {errors.cuit && touched.cuit && <ErrorMessage>{errors.cuit}</ErrorMessage>}
                </Box>

                <Flex gap="4" justifyContent="space-between">
                  <Box>
                    <FormLabel htmlFor="name">Razón Social:</FormLabel>
                    <Input
                      id="name"
                      name="name"
                      placeholder="San Jorge S.R.L."
                      value={values.name}
                      onChange={handleChange}
                    />
                    {errors.name && touched.name && <ErrorMessage>{errors.name}</ErrorMessage>}
                  </Box>
                  <Box>
                    <FormLabel htmlFor="email">Email:</FormLabel>
                    <Input
                      id="email"
                      name="email"
                      placeholder="ventas@sanjorgesrl.com.ar"
                      value={values.email}
                      onChange={handleChange}
                      onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                    />
                    {errors.email && touched.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                  </Box>
                </Flex>

                <Flex gap="4" justifyContent="space-between">
                  <Box w="49%">
                    <FormLabel htmlFor="stateId">Provincia:</FormLabel>
                    <Select
                      defaultValue={initialValues.stateId}
                      id="stateId"
                      name="stateId"
                      onChange={handleChange}
                    >
                      {states.map((state) => (
                        <option key={state.name} value={state.id}>
                          {state.id} - {state.name}
                        </option>
                      ))}
                    </Select>
                    {errors.stateId && touched.stateId && (
                      <ErrorMessage>{errors.stateId}</ErrorMessage>
                    )}
                  </Box>
                  <Box w="49%">
                    <FormLabel htmlFor="city">Ciudad:</FormLabel>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Posadas"
                      value={values.city}
                      onChange={handleChange}
                    />
                    {errors.city && touched.city && <ErrorMessage>{errors.city}</ErrorMessage>}
                  </Box>
                </Flex>

                <Flex gap="4" justifyContent="space-between">
                  <Box>
                    <FormLabel htmlFor="phone">Teléfono:</FormLabel>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="01145649401"
                      value={values.phone}
                      onChange={handleChange}
                    />
                    {errors.phone && touched.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
                  </Box>
                  <Box>
                    <FormLabel htmlFor="mobile">Celular:</FormLabel>
                    <Input
                      id="mobile"
                      name="mobile"
                      placeholder="01175444478"
                      value={values.mobile}
                      onChange={handleChange}
                    />
                    {errors.mobile && touched.mobile && (
                      <ErrorMessage>{errors.mobile}</ErrorMessage>
                    )}
                  </Box>
                </Flex>

                <Box>
                  <FormLabel htmlFor="address">Dirección:</FormLabel>
                  <Textarea
                    id="address"
                    name="address"
                    placeholder="Oncativo 1578"
                    value={values.address}
                    onChange={handleChange}
                  />
                </Box>

                <Box>
                  <FormLabel htmlFor="info">Información extra:</FormLabel>
                  <Textarea
                    id="info"
                    name="info"
                    placeholder="No atiende los fines de semana..."
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
