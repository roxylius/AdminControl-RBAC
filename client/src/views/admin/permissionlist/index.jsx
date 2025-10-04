import React, { useState, useEffect } from "react";
import { Box, Text, Grid, Flex, useColorModeValue } from "@chakra-ui/react";

import TablePermissionList from "views/admin/permissionlist/components/TablePermissionList";
import Card from "components/card/Card.js";

import { createColumnHelper } from "@tanstack/react-table";

const server_url = process.env.REACT_APP_SERVER_URL;
const columnHelper = createColumnHelper();

export default function PermissionsList() {
  // Table and column data of logs table
  const [permissionsData, setPermissionsData] = useState(() => {
    const list = localStorage.getItem("permissionList");
    return list ? JSON.parse(list) : [];
  });

  const textColor = useColorModeValue('secondaryGray.900', 'white');

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
          Description
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="600">
        {info.getValue()}
      </Text>
      ),
    })
  ];

  // useEffect to fetch user list if not present in localStorage
  useEffect(() => {
    async function fetchData() {
      if (localStorage.getItem("permissionList") == null && permissionsData.length === 0) {
        try {
          console.log('Server URL:', server_url);
          const response = await fetch(`${server_url}/api/permission`);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          console.log("response", response);
          const body = await response.json();
          console.log("body", body);
          localStorage.setItem("permissionList", JSON.stringify(body));
          setPermissionsData(body);
        } catch (error) {
          console.error("Error fetching permissions:", error);
          setPermissionsData([]);
        }
      }
    }
    fetchData();
  }, [permissionsData.length]);

    // Function to update the permissions list
    const handleSavePermission = (updatedPermissionsList) => {
      setPermissionsData(updatedPermissionsList);
    };

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      {permissionsData.length > 0 ? (
        <Grid
          mb='20px'
          gridTemplateColumns={{ xl: "repeat(3, 1fr)", "2x2": "1fr 0.46fr" }}
          gap={{ base: "20px", xl: "20px" }}
          display={{ base: "block", xl: "grid" }}
        >
          <Flex flexDirection="column">
            <Card px="0px" mb="20px">
              <TablePermissionList tableData={permissionsData} columnsData={columnsData} onSave={handleSavePermission} />
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
