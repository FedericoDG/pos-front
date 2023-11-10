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
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useRef } from 'react';
import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { toast } from 'sonner';

import { Pricelists } from '../../interfaces';
import { useCreatePriceLists, useUpdatePriceLists } from '../../hooks/';
import { ErrorMessage } from '../common';

import { schema } from './schemas';

interface Props {
  initialValues: Pricelists;
  resetValues: Pricelists;
  isOpen: boolean;
  onClose: () => void;
  setinitialValues: Dispatch<SetStateAction<Pricelists>>;
}

export const Drawer = ({
  initialValues,
  resetValues,
  setinitialValues,
  isOpen,
  onClose,
}: Props) => {
  const firstField = useRef<HTMLInputElement | null>(null);

  const { mutateAsync: createPriceList } = useCreatePriceLists();
  const { mutateAsync: updatePriceList } = useUpdatePriceLists();

  const onSubmit = (values: Pricelists /* , actions: FormikHelpers<Pricelists> */) => {
    const parsedValues = {
      ...values,
    };

    if (values?.id) {
      updatePriceList(parsedValues)
        .then(() => toast.success('Lista de Precios actualizada'))
        .finally(() => close());
    } else {
      createPriceList(parsedValues)
        .then(() => toast.success('Lista de Precios creada'))
        .finally(() => close());
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
            {initialValues.id ? 'Editar Unidad' : 'Crear Unidad'}
          </DrawerHeader>
          <form onSubmit={handleSubmit}>
            <DrawerBody>
              <Stack spacing="24px">
                <Box>
                  <FormLabel htmlFor="code">Código:</FormLabel>
                  <Input
                    ref={firstField}
                    id="code"
                    name="code"
                    placeholder="Lista-XX"
                    value={values.code}
                    onChange={handleChange}
                    onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                  />
                  <ErrorMessage>
                    {errors.code && touched.code && <div>{errors.code}</div>}
                  </ErrorMessage>
                </Box>
                <Box>
                  <FormLabel htmlFor="description">Descripción:</FormLabel>
                  <Input
                    id="description"
                    name="description"
                    placeholder="Otra lista de precio"
                    value={values.description}
                    onChange={handleChange}
                  />
                  <ErrorMessage>
                    {errors.description && touched.description && <div>{errors.description}</div>}
                  </ErrorMessage>
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
