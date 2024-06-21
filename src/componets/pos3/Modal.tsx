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
import { useMyContext } from '../../context/AppProvider';

import { CartItem, usePosContext } from '.';

interface Props {
  activeProduct: CartItem;
  tableInput: MutableRefObject<any>;
  cancelRef: MutableRefObject<any>;
  isOpen: boolean;
  handleClose: () => void;
  setActiveProduct: Dispatch<SetStateAction<CartItem>>;
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
  const { addItem, cart, iva, setTotalDiscount } = usePosContext();
  const { user } = useMyContext();

  const onSubmit = (values: Values, actions: FormikHelpers<Values>) => {
    const discount = Number(values.discount);

    if (iva) {
      if (discount > 0) {
        addItem({ ...activeProduct!, quantity: values.quantity, price: activeProduct.price * (1 - discount / 100), hasDiscount: true, discount: discount, error: false, tax: Number(activeProduct.ivaCondition?.tax) });
      } else {
        addItem({ ...activeProduct!, quantity: values.quantity, hasDiscount: false, discount: 0, error: false, tax: Number(activeProduct.ivaCondition?.tax) });
      }
    } else {
      if (discount > 0) {
        setTotalDiscount(curr => curr + activeProduct.price * discount / 100);
        //addItem({ ...activeProduct!, quantity: values.quantity, price: activeProduct.price * (1 - discount / 100), hasDiscount: true, discount: discount, error: false, tax: 0 });
        addItem({ ...activeProduct!, quantity: values.quantity, totalDiscount: activeProduct.price * values.quantity * (discount / 100), hasDiscount: true, discount: discount, error: false, tax: 0 });
      } else {
        addItem({ ...activeProduct!, quantity: values.quantity, totalDiscount: 0, hasDiscount: false, discount: 0, error: false, tax: 0 });
      }
    }
    setActiveProduct({} as CartItem);
    actions.resetForm();
    handleClose();
  };

  const onClose = () => {
    formik.resetForm();
    handleClose();
  };

  const initialValues = {
    quantity: 1,
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
            activeProduct.allownegativestock === 'DISABLED' || user.role?.name === 'DRIVER'
              ? activeProduct.stock! -
              (cart.find((el) => el.id === activeProduct.id)?.quantity! || 0)
              : 999999,
            `Máximo: ${activeProduct.stock! - (cart.find((el) => el.id === activeProduct.id)?.quantity! || 0)
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
          <ModalHeader>{activeProduct?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="14px">
              <Box>
                <FormLabel htmlFor="quantity">Cantidad:</FormLabel>
                <InputGroup>
                  <Input
                    ref={cancelRef}
                    autoFocus
                    autoComplete='off'
                    id="quantity"
                    name="quantity"
                    tabIndex={1}
                    value={values.quantity}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                  />
                  <InputRightAddon children={activeProduct?.unit?.code} minW="56px" />
                </InputGroup>
                {errors.quantity && touched.quantity && (
                  <ErrorMessage>{errors.quantity}</ErrorMessage>
                )}
              </Box>
              <Box>
                <FormLabel htmlFor="discount">Descuento:</FormLabel>
                <InputGroup>
                  <Input
                    autoComplete='off'
                    id="discount"
                    name="discount"
                    tabIndex={1}
                    value={values.discount}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                  />
                  <InputRightAddon children="%" minW="56px" />
                </InputGroup>
                {errors.discount && touched.discount && (
                  <ErrorMessage>{errors.discount}</ErrorMessage>
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
