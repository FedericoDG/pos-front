/* eslint-disable prettier/prettier */
/* eslint-disable react/no-children-prop */
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
  Select,
  Textarea,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { z } from 'zod';
import { toast } from 'sonner';

import { ErrorMessage } from '../common';
import { PaymentMethod } from '../../interfaces/interfaces';
import { useCreateCurrentAccountPayment } from '../../hooks';


interface Props {
  paymentMetods: PaymentMethod[];
  isOpen: boolean;
  handleClose: () => void;
  max: number;
  currentAccountId: number;
}

interface Values {
  amount: number;
  paymentMethodId: number;
  details: string;
}

export const Modal = ({
  isOpen,
  handleClose,
  paymentMetods,
  max,
  currentAccountId
}: Props) => {

  const { mutateAsync, isLoading } = useCreateCurrentAccountPayment();

  const onSubmit = (values: Values) => {

    const data = { ...values, amount: Number(values.amount), currentAccountId, paymentMethodId: Number(values.paymentMethodId), type: 'PAYMENT' };

    mutateAsync(data).then(() => {
      toast.success('Pago Creado');
    }).finally(() => {
      onClose();
    });
  };

  const onClose = () => {
    formik.resetForm();
    handleClose();
  };

  const initialValues = {
    amount: 0,
    paymentMethodId: 1,
    details: ''
  };

  const schema = () =>
    z.object({
      amount: z.preprocess(
        (val) => Number(val),
        z
          .number({
            invalid_type_error: 'Sólo se permiten números'
          })
          .min(1, 'Mínimo: 1')
          .max(
            max,
            `Máximo: $${max}`
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
    <ChakraModal /* finalFocusRef={tableInput}  */ isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay backdropFilter="blur(5px) hue-rotate(90deg)" bg="blackAlpha.300" />
      <form onSubmit={handleSubmit}>
        <ModalContent>
          <ModalHeader>{''}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="14px">
              <Box>
                <FormLabel htmlFor="amount">Monto:</FormLabel>
                <InputGroup>
                  <InputLeftAddon children={'$'} minW="56px" />
                  <Input
                    autoFocus
                    autoComplete='off'
                    id="amount"
                    name="amount"
                    tabIndex={1}
                    value={values.amount}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                  />
                </InputGroup>
                {errors.amount && touched.amount && (
                  <ErrorMessage>{errors.amount}</ErrorMessage>
                )}
              </Box>
              <Box>
                <FormLabel htmlFor="paymentMethodId">Método de Pago:</FormLabel>
                <Select
                  defaultValue={initialValues.paymentMethodId}
                  id="paymentMethodId"
                  name="paymentMethodId"
                  onChange={handleChange}
                >
                  {paymentMetods.map((state) => (
                    <option key={state.code} value={state.id}>
                      {state.code}
                    </option>
                  ))}
                </Select>
                {errors.paymentMethodId && touched.paymentMethodId && (
                  <ErrorMessage>{errors.paymentMethodId}</ErrorMessage>
                )}
              </Box>
              <Box>
                <FormLabel htmlFor="details">Detalles:</FormLabel>
                <Textarea
                  id="details"
                  name="details"
                  placeholder="Cualquier información que crea que es relevante..."
                  value={values.details}
                  onChange={handleChange}
                />
              </Box>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button tabIndex={3} type="reset" onClick={onClose}>
              CANCELAR
            </Button>
            <Button colorScheme="brand" disabled={isLoading} ml={3} tabIndex={2} type="submit">
              Aceptar
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </ChakraModal>
  );
};
