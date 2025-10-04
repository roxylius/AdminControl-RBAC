import React, { useState ,useEffect} from "react";

// Chakra imports
import { Box, Flex, Grid, Text, useColorModeValue } from "@chakra-ui/react";

import {createColumnHelper} from "@tanstack/react-table";

// Custom components
import TableActivityLog from "views/admin/activityLog/components/TableActivityLog";
import Card from "components/card/Card.js";

const server_url = process.env.REACT_APP_SERVER_URL;
const columnHelper = createColumnHelper();


export default function ActivityLog() {
  //table and column data of logs table
  const [logData,setLogData] = useState(()=> {
      const list = localStorage.getItem("logList");
     return list ? JSON.parse(list) : null 
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
    columnHelper.accessor('timestamp', {
      id: 'timestamp',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          TIMESTAMP
        </Text>
      ),
      cell: (info) => (
        <Text color={textColorSecondary} fontSize="sm" fontWeight="500">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('action', {
      id: 'action',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          ACTION
        </Text>
      ),
      cell: (info) => (
        <Text color={textColorSecondary} fontSize="sm" fontWeight="500">
          {info.getValue()}
        </Text>
      ),
    }),
  ];

  //useEffect
  //fetches user list if not present in localStorage
  useEffect(() => {
    async function fetchData() {
      localStorage.removeItem("logList");
      if (localStorage.getItem("logList") == null && logData == null) {
        try {
          //as no user list found fetch userlist from server
          const response = await fetch(`${server_url}/api/log`);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const body = await response.json();

          localStorage.setItem("logList",JSON.stringify(body));
          // console.log("localStorage.setItem('logList',JSON.stringify(body));",body);
          setLogData(body);
        } catch (error) {
          console.error("Error fetching activity logs:", error);
          setLogData([]);
        }
      }
    }
    fetchData();
  }, [logData])

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      {logData ? (
        <Grid
          mb="20px"
          gridTemplateColumns={{ xl: '1fr', '2x2': '1fr 0.46fr' }}
          gap={{ base: '20px', xl: '20px' }}
          display={{ base: 'block', xl: 'grid' }}
        >
          <Flex flexDirection="column">
            <Card px="0px" mb="20px">
              <TableActivityLog logData={logData} columnsData={columnsData} />
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
