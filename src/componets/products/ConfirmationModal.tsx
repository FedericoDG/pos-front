import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';

import { Product } from '../../interfaces';
import { useDeleteProduct } from '../../hooks';

interface Props {
  initialValues: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const ConfirmationModal = ({ initialValues, isOpen, onClose }: Props) => {
  const { mutate } = useDeleteProduct();

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Eliminar Producto</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="2xl">¿Confirma la eliminación?</Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            colorScheme="red"
            variant="ghost"
            onClick={() => {
              onClose();
              mutate(initialValues.id!);
            }}
          >
            Eliminar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
