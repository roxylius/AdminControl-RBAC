import React, { useState, useEffect } from "react";
import { Box, Text, Grid, Flex, useColorModeValue, Checkbox } from "@chakra-ui/react";

import TableRoleList from "views/admin/rolelist/components/TableRoleList";
import Card from "components/card/Card.js";
import {getRolesList} from "variables/getData";

import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

export default function RolesList() {
  //state that stores roleList; fetch data to display in table
  const [rolesData, setRolesData] = useState(() => {
    const list = localStorage.getItem("roleList");
    return list ? JSON.parse(list) : [];
  });

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');

  //define columns and its styling for react table
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
    columnHelper.accessor('description', {
      id: 'description',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          DESCRIPTION
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
          PERMISSIONS
        </Text>
      ),
      cell: (info) => (
        <Flex direction="row" wrap="wrap">
          {info.getValue().map((permission, index) => (
            <Flex key={index} align="center" mr="10px" mb="5px">
              <Checkbox isChecked={true} colorScheme="brandScheme" me="10px" />
              <Text color={textColorSecondary} fontSize="sm" fontWeight="500">
                {permission}
              </Text>
            </Flex>
          ))}
        </Flex>
      ),
    }),
  ];

  //this useEffect updates rolesList when the component mounts or the rolesData changes
  useEffect(() => {
    const updateData = async () => {
      const rolesList = await getRolesList();
      setRolesData(rolesList);
    } 
    updateData();
  }, [rolesData.length]);

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      {rolesData.length > 0 ? (
        <Grid
          mb='20px'
          gridTemplateColumns={{ xl: "repeat(3, 1fr)", "2x2": "1fr 0.46fr" }}
          gap={{ base: "20px", xl: "20px" }}
          display={{ base: "block", xl: "grid" }}
        >
          <Flex flexDirection="column">
            <Card px="0px" mb="20px">
              <TableRoleList tableData={rolesData} columnsData={columnsData} />
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
