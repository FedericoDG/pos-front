/* eslint-disable prettier/prettier */
/* eslint-disable react/no-children-prop */
import { MutableRefObject, Dispatch, SetStateAction } from 'react';
import {
  Box,
  Button,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Modal as ChakraModal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react';
import { FormikHelpers, useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { z } from 'zod';

import { ErrorMessage } from '../common';
import { CashMovementsDetail } from '../../interfaces';

import { usePosContext } from '.';

interface Props {
  activeProduct: CashMovementsDetail;
  tableInput: MutableRefObject<any>;
  cancelRef: MutableRefObject<any>;
  isOpen: boolean;
  handleClose: () => void;
  setActiveProduct: Dispatch<SetStateAction<CashMovementsDetail>>;
}

interface Values {
  quantity: number;
  discount: number;
}

export const Modal = ({
  activeProduct,
  isOpen,
  handleClose,
  tableInput,
  cancelRef,
  setActiveProduct,
}: Props) => {
  const { addItem, cart } = usePosContext();

  const onSubmit = (values: Values, actions: FormikHelpers<Values>) => {

    addItem({ ...activeProduct!, quantity: values.quantity, });
    setActiveProduct({} as CashMovementsDetail);
    actions.resetForm();
    handleClose();
  };

  const onClose = () => {
    formik.resetForm();
    handleClose();
  };

  const initialValues = {
    quantity: 0,
    discount: 0,
  };

  const schema = () =>
    z.object({
      quantity: z.preprocess(
        (val) => Number(val),
        z
          .number({
            invalid_type_error: 'Sólo se permiten números'
          })
          .min(1, 'Minimo: 1')
          .max(
            activeProduct.quantity! - (cart.find((el) => el.id === activeProduct.id)?.quantity! || 0),
            `Máximo: ${activeProduct.quantity! - (cart.find((el) => el.id === activeProduct.id)?.quantity! || 0)
            }`
          )
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
          <ModalHeader>{activeProduct?.product?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="14px">
              <Box>
                <FormLabel htmlFor="quantity">Cantidad:</FormLabel>
                <InputGroup>
                  <Input
                    ref={cancelRef}
                    autoFocus
                    id="quantity"
                    name="quantity"
                    tabIndex={1}
                    value={values.quantity}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                  />
                  <InputRightAddon children={activeProduct?.product?.unit?.code} minW="56px" />
                </InputGroup>
                {errors.quantity && touched.quantity && (
                  <ErrorMessage>{errors.quantity}</ErrorMessage>
                )}
              </Box>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button tabIndex={3} type="reset" onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="brand" ml={3} tabIndex={2} type="submit">
              Agregar
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </ChakraModal>
  );
};
