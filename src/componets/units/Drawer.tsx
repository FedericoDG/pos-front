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

import { Unit } from '../../interfaces';
import { useCreateUnits, useUpdateUnits } from '../../hooks/';

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
  resetValues,
  setinitialValues,
  isOpen,
  onClose,
}: Props) => {
  const firstField = useRef<HTMLInputElement | null>(null);

  const { mutate: createUnit } = useCreateUnits();
  const { mutate: updateUnit } = useUpdateUnits();

  const onSubmit = (values: Unit, actions: FormikHelpers<Unit>) => {
    const parsedValues = {
      ...values,
    };

    if (values?.id) {
      updateUnit(parsedValues);
    } else {
      createUnit(parsedValues);
    }
    setinitialValues(resetValues);
    actions.resetForm();
    onClose();
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
          <DrawerHeader bg="whatsapp.600" borderBottomWidth="1px" color="white">
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
                  />
                  {errors.code && touched.code && <div>{errors.code}</div>}
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
                  {errors.name && touched.name && <div>{errors.name}</div>}
                </Box>
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
