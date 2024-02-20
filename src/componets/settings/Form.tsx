import {
  Box,
  Button,
  FormLabel,
  Input,
  Select,
  Stack,
  Flex,
  Divider,
  Heading,
  FormControl,
  Switch,
} from '@chakra-ui/react';
import { FormikHelpers, useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';

import { Afip, Settings } from '../../interfaces';
import { ErrorMessage } from '../common';
import { useUpdateSettings } from '../../hooks/useSettings';
import { useUpdateAfip } from '../../hooks';
import { Pricelists } from '../../interfaces/interfaces';

import { schema } from './schemas';

interface Props {
  settings: Settings;
  afip: Afip;
  priceLists: Pricelists[];
}

export const Form = ({ afip, settings, priceLists }: Props) => {
  const queryClient = useQueryClient();

  const onSuccess = () => {
    toast.success('Parámetros del sitio actualizados');
    queryClient.invalidateQueries({ queryKey: ['settings'] });
  };

  const onSuccess2 = () => {
    toast.success('Parámetros de AFIP sitio actualizados');
    queryClient.invalidateQueries({ queryKey: ['afip'] });
  };

  const { mutateAsync: updateSettings, isLoading: isLoadingSettings } =
    useUpdateSettings(onSuccess);
  const { mutateAsync: updateAfipSettings, isLoading: isLoadingAfipSettings } =
    useUpdateAfip(onSuccess2);

  const isLoading = isLoadingSettings && isLoadingAfipSettings;

  const onSubmit = (values: Settings & Afip, actions: FormikHelpers<Settings & Afip>) => {
    const { posNumber, maxPerInvoice, invoiceM, showOtherTaxes, ...rest } = values;

    delete rest.id;
    delete rest.certExpiration;
    delete rest.nextInvoceNumberA;
    delete rest.nextInvoceNumberNCA;
    delete rest.nextInvoceNumberB;
    delete rest.nextInvoceNumberNCB;
    delete rest.nextInvoceNumberM;
    delete rest.nextInvoceNumberNCM;

    const parsedValuesSettings = {
      ...rest,
      invoceNumber: Number(values.invoceNumber),
      showOtherTaxes: showOtherTaxes ? 1 : 0,
      defaultPriceListDriver: Number(values.defaultPriceListDriver),
    };

    const parsedValuesAfip = {
      posNumber: Number(posNumber),
      maxPerInvoice: Number(maxPerInvoice),
      invoiceM: invoiceM ? 1 : 0,
    };

    updateSettings(parsedValuesSettings);
    updateAfipSettings(parsedValuesAfip);

    actions.resetForm();
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...settings, ...afip },
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
        <Flex direction="column" gap="2">
          <Heading size="md">Parámetros del Sitio</Heading>
          <Divider w="full" />
        </Flex>

        <Flex gap="2" mt="10">
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
              placeholder="30-24555666-9"
              type="cuit"
              value={values.cuit}
              onChange={handleChange}
            />
            {errors.cuit && touched.cuit && <ErrorMessage>{errors.cuit}</ErrorMessage>}
          </Box>
          <Box w="full">
            <FormLabel htmlFor="start">Inicio de Actividades:</FormLabel>
            <Input
              id="start"
              isDisabled={isLoading}
              name="start"
              placeholder="01/01/2000"
              type="start"
              value={values.start}
              onChange={handleChange}
            />
            {errors.start && touched.start && <ErrorMessage>{errors.start}</ErrorMessage>}
          </Box>
          <Box w="full">
            <FormLabel htmlFor="invoceName">Nombre del Comprobante Int.:</FormLabel>
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
            <FormLabel htmlFor="invoceNumber">N° Próx. Comprobante Int.:</FormLabel>
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
          <Box w="full">
            <FormControl alignItems="center" display="flex">
              <Switch
                colorScheme="brand"
                defaultChecked={settings.showOtherTaxes === 1}
                id="showOtherTaxes"
                name="showOtherTaxes"
                size="md"
                onChange={handleChange}
              />
              <FormLabel htmlFor="filter" mb="0" ml="2">
                Hahilitar Otros Impuestos
              </FormLabel>
            </FormControl>
          </Box>
        </Flex>

        <Flex gap="2" mt="8">
          <Box w="full">
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

        <Flex direction="column" gap="2" mt="8">
          <Heading size="md">Parámetros de AFIP</Heading>
          <Divider w="full" />
        </Flex>

        <Flex gap="2" mt="8">
          <Box w="full">
            <FormControl alignItems="center" display="flex">
              <Switch
                colorScheme="brand"
                defaultChecked={afip.invoiceM === 1}
                id="invoiceM"
                name="invoiceM"
                size="md"
                onChange={handleChange}
              />
              <FormLabel htmlFor="filter" mb="0" ml="2">
                Utilizar Factura M
              </FormLabel>
            </FormControl>
          </Box>
        </Flex>

        <Flex gap="2" mt="8">
          <Box w="full">
            <FormLabel htmlFor="posNumber">Punto de Venta:</FormLabel>
            <Input
              id="posNumber"
              isDisabled={isLoading}
              name="posNumber"
              placeholder="92720"
              type="posNumber"
              value={values.posNumber}
              onChange={handleChange}
            />
            {errors.posNumber && touched.posNumber && (
              <ErrorMessage>{errors.posNumber}</ErrorMessage>
            )}
          </Box>

          <Box w="full">
            <FormLabel htmlFor="maxPerInvoice">
              Máx. Importe de Facturación p/Identificar a Cons. Finales:
            </FormLabel>
            <Input
              id="maxPerInvoice"
              isDisabled={isLoading}
              name="maxPerInvoice"
              placeholder="92720"
              type="maxPerInvoice"
              value={values.maxPerInvoice}
              onChange={handleChange}
            />
            {errors.maxPerInvoice && touched.maxPerInvoice && (
              <ErrorMessage>{errors.maxPerInvoice}</ErrorMessage>
            )}
          </Box>
        </Flex>

        <Flex gap="2" mt="8">
          <Box w="full">
            <FormLabel htmlFor="nextInvoceNumberA">Sig. Factura A:</FormLabel>
            <Input
              id="nextInvoceNumberA"
              isDisabled={true}
              name="nextInvoceNumberA"
              type="nextInvoceNumberA"
              value={values.nextInvoceNumberA}
            />
          </Box>
          <Box w="full">
            <FormLabel htmlFor="nextInvoceNumberB">Sig. Factura B:</FormLabel>
            <Input
              id="nextInvoceNumberB"
              isDisabled={true}
              name="nextInvoceNumberB"
              type="nextInvoceNumberB"
              value={values.nextInvoceNumberB}
            />
          </Box>
          <Box w="full">
            <FormLabel htmlFor="nextInvoceNumberM">Sig. Factura M:</FormLabel>
            <Input
              id="nextInvoceNumberM"
              isDisabled={true}
              name="nextInvoceNumberM"
              type="nextInvoceNumberM"
              value={values.nextInvoceNumberM}
            />
          </Box>
        </Flex>
        <Flex gap="2" mt="8">
          <Box w="full">
            <FormLabel htmlFor="nextInvoceNumberNCA">Sig. Nota de Crédito A:</FormLabel>
            <Input
              id="nextInvoceNumberNCA"
              isDisabled={true}
              name="nextInvoceNumber"
              type="nextInvoceNumberNCA"
              value={values.nextInvoceNumberNCA}
            />
          </Box>
          <Box w="full">
            <FormLabel htmlFor="nextInvoceNumberNCB">Sig. Nota de Crédito B:</FormLabel>
            <Input
              id="nextInvoceNumberNCB"
              isDisabled={true}
              name="nextInvoceNumberNCB"
              type="nextInvoceNumberNCB"
              value={values.nextInvoceNumberNCB}
            />
          </Box>
          <Box w="full">
            <FormLabel htmlFor="nextInvoceNumberNCM">Sig. Nota de Crédito M:</FormLabel>
            <Input
              id="nextInvoceNumberNCM"
              isDisabled={true}
              name="nextInvoceNumberNCM"
              type="nextInvoceNumberNCM"
              value={values.nextInvoceNumberNCM}
            />
          </Box>
        </Flex>

        <Flex direction="column" gap="2" mt="8">
          <Heading size="md">Parámetros de Aplicación Móvil</Heading>
          <Divider w="full" />
        </Flex>
        <Flex gap="2" mt="8">
          <Box w="49%">
            <FormLabel htmlFor="defaultPriceListDriver">Lista de precios para Choferes:</FormLabel>
            <Select
              id="defaultPriceListDriver"
              name="defaultPriceListDriver"
              value={values.defaultPriceListDriver}
              onChange={handleChange}
            >
              {priceLists.map((state) => (
                <option key={state.code} value={state.id}>
                  {state.code}
                </option>
              ))}
            </Select>
            {errors.defaultPriceListDriver && touched.defaultPriceListDriver && (
              <ErrorMessage>{errors.defaultPriceListDriver}</ErrorMessage>
            )}
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
