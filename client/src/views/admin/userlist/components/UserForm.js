import React, { useState, useEffect } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Center,
  Spinner,
  Checkbox,
  CheckboxGroup,
  Stack,
} from '@chakra-ui/react';
import { getRolesList } from 'variables/getData';

const server_url = process.env.REACT_APP_SERVER_URL;

const UserForm = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: '', permissions: [] });
  const [loading, setLoading] = useState(false);
  const [rolesList, setRolesList] = useState([]);
  const [permissionsList, setPermissionsList] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      const roles = await getRolesList();
      setRolesList(roles);
    };
    fetchRoles();

    if (user) {
      setFormData({ ...user, password: '' });
    }
  }, [user]);

  useEffect(() => {
    const fetchPermissions = () => {
      if (formData.role) {
        const roles = JSON.parse(localStorage.getItem('roleList')) || [];
        const selectedRole = roles.find((role) => role.name === formData.role);
        if (selectedRole) {
          setPermissionsList(selectedRole.permissions);
          setFormData((prevFormData) => ({
            ...prevFormData,
            permissions: selectedRole.permissions,
          }));
        }
      } else {
        setPermissionsList([]);
        setFormData((prevFormData) => ({
          ...prevFormData,
          permissions: [],
        }));
      }
    };

    fetchPermissions();
  }, [formData.role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    const url = user ? `${server_url}/api/user/edit` : `${server_url}/api/user/add`;
    const method = user ? 'PUT' : 'POST';

    const currentUser = JSON.parse(localStorage.getItem('user'));

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, user: currentUser }),
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        // Update localStorage and React state
        let usersList = JSON.parse(localStorage.getItem('userList')) || [];
        if (user) {
          // Edit existing user
          usersList = usersList.map((item) =>
            item.email === user.email ? { ...formData, password: undefined } : item
          );
        } else {
          // Add new user
          usersList.push({ ...formData, password: undefined });
        }
        localStorage.setItem('userList', JSON.stringify(usersList));
        onSave(usersList);
        onClose();
      } else {
        console.error(result.message);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{user ? 'Edit User' : 'Add New User'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <Center>
              <Spinner />
            </Center>
          ) : (
            <>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={user ? true : false}
                />
              </FormControl>
              {!user && (
                <FormControl mt={4}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    name="password"
                    placeholder="Password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </FormControl>
              )}
              <FormControl mt={4}>
                <FormLabel>Role</FormLabel>
                <Select
                  name="role"
                  placeholder="Select role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  {rolesList.map((role, index) => (
                    <option key={index} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Permissions</FormLabel>
                <CheckboxGroup colorScheme="brand" value={formData.permissions}>
                  <Stack spacing={2} direction="column">
                    {permissionsList.map((permission, idx) => (
                      <Checkbox key={idx} value={permission} isDisabled>
                        {permission}
                      </Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              </FormControl>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit} isLoading={loading}>
            {user ? 'Save Changes' : 'Add User'}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserForm;
