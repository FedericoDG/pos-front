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
  FormLabel,
  Input,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useRef } from 'react';
import { FormikHelpers, useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import { Warehouse } from '../../interfaces';
import { useCreateWarehouse, useUpdateWarehose } from '../../hooks/';
import { ErrorMessage } from '../common';

import { schema } from './schemas';

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

  const { mutate: createWarehouse } = useCreateWarehouse();
  const { mutate: updateWarehouse } = useUpdateWarehose();

  const onSubmit = (values: Warehouse, actions: FormikHelpers<Warehouse>) => {
    const parsedValues = {
      ...values,
    };

    if (values?.id) {
      updateWarehouse(parsedValues);
    } else {
      createWarehouse(parsedValues);
    }
    setinitialValues(resetValues);
    actions.resetForm();
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
            {initialValues.id ? 'Editar Depósito' : 'Crear Depósito'}
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
                    placeholder="Depo-01"
                    value={values.code}
                    onChange={handleChange}
                    onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                  />
                  {errors.code && touched.code && <ErrorMessage>{errors.code}</ErrorMessage>}
                </Box>

                <Box>
                  <FormLabel htmlFor="description">Información extra:</FormLabel>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Depósito principal"
                    value={values.description}
                    onChange={handleChange}
                  />
                </Box>

                <Box>
                  <FormLabel htmlFor="address">Dirección:</FormLabel>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Av. San Martín 138"
                    value={values.address}
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
