import React, { useState, useEffect } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Checkbox,
  CheckboxGroup,
  Stack,
} from '@chakra-ui/react';
import {getRolesList} from "variables/getData";

const server_url = process.env.REACT_APP_SERVER_URL;

export default function RoleForm({ isOpen, onClose, role, onSave, permissionsList }) {
   // Initialize form data state
  const [formData, setFormData] = useState({ name: '', description: '', permissions: [] });
  const [loading, setLoading] = useState(false); //loading state to handle change

  //if the editing an user then add user data to form to edit 
  useEffect(() => {
    if (role) {
      setFormData(role);
    }
  }, [role]);

  //handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //handle permission multi-select button change
  const handlePermissionsChange = (selectedPermissions) => {
    setFormData({ ...formData, permissions: selectedPermissions });
  };

  /// Handle form submission to add or edit a role
  const handleSubmit = async () => {
    setLoading(true);

    try {
      //if role present then edit else add role
      console.log({formData})
      const url = role ? `${server_url}/api/role/edit` : `${server_url}/api/role/add`;
      const method = role ? 'PUT' : 'POST';

      const loggedUser = JSON.parse(localStorage.getItem("user"));

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...formData,user : loggedUser}),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json(); //get response body

      // Save modified formData in localStorage
      let rolesList = await getRolesList() || [];
      if (role) {
        // Edit role
        rolesList = rolesList.map((item) => (item.name === formData.name ? formData : item));
      } else {
        // Add role
        rolesList.push(formData);
      }
      localStorage.setItem("roleList", JSON.stringify(rolesList));

      // send the updated rolesList array to parent to display the new data 
      onSave(rolesList);
      onClose();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      alert('Failed to save role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{role ? 'Edit Role' : 'Add New Role'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              disabled={role ? true : false} // handle edit mode
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Input
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Permissions</FormLabel>
            <CheckboxGroup
              value={formData.permissions}
              onChange={handlePermissionsChange}
            >
              <Stack>
                {permissionsList.map((permission,idx) => (
                  <Checkbox key={idx} value={permission.name}>
                    {permission.name}
                  </Checkbox>
                ))}
              </Stack>
            </CheckboxGroup>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit} isLoading={loading}>
            {role ? 'Save Changes' : 'Add Role'}
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
