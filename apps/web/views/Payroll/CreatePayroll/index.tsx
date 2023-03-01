import {
  HStack,
  Stack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  Flex,
  Button,
  Center,
} from "@chakra-ui/react";
import ViewLayout from "../../../components/core/ViewLayout";

import { FiChevronRight } from "react-icons/fi";
import { useRouter } from "next/router";
import {
  FormInput,
  FormNativeSelect,
  useForm,
  FormCheckbox,
} from "../../../components/forms";
import z from "zod";
import CustomTable from "components/CustomTable";
import { SalaryProgress } from "../utils/misc";
import { createPayrollData } from "../utils/dummyData";
import { useEffect, useState } from "react";
import { EmptyEmployeeImage } from "views/Employees/ProviderIcons";
import { createPayrollColumns } from "../utils/tableColumns";

export const createPayrollValidationSchema = z.object({
  title: z.string().email(),
  cycle: z.string().min(1, { message: "Required" }),
  paymentDate: z.string().min(1, { message: "Required" }),
  automaticPayment: z.boolean(),
});

type FormInputOptions = z.infer<typeof createPayrollValidationSchema>;

const CreatePayroll = () => {
  const { pathname } = useRouter();
  const createPayrollPath = "/payroll/create-payroll";
  const [defaultTableData, setDefaultTableData] = useState<unknown[]>([])
  const [tableData, setTableData] = useState<unknown[]>([])



  useEffect(() => {
    if (createPayrollData) {
      setDefaultTableData(createPayrollData)
      setTableData(createPayrollData)
    }
  }, [])

  // useEffect(() => {
  //   setTableData(createPayrollData) 
  //   if(searchTerm) {
  //     const searchData = tableData?.filter((item) => item?.name?.toLowerCase() === searchTerm?.toLowerCase())
  //      setTableData(searchData)
  //   }
  // }, [searchTerm, tableData])
  // useEffect(()=>{
  //   if(searchTerm){
  //     const searchData = dummyData?.filter(data=>data?.fullName?.toLowerCase().includes(searchTerm?.toLowerCase()))
  //     if (activeEmployeesOnly){
  //       const activeData= searchData.filter(data=>data?.status==='active')
  //       setDummyDataInUse(activeData);
  //       return
  //     }else{
  //       setDummyDataInUse(searchData);
  //       return
  //     }
  //   }

  const { renderForm } = useForm<FormInputOptions>({
    // onSubmit: handleSubmit,
    // defaultValues: { email: "" },
    // schema: addContractorValidationSchema,
  });

  return (
    <>
      <ViewLayout title="Payroll">
        <Breadcrumb
          fontSize={"sm"}
          separator={<FiChevronRight color="#d2d2d2" fontSize={"16px"} />}
          pb="2"
          fontWeight={"semibold"}
          color="lightgrey"
        >
          <BreadcrumbItem>
            <BreadcrumbLink href="/payroll">Payroll</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink
              href={createPayrollPath}
              color={pathname === createPayrollPath ? "black" : "lightgrey"}
              isCurrentPage={true}
            >
              Create Employee Payroll
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Grid templateColumns="69% 30%" gap={4} mt={4}>
          <GridItem border="1px solid #D2D2D2" rounded="xl" bg="white" p={4}>
            <Heading as="h4" size="xs" fontSize="xl">
              Payroll History
            </Heading>
            {renderForm(
              <Stack spacing={"6"} pb="4">
                <Stack>
                  <FormInput
                    name="title"
                    label="Payroll Details"
                    placeholder="Title"
                  />
                  <HStack>
                    <FormNativeSelect
                      name="cycle"
                      label="Payment Cycle"
                      placeholder="Payment Cycle"
                      options={[
                        { label: "Daily", value: "daily" },
                        { label: "Weekly", value: "weekly" },
                        { label: "Monthly", value: "monthly" },
                        { label: "Yearly", value: "yearly" },
                      ]}
                    />

                    <FormInput
                      name="paymentDate"
                      label="Payment Date"
                      placeholder="Payment Date"
                      type="date"
                    />
                  </HStack>
                </Stack>

                <FormCheckbox
                  label="Allow automatic payment of payroll on due date"
                  name="automaticPayment"
                />
              </Stack>
            )}
            <Stack mt={6}>
              <Heading as="h4" size="xs" fontSize="xl">
                Add Employee(s)
              </Heading>
              {
                createPayrollData?.length === 0 ? 
               (   <Center w="100%" p="8" flexDirection={"column"}>
                  <EmptyEmployeeImage />
                  <Text pr="12" pt="2">
                   No Payment History
                  </Text>
                </Center>) : (
                      <CustomTable
                      columns={createPayrollColumns}
                      data={tableData}
                      defaultTableData={defaultTableData}
                      emptyStateInfo="No Payroll History"
                      hasSearch
                      searchOptions={['All Departments', 'Tech', 'Finance', 'Operations']}
                      setDefaultTableData={setDefaultTableData}
                      setTableData={setTableData}
                   
                    />
                )
              }
          
            </Stack>
          </GridItem>
          <GridItem
            border="1px solid #D2D2D2"
            rounded="xl"
            bg="white"
            p={4}
            height="fit-content"
          >
            <Heading as="h4" size="xs" fontSize="xl">
              Summary
            </Heading>
            <VStack
              spacing={1}
              align="left"
              bg="brand.700"
              color="white"
              rounded="md"
              p={4}
            >
              <Text>Payroll Burden</Text>
              <Text fontSize="xl" fontWeight={700}>
                USD 0.00
              </Text>
            </VStack>
            <SalaryProgress color='#2EC4B6' label='Salary' amount={0.00} />
            <SalaryProgress color='#E71D36' label='Tax' amount={0.00} />
            <SalaryProgress color='#FF951C' label='Insurance' amount={0.00} />
            <SalaryProgress color='#8E1CFF' label='Pension' amount={0.00} />
            <Flex justify="space-between">
              <Heading as="h4" size="xs" fontSize="md">
                Selected Employee(s)
              </Heading>
              <Text>0</Text>
            </Flex>
           <Flex justify='center' mt={6}>
           <Button
              bg="brand.700"
              color="white"
            //   rightIcon={<ChevronRight boxSize={4} />}
              iconSpacing="3"
              w="100%"
              _hover={{ hover: "none" }}
              isDisabled={true}
              
            >
              Create Payroll
            </Button>
           </Flex>
          </GridItem>
        </Grid>
      </ViewLayout>
    </>
  );
};

export default CreatePayroll;
