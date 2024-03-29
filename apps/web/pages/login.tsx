import { useToast } from '@chakra-ui/react';
import type { GetServerSidePropsContext } from 'next';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';
import z from 'zod';
import { getServerAuthSession } from '@wyrecc/api';
import { useForm } from '../components/forms';
import { Meta } from '../layouts';
import View from '../views/Login';

const loginValidationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(32),
});

type FormInputOptions = z.infer<typeof loginValidationSchema>;

export default function Page() {
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = React.useCallback(
    async (data: FormInputOptions) => {
      const response = await signIn('credentials', {
        email: data.email,
        password: data.password,
        callbackUrl: '/demo',
        redirect: false,
      });

      if (response?.status != 200) {
        toast({
          description: response?.error,
          status: 'error',
          duration: 5000,
          position: 'top-right',
          isClosable: true,
        });
      } else {
        router.push('/dashboard');
      }
    },
    [toast, router]
  );

  const { renderForm, formState } = useForm<FormInputOptions>({
    onSubmit: handleSubmit,
    defaultValues: { email: '', password: '' },
    schema: loginValidationSchema,
  });

  return renderForm(
    <>
      <Meta />
      <View isSubmitting={formState.isSubmitting} />
    </>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
