import { Avatar, Button, HStack, Stack, Text, useToast,
  useTab,
  useMultiStyleConfig,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Grid,
  GridItem,
  Icon,
  Flex, } from "@chakra-ui/react";
import type { Ref } from "react";
import React from "react";
import { GoPrimitiveDot } from "react-icons/go";
import z from "zod";

import styledToast from "../../../components/core/StyledToast";
import { FormInput, FormSelect, useForm } from "../../../components/forms";
import { trpc } from "../../../utils/trpc";
import { ProfileIcon } from "./ProviderIcons";

type ContractorFormProps = {
  contractor: any | null; // update the type to match the employee object type
};

const addContractorValidationSchema = z.object({
  name: z.string().min(1, { message: "Required" }).optional().default(""),
  email: z.string().email().optional().default(""),
  department: z.string().min(1, { message: "Required" }).optional().default(""),
  jobRole: z.string().min(1, { message: "Required" }).optional().default(""),
  // grossSalary: z.string().min(1, { message: "Required" }),
  // signingBonus: z.string().min(1, { message: "Required" }),
  category: z.string().optional().default(""),
});

type FormInputOptions = z.infer<typeof addContractorValidationSchema>;

interface CustomTabProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function ContractorForm({ contractor }: ContractorFormProps) {
  const toast = useToast();

  const CustomTab = React.forwardRef(({ children, ...props }: CustomTabProps, ref: Ref<HTMLElement>) => {
    const tabProps = useTab({ ...props, ref });
    const isSelected = !!tabProps["aria-selected"];

    const styles = useMultiStyleConfig("Tabs", tabProps);

    return (
      <Button __css={styles.tab} {...tabProps}>
        <Flex
          alignItems="center"
          fontWeight={isSelected ? "bold" : "normal"}
          color={isSelected ? "#8D1CFF" : " #D2D2D2"}>
          {children}
          {isSelected ? (
            <Icon as={GoPrimitiveDot} w={5} h={5} ml={2} />
          ) : (
            <Icon as={GoPrimitiveDot} w={5} h={5} />
          )}
        </Flex>
      </Button>
    );
  });

  CustomTab.displayName = "CustomTab";

  const { name, email, department, jobRole, category, salary, signBonus } = contractor ?? {};

  const { mutate: updateContractor, isLoading } = trpc.employee.updateEmployee.useMutation({
    onSuccess(data: any) {
      // Reset the form data to empty values
      styledToast({
        status: "success",
        description: "Profile has been updated successfully",
        toast: toast,
      });
    },
    onError(error: any) {
      toast({
        status: "error",
        description: `${error}`,
        isClosable: true,
        duration: 5000,
        position: "top-right",
      });
      console.log(error);
    },
  });

  const handleSubmit = async (data: FormInputOptions) => {
    console.log(JSON.stringify(data));
    try {
      updateContractor({
        id: contractor.id, // pass the ID of the contractor that you want to update
        data: {
          name: data.name,
          email: data.email,
          department: data.department,
          jobRole: data.jobRole,
          salary: contractor.salary,
          signBonus: contractor.signBonus,
          status: true,
          category: data.category as "CONTRACTOR" | "EMPLOYEE", // cast the category to the correct type
        },
      });
    } catch (error) {
      console.error(error);
    }
  };
  const { renderForm } = useForm<FormInputOptions>({
    onSubmit: handleSubmit,
    defaultValues: {
      name: name,
      email: email,
      department: department,
      jobRole: jobRole,
      category: category,
      // grossSalary: "",
      // signingBonus: ""
    },
    schema: addContractorValidationSchema,
  });

  const { mutate: terminateEmployee, isLoading: isTerminating } = trpc.employee.updateEmployee.useMutation({
    onSuccess(data: any) {
      styledToast({
        status: "success",
        description: "Employee has been terminated successfully",
        toast: toast,
      });
    },
    onError(error: any) {
      toast({
        status: "error",
        description: `${error}`,
        isClosable: true,
        duration: 5000,
        position: "top-right",
      });
      console.log(error);
    },
  });

  const handleTerminate = async () => {
    try {
      terminateEmployee({
        id: contractor.id,
        data: {
          name: name,
          email: email,
          department: department,
          jobRole: jobRole,
          salary: salary,
          signBonus: signBonus,
          status: false, // add status field with the value of false
          category: category,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return renderForm(
    <Stack spacing="6" pb="4" mt="-0.5rem">
      <Text fontWeight="bold" fontSize="18px">
        Personal Details
      </Text>

      <Stack spacing={3}>
        <Avatar size="xl" src="" name={name} />
        <HStack>
          <FormInput name="name" label="First Name" placeholder="First Name" defaultValue={name} />
          <FormInput name="lastName" label="Last Name" placeholder="Last Name" />
        </HStack>
        <HStack>
          <FormInput name="email" label="Email Address" placeholder="Email Address" defaultValue={email} />
          <FormInput name="phoneNumber" label="Phone Number" placeholder="Phone Number" />
        </HStack>
        <HStack>
          <FormInput name="city" label="City" placeholder="City" />
          <FormInput name="country" label="Country" placeholder="Country" />
        </HStack>
      </Stack>
      <Stack spacing={3}>
        <Text fontWeight="bold" fontSize="18px">
          Contract Details
        </Text>
        <HStack>
          <FormSelect
            name="category"
            label="Category"
            placeholder="Select Category"
            options={[
              { label: "Contractor", value: "CONTRACTOR" },
              { label: "Employee", value: "EMPLOYEE" },
            ]}
            defaultValue={contractor}
          />
          <FormInput name="payrollMethod" label="Payroll Method" placeholder="Payroll Method" />
        </HStack>
        <HStack>
          <FormInput
            name="department"
            label="Department"
            placeholder="Select Department"
            defaultValue={department}
          />
          <FormInput name="jobRole" label="Job Role" placeholder="Job Role" defaultValue={jobRole} />
        </HStack>
        <Tabs variant="unstyled">
          <Text fontWeight="bold" fontSize="18px" my={4}>
            Payment Method
          </Text>
          <TabList>
            <CustomTab>Bank Payment</CustomTab>
            <CustomTab>Crypto Payment</CustomTab>
            <CustomTab>Mobile Money</CustomTab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Stack>
                <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                  <GridItem>
                    <FormSelect
                      label="Select Country"
                      name="country"
                      options={[
                        { value: "GH", label: "Ghana" },
                        { value: "NIG", label: "Nigeria" },
                      ]}
                    />
                  </GridItem>
                  <GridItem>
                    <FormSelect
                      label="Select Bank"
                      name="bankName"
                      options={[
                        { value: "Access", label: "Access Bank" },
                        { value: "Stanbic", label: "Stanbic Bank" },
                        { value: "Ecobank", label: "EcoBank" },
                        { value: "Fidelity", label: "Fidelity Bank" },
                      ]}
                    />
                  </GridItem>
                  <GridItem>
                    <FormInput
                      name="accountNumber"
                      type="number"
                      label="Account Number"
                      placeholder="e.g. 0123456789"
                    />
                  </GridItem>
                  <GridItem>
                    <FormSelect
                      label="Account Type"
                      name="accountType"
                      options={[
                        { value: "Savings", label: "Savings Account" },
                        { value: "Current", label: "Current Account" },
                      ]}
                    />
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormInput
                      type="number"
                      name="salaryPercentage"
                      label="Salary Allocation in %  (no decimal)"
                      placeholder="e.g 15"
                    />
                  </GridItem>
                </Grid>
              </Stack>
            </TabPanel>
            <TabPanel>
              <Stack spacing="6" pb="4">
                <Grid gap={4}>
                  <GridItem>
                    <FormSelect
                      label="Select Cryptocurrency"
                      name="cryptocurrency"
                      options={[
                        { value: "BTC", label: "Bitcoin(BTC)" },
                        { value: "ETH", label: "Ethereum(ETH)" },
                        { value: "USDT", label: "Tether (USDT)" },
                        { value: "BNB", label: "Binance Coin (BNB)" },
                        { value: "USDC", label: "U.S. Dollar Coin (USDC)" },
                      ]}
                    />
                  </GridItem>
                  <GridItem>
                    <FormInput
                      name="walletAddress"
                      type="text"
                      label="Wallet Address"
                      placeholder="e.g. Ox000000000000000000000000000000000..."
                    />
                  </GridItem>
                  <GridItem>
                    <FormInput
                      type="number"
                      name="salaryPercentage"
                      label="Salary Allocation in %  (no decimal)"
                      placeholder="e.g 15"
                    />
                  </GridItem>
                </Grid>
              </Stack>
            </TabPanel>
            <TabPanel>
              <Stack spacing="6" pb="4">
                <Grid gap={4}>
                  <GridItem>
                    <FormSelect
                      label="Select Mobile Money Provider"
                      name="mobileMoneyProvider"
                      options={[
                        { value: "MTN", label: "MTN" },
                        { value: "VODAFONE", label: "VODAFONE" },
                        { value: "AIRTELTIGO", label: "AIRTELTIGO" },
                      ]}
                    />
                  </GridItem>
                  <GridItem>
                    <FormInput
                      name="phoneNumber"
                      type="number"
                      label="Phone Number"
                      placeholder="e.g. 0987456321"
                    />
                  </GridItem>
                  <GridItem>
                    <FormInput
                      type="number"
                      name="salaryPercentage"
                      label="Salary Allocation in %  (no decimal)"
                      placeholder="e.g 15"
                    />
                  </GridItem>
                </Grid>
              </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>

      <HStack spacing="4" pt="4">
        <Button
          variant="darkBtn"
          rightIcon={<ProfileIcon fill="#fff" stroke="#fff" />}
          iconSpacing="3"
          w="fit-content"
          type="submit"
          isLoading={isLoading}
          _hover={{ bg: "" }}
          loadingText="Updating">
          Update Profile
        </Button>
        <Button
          variant="greyBtn"
          rightIcon={<ProfileIcon fill="#210D35" stroke="#210D35" />}
          iconSpacing="3"
          w="fit-content"
          _hover={{ bg: "" }}
          onClick={handleTerminate}
          isLoading={isTerminating}>
          Terminate Contractor
        </Button>
      </HStack>
    </Stack>
  );
}
