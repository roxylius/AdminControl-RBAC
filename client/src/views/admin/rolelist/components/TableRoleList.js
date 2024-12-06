/* eslint-disable */
import React, { useEffect, useState } from 'react';
import {  Avatar, Box, Button, Flex, Progress, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, useDisclosure} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {MdEdit,MdDelete} from "react-icons/md";
import OverlayForm from 'views/admin/rolelist/components/RoleForm'; // Import the OverlayForm component
import {getPermissionsList, getUser} from 'variables/getData'; //fetches all permissions

const server_url = process.env.REACT_APP_SERVER_URL;
const columnHelper = createColumnHelper();
const permissions = await getPermissionsList();

export default function TableRoleList(props) {
  const { tableData, columnsData : columns } = props; //role table data
  const [sorting, setSorting] = useState([]);
  const textColor = useColorModeValue('secondaryGray.900', 'white'); //page heading color
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRole, setSelectedRole] = useState(null);
  const [data,setData] = useState(tableData);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUser();
      if (user.role) {
        setRole(user.role);
      }
    };
    fetchData();
  }, []);

  const compareStringsIgnoreCase = (str1, str2) => {
    if (str1 && str2)
      return str1.toLowerCase() === str2.toLowerCase();
    else
      return false;
  };

  //action column to edit and delete user
  const newCol = {
    id: 'actions',
    header: () => (
      <Text
        fontSize={{ sm: '10px', lg: '12px' }}
        color="gray.400"
        pl={4}
      >
        ACTIONS
      </Text>
    ),
    cell: (info) => (
      <Flex justifyContent="center">
          <>
            <Button onClick={() => handleEditRole(info.row.original)} mr={0}>
              <MdEdit />
            </Button>
            {!compareStringsIgnoreCase(role, 'dev') && (
              <Button onClick={() => handleDeleteRole(info.row.original)}>
                <MdDelete />
              </Button>
            )}
          </>
      </Flex>
    ),
  };

  //display roles list from data recieved from prop
  const table = useReactTable({
    data,
    columns: compareStringsIgnoreCase(role, 'viewer') ? columns : [...columns, newCol],
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  //To add role it sets the selected role to null and displays the overlay
  //as to handle add role from selected role 
  const handleAddRole = () => {
    setSelectedRole(null);
    onOpen();
  };

  //when the form is submitted new role is added to roleList data
  const handleSaveRole = (updatedRolesList) => {
    setData(updatedRolesList);
    setSelectedRole(null);
  }

  //set the selectedRole state to edit selected role
  const handleEditRole = (selectedRole) => {
    console.log({selectedRole});
    setSelectedRole(selectedRole);
    onOpen();
  }

  //delete selected role on button press
  const handleDeleteRole = async (roleToDelete) => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
  
    try {
      const response = await fetch(`${server_url}/api/role/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: roleToDelete.name,
          user: currentUser,
        }),
      });
  
      if (response.ok) {
        // Remove the role from the data state  
        const updatedData = data.filter((role) => role.name !== roleToDelete.name);
        setData(updatedData);
  
        // Update localStorage with the new roles list
        localStorage.setItem('roleList', JSON.stringify(updatedData));
      } else {
        const errorData = await response.json();
        console.error('Failed to delete role:', errorData.message);
      }
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  return (
    <Flex
      direction="column"
      w="100%"
      overflowX={{ sm: 'scroll', lg: 'hidden' }}
    >
      <Flex
        align={{ sm: 'flex-start', lg: 'center' }}
        justify="space-between"
        w="100%"
        px="22px"
        pb="20px"
        mb="10px"
        boxShadow="0px 40px 58px -20px rgba(112, 144, 176, 0.26)"
      >
        <Text color={textColor} fontSize="xl" fontWeight="600">
          Roles
        </Text>
        {!compareStringsIgnoreCase(role, 'viewer') && (
          <Button variant="action" onClick={handleAddRole}>Add Role</Button>
        )}
      </Flex>
      <Box>
        <Table variant="simple" color="gray.500" mt="12px">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <Th
                      key={header.id}
                      colSpan={header.colSpan}
                      pe="10px"
                      borderColor={borderColor}
                      cursor="pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <Flex 
                        justifyContent="space-between"
                        align="center"
                        fontSize={{ sm: '10px', lg: '12px' }}
                        color="gray.400"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: '',
                          desc: '',
                        }[header.column.getIsSorted()] ?? null}
                      </Flex>
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table
              .getRowModel()
              .rows //.slice(0, 11)
              .map((row) => {
                return (
                  <Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <Td
                          key={cell.id}
                          fontSize={{ sm: '14px' }}
                          minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                          borderColor="transparent"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </Td>
                      );
                    })}
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </Box>
      <OverlayForm
        isOpen={isOpen}
        onClose={onClose}
        role={selectedRole}
        onSave={handleSaveRole}
        permissionsList={permissions}
      />
    </Flex>
  );
}
