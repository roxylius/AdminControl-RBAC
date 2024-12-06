import React, { useState, useEffect } from "react";
import { Box, Text, Grid, Flex, useColorModeValue,Checkbox } from "@chakra-ui/react";

import TableUserList from "views/admin/userlist/components/TableUserList";
import Card from "components/card/Card.js";
import {getUserList} from "variables/getData";

import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

export default function UserList() {
  // Table and column data of logs table
  const [usersData, setUsersData] = useState(() => {
    const list = localStorage.getItem("userList");
    return list ? JSON.parse(list) : [];
  });

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');

  const columnsData = [
    columnHelper.accessor('name', {
      id: 'name',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          NAME
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="600">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('email', {
      id: 'email',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Email
        </Text>
      ),
      cell: (info) => (
        <Text color={textColorSecondary} fontSize="sm" fontWeight="500">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('role', {
      id: 'role',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          ROLE
        </Text>
      ),
      cell: (info) => (
        <Text color={textColorSecondary} fontSize="sm" fontWeight="500">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('permissions', {
      id: 'permissions',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Permissions
        </Text>
      ),
      cell: (info) => (
        <Flex direction="row" wrap="wrap">
          {info.getValue().map((permission, index) => (
            <Flex key={index} align="center" mr="10px" mb="5px">
              <Checkbox isChecked={true} colorScheme="brandScheme" me="10px" isDisabled />
              <Text color={textColorSecondary} fontSize="sm" fontWeight="500">
                {permission}
              </Text>
            </Flex>
          ))}
        </Flex>
      ),
    })
  ];

  // useEffect to fetch user list if not present in localStorage
 //fetches user list if not present in localStorage
 useEffect(() => {
  const fetchData = async () => {
    const userlist = await getUserList();
    setUsersData(userlist);
  }
  fetchData();
  }, [usersData.length]);

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      {usersData.length > 0 ? (
        <Grid
          mb='20px'
          gridTemplateColumns={{ xl: "repeat(3, 1fr)", "2x2": "1fr 0.46fr" }}
          gap={{ base: "20px", xl: "20px" }}
          display={{ base: "block", xl: "grid" }}
        >
          <Flex flexDirection="column">
            <Card px="0px" mb="20px">
              <TableUserList tableData={usersData} columnsData={columnsData} />
            </Card>
          </Flex>
        </Grid>
      ) : (
        <Text fontSize="xl" fontWeight="bold" textAlign="center">
          Loading Data........
        </Text>
      )}
    </Box>
  );
}
