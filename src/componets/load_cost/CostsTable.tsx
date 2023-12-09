/* eslint-disable react/no-children-prop */
import {
  Box,
  Button,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FormikHelpers, useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { z } from 'zod';

import { CustomTable } from '../table';
import { useMyContext } from '../../context';
import { useGetStocks } from '../../hooks';
import { ErrorMessage } from '../common';

import { useColumns } from './hooks/useColumns';

import { CartItem, useCostsContext } from '.';

interface Values {
  cost: number;
}

export const CostTable = () => {
  const { addItem } = useCostsContext();
  const { tableInput } = useMyContext();

  const { data: stocks } = useGetStocks();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [activeProduct, setActiveProduct] = useState({} as CartItem);

  const { columns } = useColumns({ onOpen, setActiveProduct });

  const handleClose = () => {
    setActiveProduct({} as CartItem);
    onClose();
    formik.resetForm();
    tableInput.current.select();
  };

  const onSubmit = (values: Values, actions: FormikHelpers<Values>) => {
    const cost = Number(values.cost);

    addItem({ ...activeProduct, cost });

    setActiveProduct({} as CartItem);
    actions.resetForm();
    handleClose();
  };

  const initialValues = {
    cost: activeProduct.cost,
  };

  const schema = () =>
    z.object({
      cost: z.preprocess(
        (val) => Number(val),
        z
          .number({
            invalid_type_error: 'Sólo se permiten números',
          })
          .min(1, 'Mínimo: 1')
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

  const { handleSubmit, handleChange, errors, touched } = formik;

  if (!stocks) return null;

  return (
    <Box width="64%">
      <CustomTable
        showGlobalFilter
        showNavigation
        amount={stocks.length}
        columns={columns}
        data={stocks}
        flag="products"
      />

      <Modal finalFocusRef={tableInput} isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay backdropFilter="blur(5px) hue-rotate(90deg)" bg="blackAlpha.300" />
        <form onSubmit={handleSubmit}>
          <ModalContent>
            <ModalHeader>{activeProduct?.products?.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing="14px">
                <Box>
                  <FormLabel htmlFor="cost">Precio de costo:</FormLabel>
                  <InputGroup>
                    <InputLeftAddon children="$" />
                    <Input
                      autoFocus
                      defaultValue={activeProduct?.cost}
                      id="cost"
                      name="cost"
                      tabIndex={1}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                    />
                  </InputGroup>
                  {errors.cost && touched.cost && <ErrorMessage>{errors.cost}</ErrorMessage>}
                </Box>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button tabIndex={3} type="reset" onClick={handleClose}>
                Cancelar
              </Button>
              <Button colorScheme="brand" ml={3} tabIndex={2} type="submit">
                Agregar
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </Box>
  );
};
