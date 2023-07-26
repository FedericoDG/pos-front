import {
  Box,
  Button,
  Drawer as ChakraDrawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormLabel,
  Input,
  Select,
  Stack,
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useRef } from 'react';
import { FormikHelpers, useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import { Role, User } from '../../interfaces';
import { ErrorMessage } from '../common';
import { useCreateUser, useUpdateUser } from '../../hooks/';

import { schema, schema2 } from './schemas';

interface Props {
  initialValues: User;
  isOpen: boolean;
  onClose: () => void;
  resetValues: User;
  roles: Role[];
  setinitialValues: Dispatch<SetStateAction<User>>;
}

export const Drawer = ({
  initialValues,
  isOpen,
  onClose,
  resetValues,
  roles,
  setinitialValues,
}: Props) => {
  const firstField = useRef<HTMLInputElement | null>(null);

  const { mutate: createUser } = useCreateUser();
  const { mutate: updateUser } = useUpdateUser();

  const onSubmit = (values: User, actions: FormikHelpers<User>) => {
    const { password2, ...rest } = values;

    if (values?.id) {
      updateUser(rest);
    } else {
      createUser(rest);
    }
    setinitialValues(resetValues);
    actions.resetForm();
    onClose();
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: initialValues.id
      ? () => toFormikValidationSchema(schema2)
      : () => toFormikValidationSchema(schema),
    onSubmit,
  });

  const { handleSubmit, handleChange, values, errors, touched } = formik;

  const close = () => {
    // resetForm();
    //formik.setTouched({}, false);
    formik.resetForm();
    setinitialValues(resetValues);
    onClose();
  };

  const role = (role: string) => {
    if (role === 'SUPERADMIN') return 'Súper Administrador';
    if (role === 'ADMIN') return 'Administrador';
    if (role === 'SELLER') return 'Vendedor';
    if (role === 'USER') return 'Usuario';
  };

  return (
    <>
      <ChakraDrawer
        initialFocusRef={firstField}
        isOpen={isOpen}
        placement="right"
        size="md"
        onClose={close}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton color="white" />
          <DrawerHeader
            bgGradient="linear(to-r, brand.600, blue.500)"
            borderBottomWidth="1px"
            color="white"
          >
            {initialValues.id ? 'Editar Usuario' : 'Crear Usuario'}
          </DrawerHeader>
          <form onSubmit={handleSubmit}>
            <DrawerBody>
              <Stack spacing="14px">
                <Flex gap="4" justifyContent="space-between">
                  <Box>
                    <FormLabel htmlFor="name">Nombre:</FormLabel>
                    <Input
                      ref={firstField}
                      id="name"
                      name="name"
                      placeholder="Juan"
                      value={values.name}
                      onChange={handleChange}
                      onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                    />
                    {errors.name && touched.name && <ErrorMessage>{errors.name}</ErrorMessage>}
                  </Box>
                  <Box>
                    <FormLabel htmlFor="lastname">Apellido:</FormLabel>
                    <Input
                      id="lastname"
                      name="lastname"
                      placeholder="Pérez"
                      value={values.lastname}
                      onChange={handleChange}
                    />
                    {errors.lastname && touched.lastname && (
                      <ErrorMessage>{errors.lastname}</ErrorMessage>
                    )}
                  </Box>
                </Flex>

                <Flex gap="4" justifyContent="space-between">
                  <Box>
                    <FormLabel htmlFor="roleId">Rol:</FormLabel>
                    <Select
                      id="roleId"
                      minW="224px"
                      name="roleId"
                      value={initialValues.role?.id}
                      onChange={handleChange}
                    >
                      {roles.map((unit) => (
                        <option key={unit.name} value={unit.id}>
                          {role(unit.name)}
                        </option>
                      ))}
                    </Select>
                    {errors.roleId && touched.roleId && (
                      <ErrorMessage>{errors.roleId}</ErrorMessage>
                    )}
                  </Box>
                  <Box>
                    <FormLabel htmlFor="email">Email:</FormLabel>
                    <Input
                      autoComplete="off"
                      id="email"
                      name="email"
                      placeholder="juanperez@gmail.com"
                      value={values.email}
                      onChange={handleChange}
                    />
                    {errors.email && touched.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                  </Box>
                </Flex>

                {!initialValues.id && (
                  <Flex gap="4" justifyContent="space-between">
                    <Box>
                      <FormLabel htmlFor="password">Contraseña:</FormLabel>
                      <Input
                        autoComplete="new-password"
                        id="password"
                        name="password"
                        placeholder="hola123"
                        type="password"
                        value={values.password}
                        onChange={handleChange}
                      />
                      {errors.password && touched.password && (
                        <ErrorMessage>{errors.password}</ErrorMessage>
                      )}
                    </Box>
                    <Box>
                      <FormLabel htmlFor="password2">Repetir contraseña:</FormLabel>
                      <Input
                        id="password2"
                        name="password2"
                        placeholder="hola123"
                        type="password"
                        value={values.password2 || ''}
                        onChange={handleChange}
                      />
                      {errors.password2 && touched.password2 && (
                        <ErrorMessage>{errors.password2}</ErrorMessage>
                      )}
                    </Box>
                  </Flex>
                )}
              </Stack>
            </DrawerBody>

            <DrawerFooter borderTopWidth="1px" bottom="0" position="fixed" w="full">
              <Button mr={3} type="reset" variant="outline" w="full" onClick={close}>
                Cancelar
              </Button>
              <Button colorScheme="brand" type="submit" w="full">
                Guardar
              </Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </ChakraDrawer>
    </>
  );
};
