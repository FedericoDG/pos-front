/* eslint-disable prettier/prettier */
/* eslint-disable react/no-children-prop */
import {
  Box,
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Select as ChakraSelect,
  Stack,
  FormLabel,
  InputGroup,
  Input,
  InputRightAddon,
  InputLeftAddon,
  ModalFooter,
  Button,
} from '@chakra-ui/react';
import { MutableRefObject, Dispatch, SetStateAction } from 'react';
import { FormikHelpers, useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { z } from 'zod';

import { Reason } from '../../interfaces';
import { ErrorMessage } from '../common';

import { CartItem, useDischargesContext } from '.';

interface Props {
  activeProduct: CartItem;
  tableInput: MutableRefObject<any>;
  cancelRef: MutableRefObject<any>;
  isOpen: boolean;
  handleClose: () => void;
  setActiveProduct: Dispatch<SetStateAction<CartItem>>;
  reasons: Reason[];
}

interface Values {
  quantity: number;
  cost: number;
  reasonId: number;
}

export const Modal = ({
  activeProduct,
  cancelRef,
  handleClose,
  isOpen,
  reasons,
  setActiveProduct,
  tableInput,
}: Props) => {
  const { addItem, cart } = useDischargesContext();

  const onSubmit = (values: Values, actions: FormikHelpers<Values>) => {
    addItem({ ...activeProduct, quantity: Number(values.quantity), cost: Number(values.cost) });
    setActiveProduct({} as CartItem);
    actions.resetForm();
    handleClose();
  };

  const onClose = () => {
    formik.resetForm();
    handleClose();
  };

  const initialValues = {
    quantity: 0,
    cost: activeProduct.cost || 0,
    reasonId: reasons[0].id,
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
            activeProduct.stock! - (cart.find((el) => el.id === activeProduct.id)?.quantity! || 0),
            `Máximo: ${activeProduct.stock! - (cart.find((el) => el.id === activeProduct.id)?.quantity! || 0)
            }`
          )
      ),
      cost: z.preprocess(
        (val) => Number(val),
        z.number({
          invalid_type_error: 'Sólo se permiten números'
        }).nonnegative('El costo no puede ser menor a 0')
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
          <ModalHeader>{activeProduct?.products?.name}</ModalHeader>
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
                    onChange={handleChange}
                    onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                  />
                  <InputRightAddon children={activeProduct?.products?.unit?.code} />
                </InputGroup>
                {errors.quantity && touched.quantity && (
                  <ErrorMessage>{errors.quantity}</ErrorMessage>
                )}
              </Box>
              <Box>
                <FormLabel htmlFor="cost">Precio de costo:</FormLabel>
                <InputGroup>
                  <InputLeftAddon children="$" />
                  <Input
                    id="cost"
                    name="cost"
                    tabIndex={2}
                    value={values.cost}
                    onChange={handleChange}
                    onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                  />
                </InputGroup>
                {errors.cost && touched.cost && (
                  <ErrorMessage>{errors.cost}</ErrorMessage>
                )}
              </Box>
              <Box>
                <FormLabel htmlFor="reasonId">Razón de la pérdida:</FormLabel>
                <ChakraSelect
                  id="reasonId"
                  minW="224px"
                  name="reasonId"
                  tabIndex={3}
                  value={values.reasonId}
                  onChange={handleChange}
                >
                  {reasons.map((reason) => (
                    <option key={reason.id} value={reason.id}>
                      {reason.reason}
                    </option>
                  ))}
                </ChakraSelect>
              </Box>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button tabIndex={5} type="reset" onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="brand" ml={3} tabIndex={4} type="submit">
              Agregar
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </ChakraModal>
  );
};
