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
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import OverlayForm from 'views/admin/permissionlist/components/PermissionForm'; // Import the OverlayForm component
import { MdEdit, MdDelete } from "react-icons/md";
import { getUser } from 'variables/getData';

const server_url = process.env.REACT_APP_SERVER_URL;

export default function TablePermissionList(props) {
  const { tableData : initialData, columnsData : columns } = props;
  const [data, setData] = useState(initialData);
  const [sorting, setSorting] = useState([]);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPermission, setSelectedPermission] = useState(null);
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
          <>
            <Button onClick={() => handleEditPermission(info.row.original)} mr={0}>
              <MdEdit />
            </Button>
            {!compareStringsIgnoreCase(role, 'dev') && (
              <Button onClick={() => handleDeletePermission(info.row.original)}>
                <MdDelete />
              </Button>
            )}
          </>
      </Flex>
    ),
  };

  const table = useReactTable({
    data,
    columns: compareStringsIgnoreCase(role, 'viewer') ? columns : [...columns, actionsColumn],
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  const handleAddPerm = () => {
    setSelectedPermission(null);
    onOpen();
  };

  const handleEditPermission = (permission) => {
    console.log("handleEditPermission",{permission});
    setSelectedPermission(permission);
    onOpen();
  };

  const handleDeletePermission = async (permissionToDelete) => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    try {
      const response = await fetch(`${server_url}/api/permission/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: permissionToDelete.name,
          user: currentUser,
        }),
      });
      if (response.ok) {
        const updatedData = data.filter((permission) => permission.name !== permissionToDelete.name);
        setData(updatedData);
        localStorage.setItem('permissionList', JSON.stringify(updatedData));
      } else {
        const errorData = await response.json();
        console.error('Failed to delete permission:', errorData.message);
      }
    } catch (error) {
      console.error('Error deleting permission:', error);
    }
  };

  const handleSavePermission = (updatedPermissionsList) => {
    console.log({updatedPermissionsList});
    setData(updatedPermissionsList);
    setSelectedPermission(null);
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
          Permissions
        </Text>
        {!compareStringsIgnoreCase(role, 'viewer') && (
          <Button variant="action" onClick={handleAddPerm}>
            Add Permission
          </Button>
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
        permission={selectedPermission}
        onSave={handleSavePermission}
      />
    </Flex>
  );
}
