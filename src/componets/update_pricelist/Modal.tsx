/* eslint-disable react/no-children-prop */
import { MutableRefObject, Dispatch, SetStateAction } from 'react';
import {
  Box,
  Button,
  FormLabel,
  Input,
  InputGroup,
  Modal as ChakraModal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  InputLeftAddon,
} from '@chakra-ui/react';
import { FormikHelpers, useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { z } from 'zod';

import { ErrorMessage } from '../common';

import { CartItem, useUpdatePriceContext } from '.';

interface Props {
  activeProduct: CartItem;
  tableInput: MutableRefObject<any>;
  cancelRef: MutableRefObject<any>;
  isOpen: boolean;
  handleClose: () => void;
  setActiveProduct: Dispatch<SetStateAction<CartItem>>;
}

interface Values {
  newPrice: number;
}

export const Modal = ({
  activeProduct,
  isOpen,
  handleClose,
  tableInput,
  cancelRef,
  setActiveProduct,
}: Props) => {
  const { addItem } = useUpdatePriceContext();

  const onSubmit = (values: Values, actions: FormikHelpers<Values>) => {
    addItem({ ...activeProduct!, newPrice: Number(values.newPrice) });
    setActiveProduct({} as CartItem);
    actions.resetForm();
    handleClose();
  };

  const onClose = () => {
    formik.resetForm();
    handleClose();
  };

  const initialValues = {
    newPrice: activeProduct.newPrice,
  };

  const schema = () =>
    z.object({
      newPrice: z.preprocess(
        (val) => Number(val),
        z
          .number({
            invalid_type_error: 'Sólo se permiten números',
          })
          .min(1, 'Minimo: 1')
      ),
    });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: () => toFormikValidationSchema(schema()),
    onSubmit,
  });

  const { handleSubmit, handleChange, values, errors, touched } = formik;

  return (
    <ChakraModal finalFocusRef={tableInput} isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay backdropFilter="blur(5px) hue-rotate(90deg)" bg="blackAlpha.300" />
      <form onSubmit={handleSubmit}>
        <ModalContent>
          <ModalHeader>{activeProduct?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="14px">
              <Box>
                <FormLabel htmlFor="newPrice">Cantidad:</FormLabel>
                <InputGroup>
                  <InputLeftAddon children="$" />
                  <Input
                    ref={cancelRef}
                    autoFocus
                    defaultValue={values.newPrice}
                    id="newPrice"
                    name="newPrice"
                    tabIndex={1}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                  />
                </InputGroup>
                {errors.newPrice && touched.newPrice && (
                  <ErrorMessage>{errors.newPrice}</ErrorMessage>
                )}
              </Box>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button tabIndex={3} type="reset" onClick={onClose}>
              CANCELAR
            </Button>
            <Button colorScheme="brand" ml={3} tabIndex={2} type="submit">
              AGREGAR
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </ChakraModal>
  );
};
