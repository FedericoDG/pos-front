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

import { Client } from '../../interfaces';
import { useDeleteClient } from '../../hooks';

interface Props {
  initialValues: Client;
  resetValues: Client;
  isOpen: boolean;
  onClose: () => void;
  setinitialValues: Dispatch<SetStateAction<Client>>;
}

export const ConfirmationModal = ({
  initialValues,
  resetValues,
  setinitialValues,
  isOpen,
  onClose,
}: Props) => {
  const { mutate } = useDeleteClient();

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay backdropFilter="blur(5px) hue-rotate(90deg)" bg="blackAlpha.300" />
      <ModalContent>
        <ModalHeader>Eliminar Cliente</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="2xl">¿Confirma la eliminación?</Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="brand" mr={3} onClick={onClose}>
            Cancelar
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
            Eliminar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
