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
import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { toast } from 'sonner';

import { Category } from '../../interfaces';
import { useCreateCategory, useUpdateCategory } from '../../hooks/';
import { ErrorMessage } from '../common';

import { schema } from './schemas';

interface Props {
  initialValues: Category;
  resetValues: Category;
  isOpen: boolean;
  onClose: () => void;
  setinitialValues: Dispatch<SetStateAction<Category>>;
}

export const Drawer = ({
  initialValues,
  resetValues,
  setinitialValues,
  isOpen,
  onClose,
}: Props) => {
  const firstField = useRef<HTMLInputElement | null>(null);

  const { mutateAsync: createCategory } = useCreateCategory();
  const { mutateAsync: updateCategory } = useUpdateCategory();

  const onSubmit = (values: Category) => {
    const parsedValues = {
      ...values,
    };

    if (values?.id) {
      updateCategory(parsedValues)
        .then(() => {
          toast.success('Categoría actualizada');
        })
        .finally(() => close());
    } else {
      createCategory(parsedValues)
        .then(() => {
          toast.success('Categoría actualizada');
        })
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
            {initialValues.id ? 'Editar Categoría' : 'Crear Categoría'}
          </DrawerHeader>
          <form onSubmit={handleSubmit}>
            <DrawerBody>
              <Stack spacing="24px">
                <Box>
                  <FormLabel htmlFor="name">Nombre:</FormLabel>
                  <Input
                    ref={firstField}
                    id="name"
                    name="name"
                    placeholder="Lácteos"
                    value={values.name}
                    onChange={handleChange}
                    onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                  />
                  {errors.name && touched.name && <ErrorMessage>{errors.name}</ErrorMessage>}
                </Box>
                <Box>
                  <FormLabel htmlFor="description">Descripción:</FormLabel>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Productos láctos y similares."
                    value={values.description}
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
