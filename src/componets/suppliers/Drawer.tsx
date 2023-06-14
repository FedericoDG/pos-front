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
  Switch,
  Textarea,
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useRef } from 'react';
import { FormikHelpers, useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import { Supplier } from '../../interfaces';
import { useCreateSupplier, useUpdateSupplier } from '../../hooks/';
import { ErrorMessage } from '../common';

import { schema } from './schemas';

interface Props {
  initialValues: Supplier;
  resetValues: Supplier;
  isOpen: boolean;
  onClose: () => void;
  setinitialValues: Dispatch<SetStateAction<Supplier>>;
}

export const Drawer = ({
  initialValues,
  resetValues,
  setinitialValues,
  isOpen,
  onClose,
}: Props) => {
  const firstField = useRef<HTMLInputElement | null>(null);

  const { mutate: createSupplier } = useCreateSupplier();
  const { mutate: updateSupplier } = useUpdateSupplier();

  const onSubmit = (values: Supplier, actions: FormikHelpers<Supplier>) => {
    const parsedValues = {
      ...values,
    };

    if (values?.id) {
      updateSupplier(parsedValues);
    } else {
      createSupplier(parsedValues);
    }
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
                    <FormLabel htmlFor="name">Nombre:</FormLabel>
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
