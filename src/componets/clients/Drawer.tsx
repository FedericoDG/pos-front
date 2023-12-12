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

import { Client, Identification, IvaType, State } from '../../interfaces';
import { ErrorMessage } from '../common';
import { useCreateClient, useUpdateClient } from '../../hooks/';

import { schema, schema2 } from './schemas';

interface Props {
  initialValues: Client;
  identifications: Identification[];
  ivaTypes: IvaType[];
  states: State[];
  resetValues: Client;
  isOpen: boolean;
  onClose: () => void;
  setinitialValues: Dispatch<SetStateAction<Client>>;
}

export const Drawer = ({
  initialValues,
  identifications,
  ivaTypes,
  states,
  resetValues,
  setinitialValues,
  isOpen,
  onClose,
}: Props) => {
  const firstField = useRef<HTMLInputElement | null>(null);

  const { mutateAsync: createClient, isLoading: isLoadingCreate } = useCreateClient();
  const { mutateAsync: updateClient, isLoading: isLoadingUpdate } = useUpdateClient();

  const onSubmit = async (values: Client) => {
    delete values.password2;

    const parsedValues = {
      ...values,
      identificationId: Number(values.identificationId),
      ivaTypeId: Number(values.ivaTypeId),
      stateId: Number(values.stateId),
      city: values.city.toUpperCase(),
    };

    if (values?.id) {
      updateClient(parsedValues)
        .then(() => toast.success('Cliente actualizado'))
        .finally(() => {
          close();
        });
    } else {
      createClient(parsedValues)
        .then(() => toast.success('Cliente creado'))
        .finally(() => {
          close();
        });
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
    // resetForm();
    //formik.setTouched({}, false);
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
        size="lg"
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
            {initialValues.id ? 'Editar Cliente' : 'Crear Cliente'}
          </DrawerHeader>
          <form onSubmit={handleSubmit}>
            <DrawerBody>
              <Stack spacing="14px">
                <Flex gap="4" justifyContent="space-between">
                  <Box w="full">
                    <FormLabel htmlFor="name">Razón Social:</FormLabel>
                    <Input
                      ref={firstField}
                      id="name"
                      name="name"
                      placeholder="Juan"
                      value={values.name}
                      onChange={handleChange}
                      onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                    />
                    {errors.name && touched.name && <ErrorMessage>{errors.name}</ErrorMessage>}
                  </Box>
                  <Box w="full">
                    <FormLabel htmlFor="email">Email:</FormLabel>
                    <Input
                      autoComplete="off"
                      id="email"
                      name="email"
                      placeholder="juanperez@gmail.com"
                      value={values.email}
                      onChange={handleChange}
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
                  <Box w="67%">
                    <FormLabel htmlFor="identificationId">Tipo de identificación:</FormLabel>
                    <Select
                      defaultValue={initialValues.identificationId}
                      id="identificationId"
                      name="identificationId"
                      onChange={handleChange}
                    >
                      {identifications.map((identification) => (
                        <option key={identification.code} value={identification.id}>
                          {identification.code} - {identification.description}
                        </option>
                      ))}
                    </Select>
                    {errors.identificationId && touched.identificationId && (
                      <ErrorMessage>{errors.identificationId}</ErrorMessage>
                    )}
                  </Box>
                  <Box w="33%">
                    <FormLabel htmlFor="document">Número:</FormLabel>
                    <Input
                      id="document"
                      name="document"
                      placeholder="28809909"
                      value={values.document}
                      onChange={handleChange}
                    />
                    {errors.document && touched.document && (
                      <ErrorMessage>{errors.document}</ErrorMessage>
                    )}
                  </Box>
                </Flex>

                <Flex gap="4" justifyContent="space-between">
                  <Box w="full">
                    <FormLabel htmlFor="ivaTypeId">Condición IVA:</FormLabel>
                    <Select
                      defaultValue={initialValues.ivaTypeId}
                      id="ivaTypeId"
                      minW="224px"
                      name="ivaTypeId"
                      onChange={handleChange}
                    >
                      {ivaTypes.map((ivaType) => (
                        <option key={ivaType.code} value={ivaType.id}>
                          {ivaType.code} - {ivaType.description}
                        </option>
                      ))}
                    </Select>
                    {errors.ivaTypeId && touched.ivaTypeId && (
                      <ErrorMessage>{errors.ivaTypeId}</ErrorMessage>
                    )}
                  </Box>
                </Flex>

                <Flex gap="4" justifyContent="space-between" />

                {/* {!initialValues.id && (
                  <Flex gap="4" justifyContent="space-between">
                    <Box w="full">
                      <FormLabel htmlFor="password">Contraseña:</FormLabel>
                      <Input
                        autoComplete="new-password"
                        id="password"
                        name="password"
                        placeholder="hola123"
                        type="password"
                        value={values.password}
                        onChange={handleChange}
                      />
                      {errors.password && touched.password && (
                        <ErrorMessage>{errors.password}</ErrorMessage>
                      )}
                    </Box>
                    <Box w="full">
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
                )} */}

                <Flex gap="4" justifyContent="space-between">
                  <Box>
                    <FormLabel htmlFor="phone">Teléfono:</FormLabel>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="11436874"
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
                      placeholder="11614155"
                      value={values.mobile}
                      onChange={handleChange}
                    />
                    {errors.mobile && touched.mobile && (
                      <ErrorMessage>{errors.mobile}</ErrorMessage>
                    )}
                  </Box>
                  <Box w="505px">
                    <FormLabel htmlFor="address">Dirección:</FormLabel>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Av. San Martín 358"
                      value={values.address}
                      onChange={handleChange}
                    />
                  </Box>
                </Flex>

                <Box>
                  <FormLabel htmlFor="info">Información extra:</FormLabel>
                  <Textarea
                    id="info"
                    name="info"
                    placeholder="Edificio de rejas negras."
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
              <Button
                colorScheme="brand"
                isLoading={isLoadingCreate || isLoadingUpdate}
                loadingText="Guardando"
                type="submit"
                w="full"
              >
                Guardar
              </Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </ChakraDrawer>
    </>
  );
};
