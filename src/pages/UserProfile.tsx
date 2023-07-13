import { Flex, Box } from '@chakra-ui/react';

import { DashBoard, Loading } from '../componets/common';
import { useGetUser } from '../hooks';
import { Card, Form } from '../componets/user_profile';
import { useMyContext } from '../context';

export const UserProfile = () => {
  const {
    user: { id },
  } = useMyContext();

  const { data: user, isFetching: isFetchingUser } = useGetUser(Number(id));

  const isIndeterminate = isFetchingUser;

  return (
    <DashBoard isIndeterminate={isIndeterminate} title="Detalles del Producto">
      {!user ? (
        <Loading />
      ) : (
        <Flex
          alignItems="center"
          bg="white"
          gap={8}
          justifyContent="space-between"
          maxW="1024px"
          p={50}
          rounded="md"
          shadow="md"
          w="full"
        >
          <Box>
            <Card user={user} />
          </Box>
          <Box w="50%">
            <Form user={user} />
          </Box>
        </Flex>
      )}
    </DashBoard>
  );
};
