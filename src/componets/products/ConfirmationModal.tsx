import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';

import { Product } from '../../interfaces';
import { useDeleteProduct } from '../../hooks';

interface Props {
  initialValues: Product;
  resetValues: Product;
  isOpen: boolean;
  onClose: () => void;
  setinitialValues: Dispatch<SetStateAction<Product>>;
}

export const ConfirmationModal = ({
  initialValues,
  resetValues,
  setinitialValues,
  isOpen,
  onClose,
}: Props) => {
  const { mutate } = useDeleteProduct();

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay backdropFilter="blur(5px) hue-rotate(90deg)" bg="blackAlpha.300" />
      <ModalContent>
        <ModalHeader>Eliminar Producto</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="2xl">¿Confirma la eliminación?</Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="brand" mr={3} onClick={onClose}>
            CANCELAR
          </Button>
          <Button
            colorScheme="red"
            variant="ghost"
            onClick={() => {
              onClose();
              mutate(initialValues.id!);
              setinitialValues(resetValues);
            }}
          >
            ELIMINAR
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
