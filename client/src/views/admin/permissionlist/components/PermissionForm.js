// client/src/views/admin/userlist/components/UserForm.js

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
  Center,
  Spinner,
} from '@chakra-ui/react';

const server_url = process.env.REACT_APP_SERVER_URL;

const OverlayForm = ({ isOpen, onClose, permission, onSave }) => {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (permission) {
      console.log("useEffect",permission);
      setFormData(permission);
    }
  }, [permission]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const url = permission ? `${server_url}/api/permission/edit` : `${server_url}/api/permission/add`;
      const method = permission ? 'PUT' : 'POST';
      const currentUser = JSON.parse(localStorage.getItem('user'));

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, user: currentUser }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log({response});
      console.log({result});

      // Update localStorage and React state
      let permissionsList = JSON.parse(localStorage.getItem('permissionList')) || [];
      if (permission) {
        // Edit existing permission
        permissionsList = permissionsList.map((item) =>
          item.name === formData.name ? formData : item
        );
      } else {
        // Add new permission
        permissionsList.push(formData);
      }
      localStorage.setItem('permissionList', JSON.stringify(permissionsList));
      // Pass the updated permissions list to the parent component
      onSave(permissionsList);
      onClose();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      alert('Failed to save permission. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{permission ? 'Edit Permission' : 'Add New Permission'}</ModalHeader>
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
                  disabled={permission? true:false}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Description</FormLabel>
                <Input
                  name="description"
                  placeholder="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </FormControl>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit} isLoading={loading}>
            {permission ? 'Save Changes' : 'Add Permission'}
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OverlayForm;