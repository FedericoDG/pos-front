/* eslint-disable react/no-children-prop */
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
  InputGroup,
  InputLeftAddon,
  Stack,
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useRef } from 'react';
import { FormikHelpers, useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';

import { ErrorMessage } from '../common';
import { useCreateCost } from '../../hooks';

import { schemaCost } from './schemas';

interface Cost {
  productId: number;
  cost: number;
}

interface Props {
  initialValues: Cost;
  resetValues: Cost;
  isOpen: boolean;
  onClose: () => void;
  setinitialValues: Dispatch<SetStateAction<Cost>>;
}

export const DrawerCost = ({
  initialValues,
  isOpen,
  onClose,
  resetValues,
  setinitialValues,
}: Props) => {
  const firstField = useRef<HTMLInputElement | null>(null);

  const queryClient = useQueryClient();

  const [_, setSearchParams] = useSearchParams();

  const onSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: ['products'],
    });
    toast.success('Costo actualizado');
  };

  const { mutate: createCost } = useCreateCost(onSuccess);

  const onSubmit = (values: Cost, actions: FormikHelpers<Cost>) => {
    const parsedValues = {
      cart: [
        {
          productId: Number(initialValues.productId),
          price: Number(values.cost),
        },
      ],
    };

    createCost(parsedValues);

    setinitialValues(resetValues);
    actions.resetForm();
    onClose();
  };

  const close = () => {
    formik.resetForm();
    setinitialValues(resetValues);
    onClose();
    setSearchParams('tab=0');
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: () => toFormikValidationSchema(schemaCost),
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
            Cargar Pérdida de stock
          </DrawerHeader>
          <form onSubmit={handleSubmit}>
            <DrawerBody>
              <Stack spacing="14px">
                <Flex gap="4" justifyContent="space-between">
                  <Box w="full">
                    <FormLabel htmlFor="cost">Costo:</FormLabel>
                    <InputGroup>
                      <InputLeftAddon children="$" />
                      <Input
                        autoFocus
                        id="cost"
                        name="cost"
                        placeholder="0"
                        value={values.cost}
                        onChange={handleChange}
                        onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                      />
                    </InputGroup>
                    {errors.cost && touched.cost && <ErrorMessage>{errors.cost}</ErrorMessage>}
                  </Box>
                </Flex>
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
