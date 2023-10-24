import { Box, Icon, Flex, HStack, Text, Image } from '@chakra-ui/react';
import { FaEnvelope } from 'react-icons/fa';
import { FaUserCircle } from 'react-icons/fa';

import { User } from '../../interfaces';
import { getRole } from '../../utils';

interface Props {
  user: User;
}

export const Card = ({ user }: Props) => {
  return (
    <Flex alignItems="center" bg="gray.50" direction="column" justifyContent="center" rounded="lg">
      <Box
        alignItems="left"
        bg="brand.500"
        borderRadius="lg"
        display="flex"
        height="100%"
        p={8}
        style={{
          backgroundImage:
            'url(https://t3.ftcdn.net/jpg/02/36/23/66/360_F_236236696_mTYBnVvXVykDspnSwLdzo16jqjdVLdXy.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        width="100%"
      >
        <Image
          alt="Imagen de Perfil"
          // border="5px solid"
          // borderColor="#4D5499"
          borderRadius="full"
          boxSize="150px"
          mb={-20}
          shadow="lg"
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
        />
      </Box>
      <Box
        borderRadius="lg"
        gridColumn="span 8"
        height="full"
        mt={10}
        p={8}
        textAlign="left"
        width="full"
      >
        <Text color="gray.600" fontSize="3xl" fontWeight="bold">
          {user.name} {user.lastname}
        </Text>
        <HStack color="gray.600" spacing={3}>
          <Icon as={FaUserCircle} fontSize={22} />
          <Text color="gray.600" fontSize="xl" fontWeight="bold">
            {getRole(user.role?.name!)}
          </Text>
        </HStack>
        <HStack color="gray.600" spacing={3}>
          <FaEnvelope size={20} />
          <Text fontSize="lg">{user.email}</Text>
        </HStack>
      </Box>
    </Flex>
  );
};
