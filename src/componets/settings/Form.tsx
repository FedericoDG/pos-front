import { Box, Button, FormLabel, Input, Stack, Flex } from '@chakra-ui/react';
import { FormikHelpers, useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { Settings } from '../../interfaces';
import { ErrorMessage } from '../common';
import { useUpdateSettings } from '../../hooks/useSettings';

import { schema } from './schemas';

interface Props {
  settings: Settings;
}

export const Form = ({ settings }: Props) => {
  const queryClient = useQueryClient();

  const onSuccess = () => {
    toast.info('Parámetros actualizados', {
      theme: 'colored',
      position: toast.POSITION.BOTTOM_LEFT,
      autoClose: 3000,
      closeOnClick: true,
    });
    queryClient.invalidateQueries({ queryKey: ['settings'] });
  };

  const { mutateAsync: updateSettings, isLoading } = useUpdateSettings(onSuccess);

  const onSubmit = (values: Settings, actions: FormikHelpers<Settings>) => {
    delete values.id;

    const parsedValues = {
      ...values,
      invoceNumber: Number(values.invoceNumber),
    };

    updateSettings(parsedValues);

    actions.resetForm();
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: settings,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: toFormikValidationSchema(schema),
    onSubmit,
  });

  const { handleSubmit, handleChange, values, errors, touched } = formik;

  const close = () => {
    formik.resetForm();
  };

  return (
    <Box p="4">
      <form onSubmit={handleSubmit}>
        <Flex gap="2">
          <Box w="full">
            <FormLabel htmlFor="name">Nombre de la Empresa:</FormLabel>
            <Input
              autoFocus
              id="name"
              isDisabled={isLoading}
              name="name"
              placeholder="Arcos Dorados S.A."
              type="name"
              value={values.name}
              onChange={handleChange}
            />
            {errors.name && touched.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          </Box>
          <Box w="full">
            <FormLabel htmlFor="address">Dirección:</FormLabel>
            <Input
              id="address"
              isDisabled={isLoading}
              name="address"
              placeholder="Av. San Martín 123"
              type="address"
              value={values.address}
              onChange={handleChange}
            />
            {errors.address && touched.address && <ErrorMessage>{errors.address}</ErrorMessage>}
          </Box>
          <Box w="full">
            <FormLabel htmlFor="cp">Código Postal:</FormLabel>
            <Input
              id="cp"
              isDisabled={isLoading}
              name="cp"
              placeholder="5777"
              type="cp"
              value={values.cp}
              onChange={handleChange}
            />
            {errors.cp && touched.cp && <ErrorMessage>{errors.cp}</ErrorMessage>}
          </Box>
          <Box w="full">
            <FormLabel htmlFor="province">Provincia:</FormLabel>
            <Input
              id="province"
              isDisabled={isLoading}
              name="province"
              placeholder="Córdoba"
              type="province"
              value={values.province}
              onChange={handleChange}
            />
            {errors.province && touched.province && <ErrorMessage>{errors.province}</ErrorMessage>}
          </Box>
        </Flex>

        <Flex gap="2" mt="8">
          <Box w="full">
            <FormLabel htmlFor="cuit">CUIT:</FormLabel>
            <Input
              id="cuit"
              isDisabled={isLoading}
              name="cuit"
              placeholder="30-25555666-9"
              type="cuit"
              value={values.cuit}
              onChange={handleChange}
            />
            {errors.cuit && touched.cuit && <ErrorMessage>{errors.cuit}</ErrorMessage>}
          </Box>
          <Box w="full">
            <FormLabel htmlFor="invoceName">Nombre del Comprobante X:</FormLabel>
            <Input
              id="invoceName"
              isDisabled={isLoading}
              name="invoceName"
              placeholder="Comprobante"
              type="invoceName"
              value={values.invoceName}
              onChange={handleChange}
            />
            {errors.invoceName && touched.invoceName && (
              <ErrorMessage>{errors.invoceName}</ErrorMessage>
            )}
          </Box>
          <Box w="full">
            <FormLabel htmlFor="invoceNumber">N° Próximo Comprobante:</FormLabel>
            <Input
              id="invoceNumber"
              isDisabled={isLoading}
              name="invoceNumber"
              placeholder="1"
              type="invoceNumber"
              value={values.invoceNumber}
              onChange={handleChange}
            />
            {errors.invoceNumber && touched.invoceNumber && (
              <ErrorMessage>{errors.invoceNumber}</ErrorMessage>
            )}
          </Box>
        </Flex>

        <Flex gap="2" mt="8">
          <Box w="49.4%">
            <FormLabel htmlFor="imageURL">URL logotipo (120x120):</FormLabel>
            <Input
              id="imageURL"
              isDisabled={isLoading}
              name="imageURL"
              placeholder="https://www.example.com/logo.jpg"
              type="imageURL"
              value={values.imageURL}
              onChange={handleChange}
            />
            {errors.imageURL && touched.imageURL && <ErrorMessage>{errors.imageURL}</ErrorMessage>}
          </Box>
        </Flex>

        <Stack direction="row" mt="4" spacing={4}>
          <Button type="reset" variant="outline" w="full" onClick={close}>
            Cancelar
          </Button>
          <Button
            colorScheme="brand"
            isLoading={isLoading}
            loadingText="Actualizando"
            type="submit"
            w="full"
          >
            Guardar
          </Button>
        </Stack>
      </form>
    </Box>
  );
};
