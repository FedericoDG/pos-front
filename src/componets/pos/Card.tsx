import {
  Box,
  Button,
  FormLabel,
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
import { Select } from 'chakra-react-select';
import { useEffect, useState, FC } from 'react';
import { TableContainer, Table, Thead, Tr, Th, Tbody, Td } from '@chakra-ui/react';

import { Loading } from '../common';
import { useGetClients } from '../../hooks';

import { SelectedClient, usePosContext } from '.';

interface Props {
  disableBtn: boolean;
}

export const Card: FC<Props> = ({ disableBtn }) => {
  const { client, warehouse, priceList, setClient, invoceType } = usePosContext();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [mappedClients, setMappedClients] = useState<SelectedClient[]>([]);

  const { data: clients } = useGetClients();

  useEffect(() => {
    if (!clients) return;

    let mappedClients = clients.map((el) => ({
      ...el,
      value: el.id,
      label: `${el.document} - ${el.name}`,
    }));

    if (invoceType?.code === '001') {
      mappedClients = mappedClients.filter((el) => el.identificationId === 25);
    }

    setMappedClients(mappedClients);
  }, [clients, invoceType?.code]);

  if (!clients) return <Loading />;

  return (
    <Stack
      alignItems="flex-start"
      bg="white"
      direction="row"
      justifyContent="space-between"
      mb="2"
      p="4"
      rounded="md"
      shadow="md"
      w="full"
    >
      <TableContainer display={'flex'} gap={8} w="full">
        <Table size="sm">
          <Thead>
            <Tr>
              <Th
                bg="brand.500"
                borderBottomWidth="1"
                borderColor="black"
                borderStyle="solid"
                colSpan={2}
                color="white"
                h={30}
              >
                Lista de Precio
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td borderBottomWidth="0" fontSize={18}>
                {priceList?.code.toUpperCase()}
              </Td>
            </Tr>
            <Tr>
              <Td borderColor="brand.500">{priceList?.description}</Td>
            </Tr>
          </Tbody>
        </Table>

        <Table size="sm">
          <Thead>
            <Tr>
              <Th
                bg="brand.500"
                borderBottomWidth="1"
                borderColor="black"
                borderStyle="solid"
                colSpan={2}
                color="white"
                h={30}
              >
                Depósito
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td borderBottomWidth="0" fontSize={18}>
                {warehouse?.code.toUpperCase()}
              </Td>
            </Tr>
            <Tr>
              <Td borderColor="brand.500">{warehouse?.description}</Td>
            </Tr>
          </Tbody>
        </Table>

        <Table size="sm">
          <Thead>
            <Tr>
              <Th
                bg="brand.500"
                borderBottomWidth="1"
                borderColor="black"
                borderStyle="solid"
                colSpan={2}
                color="white"
                h={30}
              >
                Tipo de Comprobante
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td borderBottomWidth="0" fontSize={18}>
                {invoceType?.description.toUpperCase()}
              </Td>
            </Tr>
            <Tr>
              <Td borderColor="brand.500" color="transparent">
                .
              </Td>
            </Tr>
          </Tbody>
        </Table>

        <Table size="sm">
          <Thead>
            <Tr>
              <Th
                bg="brand.500"
                borderBottomWidth="1"
                borderColor="brand.500"
                borderStyle="solid"
                colSpan={2}
                color="white"
                h={30}
              >
                Cliente
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td borderBottomWidth="0" fontSize={16}>
                {client?.identification?.description!}: {client?.document}
              </Td>
            </Tr>
            <Tr>
              <Td borderColor="brand.500">{client?.name}</Td>
              <Td borderColor="brand.500">
                <Button
                  colorScheme="brand"
                  display="block"
                  isDisabled={disableBtn /* || !iva */}
                  ml="auto"
                  size="xs"
                  variant={'solid'}
                  onClick={onOpen}
                >
                  CAMBIAR
                </Button>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modificar Cliente</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack direction="row">
              <Box w="full">
                <FormLabel htmlFor="warehouse">Cliente:</FormLabel>
                <Select
                  autoFocus
                  isSearchable
                  colorScheme="brand"
                  isDisabled={!priceList?.value || !warehouse?.value}
                  name="client"
                  options={mappedClients}
                  placeholder="Seleccionar Cliente"
                  selectedOptionColorScheme="brand"
                  value={client}
                  onChange={(e) => {
                    setClient(e);
                    onClose();
                  }}
                />
              </Box>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="brand" onClick={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
};
