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

import { Unit } from '../../interfaces';
import { useCreateUnits, useUpdateUnits } from '../../hooks/';
import { ErrorMessage } from '../common';

import { schema } from './schemas';

interface Props {
  initialValues: Unit;
  resetValues: Unit;
  isOpen: boolean;
  onClose: () => void;
  setinitialValues: Dispatch<SetStateAction<Unit>>;
}

export const Drawer = ({
  initialValues,
  isOpen,
  onClose,
  resetValues,
  setinitialValues,
}: Props) => {
  const firstField = useRef<HTMLInputElement | null>(null);

  const { mutateAsync: createUnit } = useCreateUnits();
  const { mutateAsync: updateUnit } = useUpdateUnits();

  const onSubmit = (values: Unit) => {
    const parsedValues = {
      ...values,
    };

    if (values?.id) {
      updateUnit(parsedValues)
        .then(() => toast.success('Unidad actualizada'))
        .finally(() => close());
    } else {
      createUnit(parsedValues)
        .then(() => toast.success('Unidad creada'))
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
                    placeholder="Kg."
                    value={values.code}
                    onChange={handleChange}
                    onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                  />
                  <ErrorMessage>
                    {errors.code && touched.code && <div>{errors.code}</div>}
                  </ErrorMessage>
                </Box>
                <Box>
                  <FormLabel htmlFor="name">Nombre:</FormLabel>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Kilogramos"
                    value={values.name}
                    onChange={handleChange}
                  />
                  <ErrorMessage>
                    {errors.name && touched.name && <div>{errors.name}</div>}
                  </ErrorMessage>
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
