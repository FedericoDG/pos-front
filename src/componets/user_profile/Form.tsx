import { Box, Button, Text, FormLabel, Input, Stack } from '@chakra-ui/react';
import { FormikHelpers, useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { User } from '../../interfaces';
import { ErrorMessage } from '../common';
import { useUpdateUserPassword } from '../../hooks';
import { useMyContext } from '../../context';

import { schema } from './schemas';

interface Props {
  user: User;
}

interface ResetPassword {
  password: string;
  password2: string;
}

export const Form = ({ user }: Props) => {
  const { dispatchLogout } = useMyContext();

  const navigate = useNavigate();

  const initialValues = {
    password: '',
    password2: '',
  };

  const queryClient = useQueryClient();

  const onSuccess = () => {
    toast.success('Contraseña actualizada');
    queryClient.invalidateQueries({ queryKey: ['users'] });
    dispatchLogout();
    navigate('/');
  };

  const { mutate: updateUserPassword } = useUpdateUserPassword(onSuccess);

  const onSubmit = (values: ResetPassword, actions: FormikHelpers<ResetPassword>) => {
    const { password } = values;

    updateUserPassword({ id: user.id!, password });

    actions.resetForm();
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: toFormikValidationSchema(schema),
    onSubmit,
  });

  const { handleSubmit, handleChange, values, errors, touched } = formik;

  const close = () => {
    formik.resetForm();
  };

  return (
    <Box border="1px solid #ccc" p="8" rounded="md">
      <Text align="center" fontSize="lg" fontWeight="semibold">
        Cambiar contraseña
      </Text>
      <form onSubmit={handleSubmit}>
        <Stack spacing="14px">
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
            {errors.password && touched.password && <ErrorMessage>{errors.password}</ErrorMessage>}
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
        </Stack>

        <Stack direction="row" mt="4" spacing={4}>
          <Button type="reset" variant="outline" w="full" onClick={close}>
            CANCELAR
          </Button>
          <Button colorScheme="brand" type="submit" w="full">
            GUARDAR
          </Button>
        </Stack>
      </form>
    </Box>
  );
};
