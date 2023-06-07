import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Image,
  Text,
} from '@chakra-ui/react';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { Formik, Form, Field, ErrorMessage } from 'formik';
//import axios from 'axios';

import { schema } from '../componets/login/schema';
import { postRequest } from '../services/httpRequest';
import { useMyContext } from '../context';
import { sessionStorage } from '../utils';

export const Login = () => {
  const { dispatchLogin } = useMyContext();
  const login = async (body: any) => {
    try {
      // setFetching(true);

      const {
        body: { user, token },
      } = await postRequest('/auth/login', {
        email: 'superadmin@gmail.com',
        password: 'super33',
      });

      // const data = await axios.post('http://localhost:3005/auth/login', body);

      // setFetching(false);

      sessionStorage.write('user', { ...user, logged: true });
      sessionStorage.write('token', token);

      dispatchLogin(user);
      /* enqueueSnackbar('Login exitoso', {
        variant: 'success',
        autoHideDuration: 2000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
      }); */
    } catch (error: any) {
      // setFetching(false);
      /* enqueueSnackbar(error.response.data.msg, {
        variant: 'error',
        autoHideDuration: 2000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
      }); */

      throw new Error(error);
    }
  };

  return (
    <Stack bg="grey.100" direction={{ base: 'column', md: 'row' }} minH="100vh">
      <Flex align="center" flex="1" justify="center" p="8">
        <Stack maxW="md" spacing="4" w="full">
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
                <FormLabel>Correo Electrónico</FormLabel>
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
                <FormLabel>Contraseña</FormLabel>
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
                <Button colorScheme="whatsapp" type="submit" variant="solid">
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
