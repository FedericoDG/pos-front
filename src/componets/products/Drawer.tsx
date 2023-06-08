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

import { Category, Product, Unit } from '../../interfaces';
import { useCreateProduct, useUpdateProduct } from '../../hooks/';

import { schema } from './schemas';

interface Props {
  initialValues: Product;
  resetValues: Product;
  categories: Category[];
  units: Unit[];
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
  isOpen,
  onClose,
}: Props) => {
  const firstField = useRef<HTMLInputElement | null>(null);

  const { mutate: createProduct } = useCreateProduct();
  const { mutate: updateProduct } = useUpdateProduct();

  const onSubmit = (values: Product, actions: FormikHelpers<Product>) => {
    const parsedValues = {
      ...values,
      status: !values.status || values.status === 'DISABLED' ? 'DISABLED' : 'ENABLED',
      allownegativestock:
        !values.allownegativestock || values.allownegativestock === 'DISABLED'
          ? 'DISABLED'
          : 'ENABLED',
      categoryId: Number(values.categoryId),
      unitId: Number(values.unitId),
      alertlowstock:
        !values.alertlowstock || values.alertlowstock === 'DISABLED' ? 'DISABLED' : 'ENABLED',
      lowstock: Number(values.lowstock),
    };

    if (values?.id) {
      updateProduct(parsedValues);
    } else {
      createProduct(parsedValues);
    }
    setinitialValues(resetValues);
    actions.resetForm();
    onClose();
  };

  const close = () => {
    // resetForm();
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
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            {initialValues.id ? 'Editar producto' : 'Crear nuevo producto'}
          </DrawerHeader>
          <form onSubmit={handleSubmit}>
            <DrawerBody>
              <Stack spacing="24px">
                <Box>
                  <FormLabel htmlFor="name">Nombre</FormLabel>
                  <Input
                    ref={firstField}
                    id="name"
                    name="name"
                    placeholder="Nombre del producto..."
                    value={values.name}
                    onChange={handleChange}
                  />
                  {errors.name && touched.name && <div>{errors.name}</div>}
                </Box>

                <Flex gap="4" justifyContent="space-between">
                  <Box>
                    <FormLabel htmlFor="unitId">Unidad</FormLabel>
                    <Select
                      id="unitId"
                      minW="224px"
                      name="unitId"
                      value={values.unitId}
                      onChange={handleChange}
                    >
                      {units.map((unit) => (
                        <option key={unit.name} value={unit.id}>
                          {unit.name}
                        </option>
                      ))}
                    </Select>
                    {errors.unitId && touched.unitId && <div>{errors.unitId}</div>}
                  </Box>

                  <Box>
                    <FormLabel htmlFor="categoryId">Categoría</FormLabel>
                    <Select
                      id="categoryId"
                      minW="224px"
                      name="categoryId"
                      value={values.categoryId}
                      onChange={handleChange}
                    >
                      {categories.map((category) => (
                        <option key={category.name} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Select>
                    {errors.categoryId && touched.categoryId && <div>{errors.categoryId}</div>}
                  </Box>
                </Flex>

                <Flex gap="4" justifyContent="space-between">
                  <Box>
                    <FormLabel htmlFor="code">Código</FormLabel>
                    <Input
                      id="code"
                      name="code"
                      placeholder="Código..."
                      value={values.code}
                      onChange={handleChange}
                    />
                    {errors.code && touched.code && <div>{errors.code}</div>}
                  </Box>

                  <Box>
                    <FormLabel htmlFor="barcode">Código de Barra</FormLabel>
                    <Input
                      id="barcode"
                      name="barcode"
                      placeholder="Código de barra..."
                      value={values.barcode}
                      onChange={handleChange}
                    />
                    {errors.barcode && touched.barcode && <div>{errors.barcode}</div>}
                  </Box>
                </Flex>

                <Box>
                  <FormLabel htmlFor="description">Descripción</FormLabel>
                  <Textarea
                    id="description"
                    name="description"
                    value={values.description!}
                    onChange={handleChange}
                  />
                </Box>

                <Flex gap="4" justifyContent="space-between">
                  <Box>
                    <FormLabel htmlFor="alertlowstock">Alerta por stock bajo</FormLabel>
                    <Switch
                      defaultChecked={initialValues.alertlowstock === 'ENABLED'}
                      id="alertlowstock"
                      name="alertlowstock"
                      size="lg"
                      onChange={handleChange}
                    />
                    {errors.alertlowstock && touched.alertlowstock && (
                      <div>{errors.alertlowstock}</div>
                    )}
                  </Box>

                  <Box>
                    <FormLabel htmlFor="lowstock">Stock mínimo</FormLabel>
                    <Input
                      id="lowstock"
                      isDisabled={values.alertlowstock === 'DISABLED' || !values.alertlowstock}
                      name="lowstock"
                      placeholder="20"
                      value={values.lowstock}
                      onChange={handleChange}
                    />
                    {errors.lowstock && touched.lowstock && <div>{errors.lowstock}</div>}
                  </Box>
                </Flex>

                <Flex gap="4" justifyContent="space-between">
                  <Box>
                    <FormLabel htmlFor="status">Producto habilitado</FormLabel>
                    <Switch
                      defaultChecked={initialValues.status === 'ENABLED'}
                      id="status"
                      name="status"
                      size="lg"
                      onChange={handleChange}
                    />
                    {errors.status && touched.status && <div>{errors.status}</div>}
                  </Box>

                  <Box>
                    <FormLabel htmlFor="allownegativestock">Permitir stock negativo</FormLabel>
                    <Switch
                      colorScheme="red"
                      defaultChecked={initialValues.allownegativestock === 'ENABLED'}
                      id="allownegativestock"
                      name="allownegativestock"
                      size="lg"
                      onChange={handleChange}
                    />
                    {errors.allownegativestock && touched.allownegativestock && (
                      <div>{errors.allownegativestock}</div>
                    )}
                  </Box>
                </Flex>
              </Stack>
            </DrawerBody>

            <DrawerFooter borderTopWidth="1px" bottom="0" position="fixed" w="full">
              <Button mr={3} type="reset" variant="outline" w="full" onClick={close}>
                Cancelar
              </Button>
              <Button colorScheme="blue" type="submit" w="full">
                Guardar
              </Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </ChakraDrawer>
    </>
  );
};
