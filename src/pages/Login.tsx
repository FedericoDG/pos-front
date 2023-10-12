import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { toast } from 'sonner';

import { postRequest } from '../services/';
import { schema } from '../componets/login/schemas/';
import { sessionStorage } from '../utils';
import { useMyContext } from '../context';

interface LoginI {
  email: string;
  password: string;
}

export const Login = () => {
  const { dispatchLogin } = useMyContext();
  const login = async (values: LoginI) => {
    try {
      const {
        body: { user, token },
      } = await postRequest('/auth/login', values);

      sessionStorage.write('user', { ...user, logged: true });
      sessionStorage.write('token', token);

      dispatchLogin(user);
    } catch (error: any) {
      toast.error('Usuario y/o contraseña inválida');
      throw new Error(error);
    }
  };

  return (
    <Stack direction={{ base: 'column', md: 'row' }} minH="100vh">
      <Flex align="center" bg="gray.100" flex="1" justify="center" p="8">
        <Stack bg="white" maxW="md" p="4" rounded="md" shadow="md" spacing="4" w="full">
          <Heading fontSize="2xl" textAlign="center">
            Acceda con su cuenta
          </Heading>
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validateOnBlur={false}
            validateOnChange={false}
            validationSchema={toFormikValidationSchema(schema)}
            onSubmit={login}
          >
            <Form>
              <FormControl id="email">
                <FormLabel>Correo Electrónico:</FormLabel>
                <Input as={Field} name="email" type="text" />
                <ErrorMessage name="email">
                  {(msg) => (
                    <Text
                      as="span"
                      bg="red.500"
                      color="white"
                      fontSize="x-small"
                      fontWeight="semibold"
                      mb="1"
                      px="1"
                    >
                      {msg}
                    </Text>
                  )}
                </ErrorMessage>
              </FormControl>
              <FormControl id="password">
                <FormLabel>Contraseña:</FormLabel>
                <Input as={Field} name="password" type="password" />
                <ErrorMessage name="password">
                  {(msg) => (
                    <Text
                      as="span"
                      bg="red.500"
                      color="white"
                      fontSize="x-small"
                      fontWeight="semibold"
                      mb="1"
                      px="1"
                    >
                      {msg}
                    </Text>
                  )}
                </ErrorMessage>
              </FormControl>
              <Stack mt="3">
                <Button colorScheme="brand" type="submit" variant="solid">
                  INICIAR SESIÓN
                </Button>
              </Stack>
            </Form>
          </Formik>
        </Stack>
      </Flex>
      <Flex flex="1">
        <Image
          alt="Login Image"
          objectFit="cover"
          src={
            'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
          }
        />
      </Flex>
    </Stack>
  );
};
