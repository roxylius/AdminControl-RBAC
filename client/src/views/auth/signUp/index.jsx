import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Text,
  Select,
  // Icon,
  Checkbox,
  CheckboxGroup,
  Stack,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
// import { HSeparator } from 'components/separator/Separator';
import DefaultAuth from 'layouts/auth/Default';
import illustration from 'assets/img/auth/auth.png';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { getRolesList } from 'variables/getData';

const server_url = process.env.REACT_APP_SERVER_URL;

function SignUp() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClickShowPassword = () => setShow(!show);

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    permissions: [],
  });

  const [rolesList, setRolesList] = useState([]);
  const [permissionsList, setPermissionsList] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      const roles = await getRolesList();
      setRolesList(roles);
    };

    fetchRoles();
  }, []);

  // Fetch permissions when role changes
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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(server_url + '/api/signup', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        // Registration successful
        const body = await response.json();
        const user = body.userObj;
        console.log({user})

        localStorage.setItem("user",JSON.stringify(user));
        navigate('/admin/default');
      } else {
        const data = await response.json();
        alert(data.message || 'Sign up failed');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Chakra Color Mode
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const textColorDetails = useColorModeValue('navy.700', 'secondaryGray.600');
  const textColorBrand = useColorModeValue('brand.500', 'white');
  const brandStars = useColorModeValue('brand.500', 'brand.400');

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: '100%', md: 'max-content' }}
        w='100%'
        mx={{ base: 'auto', lg: '0px' }}
        me='auto'
        h='100%'
        alignItems='start'
        justifyContent='center'
        mb={{ base: '30px', md: '60px' }}
        px={{ base: '25px', md: '0px' }}
        mt={{ base: '40px', md: '14vh' }}
        flexDirection='column'>
        <Box me='auto'>
          <Text color={textColor} fontSize='36px' mb='10px' fontWeight='700'>
            Sign Up
          </Text>
          <Text
            mb='36px'
            ms='4px'
            color={textColorSecondary}
            fontWeight='400'
            fontSize='md'>
            Enter your details to sign up!
          </Text>
        </Box>
        <Flex
          zIndex='2'
          direction='column'
          w={{ base: '100%', md: '420px' }}
          maxW='100%'
          background='transparent'
          borderRadius='15px'
          mx={{ base: 'auto', lg: 'unset' }}
          me='auto'
          mb={{ base: '20px', md: 'auto' }}
          pb='40px'>
          <form onSubmit={handleSubmit}>
            <FormControl mb='24px'>
              <FormLabel
                display='flex'
                ms='4px'
                fontSize='sm'
                fontWeight='500'
                color={textColor}
                mb='8px'>
                Name<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired
                variant='auth'
                fontSize='sm'
                type='text'
                placeholder='Your name'
                fontWeight='500'
                size='lg'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb='24px'>
              <FormLabel
                display='flex'
                ms='4px'
                fontSize='sm'
                fontWeight='500'
                color={textColor}
                mb='8px'>
                Email<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired
                variant='auth'
                fontSize='sm'
                type='email'
                placeholder='mail@domain.com'
                fontWeight='500'
                size='lg'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb='24px'>
              <FormLabel
                ms='4px'
                fontSize='sm'
                fontWeight='500'
                color={textColor}
                display='flex'>
                Password<Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size='md'>
                <Input
                  isRequired
                  fontSize='sm'
                  placeholder='Min. 8 characters'
                  size='lg'
                  type={show ? 'text' : 'password'}
                  variant='auth'
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <Button
                  variant='ghost'
                  onClick={handleClickShowPassword}
                  h='1.75rem'
                  size='sm'>
                  {show ? <RiEyeCloseLine /> : <MdOutlineRemoveRedEye />}
                </Button>
              </InputGroup>
            </FormControl>
            <FormControl mb='24px'>
              <FormLabel
                ms='4px'
                fontSize='sm'
                fontWeight='500'
                color={textColor}
                display='flex'>
                Role<Text color={brandStars}>*</Text>
              </FormLabel>
              <Select
                isRequired
                placeholder='Select role'
                variant='auth'
                name='role'
                value={formData.role}
                onChange={handleInputChange}>
                {rolesList.map((role, index) => (
                  <option key={index} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl mb='24px'>
              <FormLabel
                ms='4px'
                fontSize='sm'
                fontWeight='500'
                color={textColor}
                display='flex'>
                Permissions
              </FormLabel>
              <CheckboxGroup
                colorScheme='brand'
                value={formData.permissions}
              >
                <Stack spacing={2} direction='column'>
                  {permissionsList.map((permission, idx) => (
                    <Checkbox key={idx} value={permission} isDisabled>
                      {permission}
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            </FormControl>
            <Button
              fontSize='sm'
              variant='brand'
              fontWeight='500'
              w='100%'
              h='50'
              mb='24px'
              type='submit'
              isLoading={loading} // Add loading state to button
              spinner={<Spinner />}
            >
              Sign Up
            </Button>
          </form>
          <Flex
            flexDirection='column'
            justifyContent='center'
            alignItems='start'
            maxW='100%'
            mt='0px'>
            <Text color={textColorDetails} fontWeight='400' fontSize='14px'>
              Already have an account?
              <NavLink to='/auth/sign-in'>
                <Text color={textColorBrand} as='span' ms='5px' fontWeight='500'>
                  Sign In
                </Text>
              </NavLink>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignUp;