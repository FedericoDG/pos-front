/* eslint-disable react/no-children-prop */
import { Button, HStack, Input, InputGroup, InputRightAddon, Stack } from '@chakra-ui/react';
import { TableContainer, Table, Thead, Tr, Th, Tbody, Td } from '@chakra-ui/react';

import { useUpdatePricePercentageContext } from '.';

export const Card = () => {
  const { priceList, percentage, setPercentage, isDisabled, setIsDisabled } =
    useUpdatePricePercentageContext();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (e.currentTarget.percentage.value > 0) {
      setPercentage(e.currentTarget.percentage.value);
      setIsDisabled(true);
    }
  };

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
                Porcentage a aplicar
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td borderColor="brand.500" fontSize={18}>
                <form onSubmit={handleSubmit}>
                  <HStack>
                    <InputGroup>
                      <Input
                        autoFocus
                        defaultValue={percentage}
                        id="percentage"
                        isDisabled={isDisabled}
                        name="percentage"
                        size={'lg'}
                        type="number"
                        onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                      />
                      <InputRightAddon children="%" h={12} />
                    </InputGroup>
                    <Button colorScheme="brand" isDisabled={isDisabled} type="submit" w="full">
                      APLICAR
                    </Button>
                  </HStack>
                </form>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
