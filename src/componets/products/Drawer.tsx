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
import { toast } from 'sonner';

import { Category, IVACondition, Product, Unit } from '../../interfaces';
import { useCreateProduct, useUpdateProduct } from '../../hooks/';
import { ErrorMessage } from '../common';

import { schema } from './schemas';

interface Props {
  initialValues: Product;
  resetValues: Product;
  categories: Category[];
  units: Unit[];
  ivaConditions: IVACondition[];
  isOpen: boolean;
  onClose: () => void;
  setinitialValues: Dispatch<SetStateAction<Product>>;
}

export const Drawer = ({
  initialValues,
  resetValues,
  setinitialValues,
  categories,
  units,
  ivaConditions,
  isOpen,
  onClose,
}: Props) => {
  const firstField = useRef<HTMLInputElement | null>(null);

  const { mutateAsync: createProduct, isLoading: isLoadingCreate } = useCreateProduct();
  const { mutateAsync: updateProduct, isLoading: isLoadingUpdate, isSuccess } = useUpdateProduct();

  const onSubmit = async (values: Product, actions: FormikHelpers<Product>) => {
    const parsedValues = {
      ...values,
      status: !values.status || values.status === 'DISABLED' ? 'DISABLED' : 'ENABLED',
      allownegativestock:
        !values.allownegativestock || values.allownegativestock === 'DISABLED'
          ? 'DISABLED'
          : 'ENABLED',
      categoryId: Number(values.categoryId),
      unitId: Number(values.unitId),
      ivaConditionId: Number(values.ivaConditionId),
      alertlowstock:
        !values.alertlowstock || values.alertlowstock === 'DISABLED' ? 'DISABLED' : 'ENABLED',
      lowstock: Number(values.lowstock),
      barcode: values.barcode.length === 12 ? '0' + values.barcode : values.barcode,
    };

    if (values?.id) {
      await updateProduct(parsedValues)
        .then(() => {
          if (isSuccess) {
            toast.success('Producto actualizado');
          }
        })
        .finally(() => {
          setinitialValues(resetValues);
          actions.resetForm();
          close();
        });
    } else {
      createProduct(parsedValues)
        .then(() => {
          if (isSuccess) {
            toast.success('Producto creado');
          }
        })
        .finally(() => {
          setinitialValues(resetValues);
          actions.resetForm();
          close();
        });
    }
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
            {initialValues.id ? 'Editar Producto' : 'Crear Producto'}
          </DrawerHeader>
          <form onSubmit={handleSubmit}>
            <DrawerBody>
              <Stack spacing="8px">
                <Box>
                  <FormLabel htmlFor="name">Nombre:</FormLabel>
                  <Input
                    ref={firstField}
                    id="name"
                    name="name"
                    placeholder="Tomate redondo"
                    value={values.name}
                    onChange={handleChange}
                    onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                  />
                  {errors.name && touched.name && <ErrorMessage>{errors.name}</ErrorMessage>}
                </Box>

                <Flex gap="4" justifyContent="space-between">
                  <Box>
                    <FormLabel htmlFor="unitId">Unidad:</FormLabel>
                    <Select
                      defaultValue={initialValues.unitId}
                      id="unitId"
                      minW="224px"
                      name="unitId"
                      onChange={handleChange}
                    >
                      {units.map((unit) => (
                        <option key={unit.name} value={unit.id}>
                          {unit.name}
                        </option>
                      ))}
                    </Select>
                    {errors.unitId && touched.unitId && (
                      <ErrorMessage>{errors.unitId}</ErrorMessage>
                    )}
                  </Box>

                  <Box>
                    <FormLabel htmlFor="categoryId">Categoría:</FormLabel>
                    <Select
                      defaultValue={initialValues.categoryId}
                      id="categoryId"
                      minW="224px"
                      name="categoryId"
                      onChange={handleChange}
                    >
                      {categories.map((category) => (
                        <option key={category.name} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Select>
                    {errors.categoryId && touched.categoryId && (
                      <ErrorMessage>{errors.categoryId}</ErrorMessage>
                    )}
                  </Box>
                </Flex>

                <Flex gap="4" justifyContent="space-between">
                  <Box>
                    <FormLabel htmlFor="ivaConditionId">Condición IVA:</FormLabel>
                    <Select
                      defaultValue={initialValues.ivaConditionId}
                      id="ivaConditionId"
                      minW="224px"
                      name="ivaConditionId"
                      onChange={handleChange}
                    >
                      {ivaConditions.map((condition) => (
                        <option key={condition.code} value={condition.id}>
                          {condition.description}
                        </option>
                      ))}
                    </Select>
                    {errors.ivaConditionId && touched.ivaConditionId && (
                      <ErrorMessage>{errors.ivaConditionId}</ErrorMessage>
                    )}
                  </Box>
                </Flex>

                <Flex gap="4" justifyContent="space-between">
                  <Box>
                    <FormLabel htmlFor="code">Código:</FormLabel>
                    <Input
                      id="code"
                      name="code"
                      placeholder="tomre"
                      value={values.code}
                      onChange={handleChange}
                    />
                    {errors.code && touched.code && <ErrorMessage>{errors.code}</ErrorMessage>}
                  </Box>

                  <Box>
                    <FormLabel htmlFor="barcode">Código de Barra:</FormLabel>
                    <Input
                      id="barcode"
                      name="barcode"
                      placeholder="012345678912"
                      value={values.barcode}
                      onChange={handleChange}
                    />
                    {errors.barcode && touched.barcode && (
                      <ErrorMessage>{errors.barcode}</ErrorMessage>
                    )}
                  </Box>
                </Flex>

                <Box>
                  <FormLabel htmlFor="description">Descripción:</FormLabel>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Tomate redondo primera calidad"
                    value={values.description!}
                    onChange={handleChange}
                  />
                </Box>

                <Flex gap="4" justifyContent="space-between">
                  <Box>
                    <FormLabel htmlFor="status">Producto habilitado:</FormLabel>
                    <Switch
                      colorScheme="brand"
                      defaultChecked={initialValues.status === 'ENABLED'}
                      id="status"
                      name="status"
                      size="md"
                      onChange={handleChange}
                    />
                  </Box>

                  <Box>
                    <FormLabel htmlFor="allownegativestock">Permitir stock negativo:</FormLabel>
                    <Switch
                      colorScheme="red"
                      defaultChecked={initialValues.allownegativestock === 'ENABLED'}
                      id="allownegativestock"
                      name="allownegativestock"
                      size="md"
                      onChange={handleChange}
                    />
                  </Box>
                </Flex>

                <Flex gap="4" justifyContent="space-between">
                  <Box>
                    <FormLabel htmlFor="alertlowstock">Alerta por stock bajo:</FormLabel>
                    <Switch
                      colorScheme="brand"
                      defaultChecked={initialValues.alertlowstock === 'ENABLED'}
                      id="alertlowstock"
                      name="alertlowstock"
                      size="md"
                      onChange={handleChange}
                    />
                  </Box>

                  <Box>
                    <FormLabel htmlFor="lowstock">Stock mínimo:</FormLabel>
                    <Input
                      id="lowstock"
                      isDisabled={values.alertlowstock === 'DISABLED' || !values.alertlowstock}
                      name="lowstock"
                      placeholder="20"
                      value={values.lowstock}
                      onChange={handleChange}
                      onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                    />
                  </Box>
                </Flex>
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
