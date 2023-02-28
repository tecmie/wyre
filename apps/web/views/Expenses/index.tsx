import React, { useState, useEffect } from 'react';
import ViewLayout from "../../components/core/ViewLayout";
import {
  Button,
  HStack,
  Input,
  Stack,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Avatar,
  Flex,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import { FiSearch, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { EmptyContractorImage, LinkIcon } from "./ProviderIcons";
import {
  Pagination,
  usePagination,
  PaginationPage,
  PaginationNext,
  PaginationPrevious,
  PaginationPageGroup,
  PaginationContainer,
  PaginationSeparator,
} from "@ajna/pagination";


const Index: React.FC = () => {

  // const [dummyData, setDummyData] = useState<{ [key: string]: string }[]>([]);
  const [dummyDataInUse, setDummyDataInUse] = useState<
    { [key: string]: string }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");

  // search and 
  useEffect(() => {
   
  }, []);

  // pagination functions start
  // constants
  const outerLimit = 2;
  const innerLimit = 2;

  const {
    pages,
    pagesCount,
    //  offset,
    currentPage,
    setCurrentPage,
    //  setIsDisabled,
    isDisabled,
    pageSize,
    //  setPageSize
  } = usePagination({
    total: dummyDataInUse?.length,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: {
      pageSize: 10,
      isDisabled: false,
      currentPage: 1,
    },
  });

  // handlers
  const handlePageChange = (nextPage: number): void => {
    // -> request new data using the page number
    setCurrentPage(nextPage);
  };

  // pagination functions end

  useEffect(() => {

    setDummyDataInUse([
      {
        fullName: "john doe",
        description: "Travel Ticket",
        jobRole: "fullstack developer",
        department: "engineering",
        date: "Dec 28, 2022",
        amount: "USD 2000",
        imgURL:
          "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9",
      },
      {
        fullName: "andrew tate",
        description: "Travel Ticket",
        jobRole: "fullstack developer",
        department: "engineering",
        date: "Dec 28, 2022",
        amount: "USD 2000",
        imgURL:
          "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9",
      },
      {
        fullName: "akpan",
        description: "Travel Ticket",
        jobRole: "fullstack developer",
        department: "engineering",
        date: "Dec 28, 2022",
        amount: "USD 2000",
        imgURL:
          "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9",
      },
    ]);
  }, []);
    
  return (
    <ViewLayout title='Expenses'>
      <HStack gap="4" align={"center"}>
          <Stack
            borderRadius={"15px"}
            border={"1px solid"}
            borderColor="bordergrey"
            // p="4"
            bg={"white"}
            w="100%"
          >
          <Stack spacing={4} p={5}>
            <Text fontWeight="bold" fontSize="18px">
              Expenses
            </Text>
              <Button
                variant={"darkBtn"}
                rightIcon={<LinkIcon />}
                iconSpacing="3"
                w={'fit-content'}
              >
                Get Payment Link
              </Button>
                <HStack gap="1">
                  <FiSearch fontSize={"24px"} />
                  <Input
                    variant={"unstyled"}
                    border={"0"}
                    borderBottom="1px solid"
                    borderRadius={0}
                    px="0"
                    py="1"
                    h="40px"
                    w={{ base: "auto", lg: "250px" }}
                    fontSize={"sm"}
                    placeholder="Search Expenses"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </HStack>
             <Text fontWeight="bold" fontSize="18px">Recent Expense(s)</Text>
            </Stack>

              <TableContainer
                css={{
                  "&::-webkit-scrollbar": {
                    width: "15px",
                    background: "transparent",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "transparent",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#d6dee1",
                    borderRadius: "20px",
                    border: "6px solid transparent",
                    backgroundClip: "content-box",
                  },
                }}
              >
                <Table size="md" variant="unstyled">
                  <Thead>
                    <Tr>
                      <Th>Full Name</Th>
                      <Th>Department</Th>
                      <Th>Job Role</Th>
                      <Th>Date</Th>
                      <Th>Amount</Th>
                      <Th>description</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {dummyDataInUse &&
                      dummyDataInUse?.length > 0 &&
                      dummyDataInUse
                        ?.slice(
                          pageSize * currentPage - pageSize,
                          pageSize * currentPage
                        )
                        .map((data, index) => (
                          <Tr textTransform={"capitalize"} key={index}>
                            <Td>
                              <HStack>
                                <Avatar
                                  size={"sm"}
                                  src={data?.imgURL}
                                 
                                />
                                <Text>
                                  {data?.fullName}
                                </Text>
                              </HStack>
                            </Td>
                            <Td>
                              {data?.department}
                            </Td>
                            <Td>
                              {data?.jobRole}
                            </Td>
                            <Td>
                              {data?.date}
                            </Td>
                            <Td>
                              {data?.amount}
                            </Td>
                            <Td>
                              {data?.description}
                            </Td>
                          </Tr>
                        ))}
                  </Tbody>
                </Table>
              </TableContainer>

            {dummyDataInUse && dummyDataInUse?.length > 0 && (
              <Pagination
                pagesCount={pagesCount}
                currentPage={currentPage}
                isDisabled={isDisabled}
                onPageChange={handlePageChange}
                
              >
                <PaginationContainer
                  align="center"
                  justify="space-between"
                  p={5}
                  w="full"
                >
                  <PaginationPrevious
                    variant={"outline"}
                    h="40px"
                    px="12px"
                    leftIcon={<FiArrowLeft />}
                    iconSpacing={3}
                    border={"1px solid #D0D5DD"}
                    borderRadius="8px"
                    boxShadow={"0px 1px 2px rgba(16, 24, 40, 0.05)"}
                  >
                    <Text>Previous</Text>
                  </PaginationPrevious>
                  <PaginationPageGroup
                    isInline
                    align="center"
                    separator={
                      <PaginationSeparator
                        bg="#EAECF0"
                        fontSize="sm"
                        boxSize="10"
                        jumpSize={11}
                      />
                    }
                  >
                    {pages.map((page: number) => (
                      <PaginationPage
                        w={7}
                        bg="white"
                        key={`pagination_page_${page}`}
                        page={page}
                        fontSize="sm"
                        boxSize="10"
                        fontWeight="bold"
                        _hover={{
                          bg: "#EAECF0",
                        }}
                        _current={{
                          bg: "#EAECF0",
                        }}
                      />
                    ))}
                  </PaginationPageGroup>
                  <PaginationNext
                    variant={"outline"}
                    h="40px"
                    px="12px"
                    rightIcon={<FiArrowRight />}
                    iconSpacing={3}
                    border={"1px solid #D0D5DD"}
                    borderRadius="8px"
                    boxShadow={"0px 1px 2px rgba(16, 24, 40, 0.05)"}
                  >
                    <Text>Next</Text>
                  </PaginationNext>
                </PaginationContainer>
              </Pagination>
            )}

            {(!dummyDataInUse || dummyDataInUse?.length === 0) && (
              <Center w="100%" p="8" flexDirection={"column"}>
                <EmptyContractorImage />
                <Text pr="12" pt="2">
                  No Expenses
                </Text>
              </Center>
            )}
          </Stack>
          
        </HStack>
    </ViewLayout>
  )
};

export default Index;