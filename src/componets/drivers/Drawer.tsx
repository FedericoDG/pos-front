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
  Stack,
  Textarea,
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useRef } from 'react';
import { getIn, useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { toast } from 'sonner';

import { Warehouse } from '../../interfaces';
import { useCreateWarehouse, useUpdateWarehose } from '../../hooks/';
import { ErrorMessage } from '../common';

import { schema, schema2 } from './schemas';

interface Props {
  initialValues: Warehouse;
  resetValues: Warehouse;
  isOpen: boolean;
  onClose: () => void;
  setinitialValues: Dispatch<SetStateAction<Warehouse>>;
}

export const Drawer = ({
  initialValues,
  resetValues,
  setinitialValues,
  isOpen,
  onClose,
}: Props) => {
  const firstField = useRef<HTMLInputElement | null>(null);

  const { mutateAsync: createWarehouse } = useCreateWarehouse();
  const { mutateAsync: updateWarehouse } = useUpdateWarehose();

  const onSubmit = (values: Warehouse) => {
    const parsedValues = {
      code: values.code,
      driver: 1,
      description: values.description,
      name: values.user?.name,
      lastname: values.user?.lastname,
      email: values.user?.email,
      password: values.password,
    };

    if (values?.id) {
      updateWarehouse({ ...parsedValues, id: Number(values.id) })
        .then(() => toast.success('Chofer actualizado'))
        .finally(() => close());
    } else {
      createWarehouse(parsedValues)
        .then(() => toast.success('Chofer creado'))
        .finally(() => close());
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: initialValues.id
      ? () => toFormikValidationSchema(schema2)
      : () => toFormikValidationSchema(schema),
    onSubmit,
  });

  const { handleSubmit, handleChange, values, errors, touched } = formik;

  const close = () => {
    formik.resetForm();
    setinitialValues(resetValues);
    onClose();
  };

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
            {initialValues.id ? 'Editar Chofer' : 'Crear Chofer'}
          </DrawerHeader>
          <form onSubmit={handleSubmit}>
            <DrawerBody>
              <Stack spacing="14px">
                <Box>
                  <FormLabel htmlFor="code">Código:</FormLabel>
                  <Input
                    ref={firstField}
                    id="code"
                    name="code"
                    placeholder="chofer-42"
                    value={values.code}
                    onChange={handleChange}
                    onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                  />
                  {errors.code && touched.code && <ErrorMessage>{errors.code}</ErrorMessage>}
                </Box>

                <Box>
                  <FormLabel htmlFor="name">Apellido:</FormLabel>
                  <Input
                    id="lastname"
                    name="user.lastname"
                    placeholder="Pérez"
                    value={values.user?.lastname}
                    onChange={handleChange}
                  />
                  {errors.user && touched.user && (
                    <ErrorMessage>{getIn(errors, 'user.lastname')}</ErrorMessage>
                  )}
                </Box>

                <Box>
                  <FormLabel htmlFor="name">Nombre:</FormLabel>
                  <Input
                    id="name"
                    name="user.name"
                    placeholder="Carlos"
                    value={values.user?.name}
                    onChange={handleChange}
                  />
                  {errors.user && touched.user && (
                    <ErrorMessage>{getIn(errors, 'user.name')}</ErrorMessage>
                  )}
                </Box>

                <Box>
                  <FormLabel htmlFor="email">Email:</FormLabel>
                  <Input
                    autoComplete="off"
                    id="email"
                    name="user.email"
                    placeholder="juanperez@gmail.com"
                    value={values.user?.email || ''}
                    onChange={handleChange}
                  />
                  {errors.user && touched.user && (
                    <ErrorMessage>{getIn(errors, 'user.email')}</ErrorMessage>
                  )}
                </Box>

                {!initialValues.id && (
                  <Flex gap="4" justifyContent="space-between">
                    <Box>
                      <FormLabel htmlFor="password">Contraseña:</FormLabel>
                      <Input
                        autoComplete="new-password"
                        id="password"
                        name="password"
                        placeholder="hola123"
                        type="password"
                        value={values.password || ''}
                        onChange={handleChange}
                      />
                      {errors.password && touched.password && (
                        <ErrorMessage>{errors.password}</ErrorMessage>
                      )}
                    </Box>
                    <Box>
                      <FormLabel htmlFor="password2">Repetir contraseña:</FormLabel>
                      <Input
                        id="password2"
                        name="password2"
                        placeholder="hola123"
                        type="password"
                        value={values.password2 || ''}
                        onChange={handleChange}
                      />
                      {errors.password2 && touched.password2 && (
                        <ErrorMessage>{errors.password2}</ErrorMessage>
                      )}
                    </Box>
                  </Flex>
                )}

                <Box>
                  <FormLabel htmlFor="description">Información extra:</FormLabel>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder=""
                    value={values.description || ''}
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
