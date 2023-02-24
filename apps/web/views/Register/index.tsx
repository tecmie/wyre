import * as React from "react";
import { FormInput, FormSelect } from "../../components";
import {
    Button,
    Flex,
    Heading,
    Link,
    Stack,
    HStack,
    Image,
    Text
} from '@chakra-ui/react';
// import 

const View = () => (
    <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>

       <Stack flex={1} >
        <Image src="/Zayroll Logo.png" alt="wyre logo" w={24} m={12}/>

        <Flex flex={1} align={{ base: '', md: 'start' }} p={12}>
          <Stack spacing={8} w={'full'} maxW={'md'}>
            <Stack>
              <Text color={'#010C14'} fontWeight={'bold'} fontSize={{ base: '3xl', md: '4xl' }}>Create Account</Text>
              <Text color="muted">
                Already have an account? <Link color='#8D1CFF' href="/login">Login</Link>
              </Text> 
            </Stack>
          
            <Stack spacing={4}>
              <FormInput
                name="company"
                type="text"
                label="Company Name"
                placeholder="e.g. Zayroll LLC"
              />
              <FormSelect
                  label="Country"
                  name="country"
                  options={[
                    { value: "gh", label: "Ghana" },
                    { value: "ng", label: "Nigeria" },
                  ]}
                />
              <FormInput
                name="name"
                type="text"
                label="Full Name"
                placeholder="e.g. john.doe@zayroll.com"
              />
               <FormInput
                  name="email"
                  type="email"
                  label="Email Address"
                  placeholder="john-mcdonald@zayroll.com"
                />
              <FormInput
                name="role"
                type="text"
                label="Job Role"
                placeholder="e.g. chief people officer"
              />
              <FormInput
                name="text"
                type="password"
                label="Password"
                placeholder="***************"
              />
              <FormInput
                name="text"
                type="password"
                label="Confirm Password"
                placeholder="***************"
              />
            </Stack>
            <Button variant="link" color="white" bgColor="#210D35" p="3"
            _hover={{
              bg: '#210D35',
            }}>
              Create Account
            </Button>
          </Stack>
        </Flex>
      </Stack>
      

      <Flex bgColor="#210D35" color="white" flex={1} align={'center'} justify={'center'} >
        
        <HStack flex={1} align={'start'} justify={'end'} >
          <Stack p={8} maxW={'md'}>
            <Heading>Zayroll</Heading>
            <Text>The open-source payroll Infrastructure for African businesses.</Text>
          </Stack>
        
          <Image
            alt={'Image'}
            src={
              'images/Payroll.png'
            }
          />
        </HStack>
      </Flex>

    </Stack>
);

export default View;