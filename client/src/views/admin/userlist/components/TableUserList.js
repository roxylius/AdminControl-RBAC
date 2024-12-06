/* eslint-disable */
import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Progress,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { MdEdit, MdDelete } from 'react-icons/md';
import UserForm from './UserForm';
import {getUser} from 'variables/getData';

const server_url = process.env.REACT_APP_SERVER_URL;
const columnHelper = createColumnHelper();

export default function TableUserList(props) {
  const { tableData,columnsData : columns } = props;
  const [sorting, setSorting] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState(null);
  const [data, setData] = useState(tableData);
  const [role,setRole] = useState(null);

  useEffect(()=>{
    const fetchData = async () => {
      const user = await getUser();

      if(user.role){
        // console.log({userfound:user});
        setRole(user.role);
      }
    }
    fetchData();
  },[])

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const compareStringsIgnoreCase = (str1, str2) => {
    if(str1 && str2)
      return str1.toLowerCase() === str2.toLowerCase();
    else 
      return false;
  };

  const actionsColumn = {
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
      <Flex justifyContent="start">
        <Button onClick={() => handleEditUser(info.row.original)} mr={0}>
          <MdEdit />
        </Button>
          {!compareStringsIgnoreCase(role, 'dev') &&  <Button onClick={() => handleDeleteUser(info.row.original)}>
          <MdDelete />
        </Button>}
      </Flex>
    ),
  };

  const table = useReactTable({
    data,
    columns: compareStringsIgnoreCase(role, 'viewer') ? [...columns] : [...columns, actionsColumn],
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

    const handleEditUser = (user) => {
      setSelectedUser(user);
      onOpen();
    };

    //handle add user event on button press
    const handleAddUser = () => {
      setSelectedUser(null);
      onOpen();
    };

    //handle deletion when the button delete is clicked
    //and updates the table, state and localStorage 
    const handleDeleteUser = async (userToDelete) => {
      try {
        //get the user details of logged user modifing the data                
        const currentUser = JSON.parse(localStorage.getItem('user'));

        //delete from db
        const response = await fetch(`${server_url}/api/user/delete`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name:userToDelete.name,
            email: userToDelete.email,
            user: currentUser
          }),
        });

        if (response.ok) {
          const updatedData = data.filter((user) => user.email !== userToDelete.email);
          setData(updatedData);
          localStorage.setItem('userList', JSON.stringify(updatedData));
        } else {
          const errorData = await response.json();
          console.error('Failed to delete user:', errorData.message);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    };
    
    //when user form is saved on either edit or add new user 
    //updates the table data
    const handleSaveUser = (updatedUsersList) => {
      setData(updatedUsersList);
      setSelectedUser(null);
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
          Users
        </Text>
        {!compareStringsIgnoreCase(role, 'viewer') && <Button variant="action" onClick={handleAddUser}>Add User</Button>}
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

      <UserForm
        isOpen={isOpen}
        onClose={onClose}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </Flex>
  );
}
