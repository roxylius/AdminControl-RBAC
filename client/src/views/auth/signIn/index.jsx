import React, { useState, useEffect, useCallback } from 'react';
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
  Spinner,
  useColorModeValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  useDisclosure
} from '@chakra-ui/react';

import DefaultAuth from 'layouts/auth/Default';
import illustration from 'assets/img/auth/auth.png';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';

const server_url = process.env.REACT_APP_SERVER_URL;

function SignIn() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quickLoginRole, setQuickLoginRole] = useState(null); // Add state for quick login role
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleClickShowPassword = () => setShow(!show);

  // Form data state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Add quick login credentials
  const quickLogins = {
    admin: { email: 'admin@mail.com', password: 'admin' },
    dev: { email: 'dev@mail.com', password: 'dev' },
    viewer: { email: 'viewer@mail.com', password: 'viewer' },
  };

  // Function to handle quick login
  const handleQuickLogin = (role) => {
    const credentials = quickLogins[role];
    setFormData(credentials);
    setQuickLoginRole(role); // Set the quick login role
    onClose();
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const response = await fetch(server_url + '/api/login', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          const body = await response.json();
          localStorage.setItem('user', JSON.stringify(body.user));
          // Handle successful login
          navigate('/admin/default');
        } else {
          const data = await response.json();
          alert(data.message || 'Login failed');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    },
    [formData, navigate] // Include all external dependencies
  );

  // Submit the form when quick login role changes
  useEffect(() => {
    if (quickLoginRole) {
      handleSubmit({ preventDefault: () => {} });
    }
  }, [quickLoginRole,handleSubmit]);

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
            Sign In
          </Text>
          <Text
            mb='36px'
            ms='4px'
            color={textColorSecondary}
            fontWeight='400'
            fontSize='md'>
            Enter your email and password to sign in!
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
            <Button
              fontSize='sm'
              variant='brand'
              fontWeight='500'
              w='100%'
              h='50'
              mb='24px'
              type='submit'
              isLoading={loading} // Add loading state to button
              spinner={<Spinner />}>
              Sign In
            </Button>

            {/* Add Quick Login Popover here */}
            <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
              <PopoverTrigger>
                <Button variant='ghost' bgColor="#3311db" color="#3c3c3c" size='sm' borderRadius="10" ml='0'>
                  Quick Login
                </Button>
              </PopoverTrigger>
              <PopoverContent bg='#EDF2F7'> {/* Light gray background */}
                <PopoverArrow />
                <PopoverBody>
                  <Button
                    w='100%'
                    mb='8px'
                    onClick={() => handleQuickLogin('admin')}
                    bg='#3182CE' // Hex code for blue
                    color='white'>
                    Admin
                  </Button>
                  <Button
                    w='100%'
                    mb='8px'
                    onClick={() => handleQuickLogin('dev')}
                    bg='#38A169' // Hex code for green
                    color='white'>
                    Dev
                  </Button>
                  <Button
                    w='100%'
                    onClick={() => handleQuickLogin('viewer')}
                    bg='#805AD5' // Hex code for purple
                    color='white'>
                    Viewer
                  </Button>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </form>
          <Flex
            flexDirection='column'
            justifyContent='center'
            alignItems='start'
            maxW='100%'
            mt='0px'>
            <Text color={textColorDetails} fontWeight='400' fontSize='14px'>
              Don't have an account?
              <NavLink to='/auth/sign-up'>
                <Text color={textColorBrand} as='span' ms='5px' fontWeight='500'>
                  Sign Up
                </Text>
              </NavLink>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
