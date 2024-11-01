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
  Tooltip,
  RadioGroup,
  Radio,
} from '@chakra-ui/react';
import { FormikHelpers, useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';
import { useState } from 'react';

import { Afip, Settings } from '../../interfaces';
import { ErrorMessage } from '../common';
import { useUpdateSettings } from '../../hooks/useSettings';
import { useUpdateAfip } from '../../hooks';
import { Pricelists } from '../../interfaces/interfaces';
import { responsables } from '../../utils/responsable';
import { useMyContext } from '../../context';
import { sessionStorage } from '../../utils';

import { schema } from './schemas';

interface Props {
  settings: Settings;
  afip: Afip;
  priceLists: Pricelists[];
}

export const Form = ({ afip, settings, priceLists }: Props) => {
  const { setResponsableInscripto, setPosEnabled } = useMyContext();
  const [resp, setResp] = useState(() => settings.responsableInscripto);
  const [posE, setPosE] = useState(() => settings.posEnabled);
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
    const { posNumber, maxPerInvoice, invoiceM, showOtherTaxes, posEnabled, ...rest } = values;

    delete rest.id;
    delete rest.certExpiration;
    delete rest.nextInvoceNumberA;
    delete rest.nextInvoceNumberNCA;
    delete rest.nextInvoceNumberB;
    delete rest.nextInvoceNumberNCB;
    delete rest.nextInvoceNumberC;
    delete rest.nextInvoceNumberNCC;
    delete rest.nextInvoceNumberM;
    delete rest.nextInvoceNumberNCM;

    const parsedValuesSettings = {
      ...rest,
      invoceNumber: Number(values.invoceNumber),
      showOtherTaxes: showOtherTaxes ? 1 : 0,
      responsableInscripto: resp,
      ivaCondition: responsables[Number(resp)].name,
      defaultPriceListDriver: Number(values.defaultPriceListDriver),
      posEnabled: Boolean(posE),
    };

    const parsedValuesAfip = {
      posNumber: Number(posNumber),
      maxPerInvoice: Number(maxPerInvoice),
      invoiceM: invoiceM ? 1 : 0,
    };

    updateSettings(parsedValuesSettings).then(() => {
      sessionStorage.write2('responsableInscripto', resp.toString());
      sessionStorage.write2('posEnabled', Boolean(posEnabled).toString());
      setResponsableInscripto(resp);
      setPosEnabled(Boolean(posEnabled));
    });
    updateAfipSettings(parsedValuesAfip);

    actions.resetForm();
  };

  const initialValues = {
    ...settings,
    ...afip,
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
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
            <Tooltip label="Este campo es solo para mostrar en los tickets/faturas. NO ESTÁ RELACIONADO CON LOS CERTIFICADOS PARA FACTURACIÓN DE AFIP.">
              <FormLabel htmlFor="cuit">CUIT:</FormLabel>
            </Tooltip>
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
            <FormLabel htmlFor="invoceName">Nombre Comprobante Int.:</FormLabel>
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
            <Tooltip
              bg={'red.600'}
              label="CUIDADO: Realizar cambios en este campo puede corromper su base de datos."
            >
              <FormLabel htmlFor="invoceNumber">N° Próx. Comprobante Int.:</FormLabel>
            </Tooltip>
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

        <Flex alignItems={'center'} gap="2" justifyContent={'flex-start'} mt="8">
          <Box>
            <FormControl alignItems="center" display="flex">
              <Switch
                colorScheme="red"
                defaultChecked={settings.posEnabled}
                id="posEnabled"
                name="posEnabled"
                size="md"
                onChange={(e) => {
                  setPosE(Boolean(e.target.checked));
                  handleChange(e);
                }}
              />
              <FormLabel htmlFor="filter" mb="0" ml="2">
                Hablilitar Punto de Venta Fiscal
              </FormLabel>
            </FormControl>
          </Box>
          <Box>
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
                Habilitar Otros Impuestos
              </FormLabel>
            </FormControl>
          </Box>
        </Flex>

        <Flex gap="2" mt="8">
          <Box w="49.5%">
            <Tooltip label="Tamaño recomendado: 120px por 120px">
              <FormLabel htmlFor="imageURL">URL logotipo:</FormLabel>
            </Tooltip>
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

        <Flex alignItems={'flex-end'} gap="2" justifyContent={'space-between'} mt="8">
          <Box w="74%">
            <Tooltip label="Establece qué tipo de comprobante emitirá el sistema.">
              <FormLabel htmlFor="responsableInscripto">Condición Fiscal:</FormLabel>
            </Tooltip>
            <RadioGroup
              id="responsableInscripto"
              name="responsableInscripto"
              value={resp.toString()}
              onChange={(e) => setResp(Number(e))}
            >
              <Stack direction="row" spacing={5}>
                {responsables.map((el) => (
                  <Radio key={el.id} colorScheme="brand" value={el.id.toString()}>
                    {el.name}
                  </Radio>
                ))}
                {/*  <Radio colorScheme="brand" value="0">
                  Responsable Inscripto
                </Radio>
                <Radio colorScheme="brand" value="1">
                  Responsable Monotributo
                </Radio>
                <Radio colorScheme="brand" value="2">
                  Exento
                </Radio> */}
              </Stack>
            </RadioGroup>
          </Box>
          <Box>
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
          {settings.responsableInscripto === 0 ? (
            <>
              <Box w="full">
                <FormLabel htmlFor="nextInvoceNumberA">Siguiente Factura A:</FormLabel>
                <Input
                  id="nextInvoceNumberA"
                  isDisabled={true}
                  name="nextInvoceNumberA"
                  type="nextInvoceNumberA"
                  value={values.nextInvoceNumberA}
                />
              </Box>
              <Box w="full">
                <FormLabel htmlFor="nextInvoceNumberM">Siguiente Factura M:</FormLabel>
                <Input
                  id="nextInvoceNumberM"
                  isDisabled={true}
                  name="nextInvoceNumberM"
                  type="nextInvoceNumberM"
                  value={values.nextInvoceNumberM}
                />
              </Box>
              <Box w="full">
                <FormLabel htmlFor="nextInvoceNumberB">Siguiente Factura B:</FormLabel>
                <Input
                  id="nextInvoceNumberB"
                  isDisabled={true}
                  name="nextInvoceNumberB"
                  type="nextInvoceNumberB"
                  value={values.nextInvoceNumberB}
                />
              </Box>
            </>
          ) : (
            <Box w="49%">
              <FormLabel htmlFor="nextInvoceNumberC">Siguiente Factura C:</FormLabel>
              <Input
                id="nextInvoceNumberC"
                isDisabled={true}
                name="nextInvoceNumberC"
                type="nextInvoceNumberC"
                value={values.nextInvoceNumberC}
              />
            </Box>
          )}
        </Flex>
        <Flex gap="2" mt="8">
          {settings.responsableInscripto === 0 ? (
            <>
              <Box w="full">
                <FormLabel htmlFor="nextInvoceNumberNCA">Siguiente Nota de Crédito A:</FormLabel>
                <Input
                  id="nextInvoceNumberNCA"
                  isDisabled={true}
                  name="nextInvoceNumber"
                  type="nextInvoceNumberNCA"
                  value={values.nextInvoceNumberNCA}
                />
              </Box>
              <Box w="full">
                <FormLabel htmlFor="nextInvoceNumberNCM">Siguiente Nota de Crédito M:</FormLabel>
                <Input
                  id="nextInvoceNumberNCM"
                  isDisabled={true}
                  name="nextInvoceNumberNCM"
                  type="nextInvoceNumberNCM"
                  value={values.nextInvoceNumberNCM}
                />
              </Box>
              <Box w="full">
                <FormLabel htmlFor="nextInvoceNumberNCB">Siguiente Nota de Crédito B:</FormLabel>
                <Input
                  id="nextInvoceNumberNCB"
                  isDisabled={true}
                  name="nextInvoceNumberNCB"
                  type="nextInvoceNumberNCB"
                  value={values.nextInvoceNumberNCB}
                />
              </Box>
            </>
          ) : (
            <Box w="49%">
              <FormLabel htmlFor="nextInvoceNumberNCC">Siguiente Nota de Crédito C:</FormLabel>
              <Input
                id="nextInvoceNumberNCC"
                isDisabled={true}
                name="nextInvoceNumberNCC"
                type="nextInvoceNumberNCC"
                value={values.nextInvoceNumberNCC}
              />
            </Box>
          )}
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
            CANCELAR
          </Button>
          <Button
            colorScheme="brand"
            isLoading={isLoading}
            loadingText="Actualizando"
            type="submit"
            w="full"
          >
            GUARDAR
          </Button>
        </Stack>
      </form>
    </Box>
  );
};
