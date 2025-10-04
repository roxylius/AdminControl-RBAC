// Chakra Imports
import {
    Avatar,
    Button,
    Flex,
    Icon,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    useColorModeValue,
    useColorMode,
  } from '@chakra-ui/react';
  import {useState,useEffect} from "react";
  // Custom Components
  import { SidebarResponsive } from 'components/sidebar/Sidebar';
  import PropTypes from 'prop-types';
  import React from 'react';
  import { useNavigate } from 'react-router-dom';
  // Assets
  import { IoMdMoon, IoMdSunny } from 'react-icons/io';
  import routes from 'routes';
  
  const server_url = process.env.REACT_APP_SERVER_URL;
  
  export default function HeaderLinks(props) {
    const [user,setUser] = useState({name:"",role:""});
  
    const { secondary } = props;
    const { colorMode, toggleColorMode } = useColorMode();
  
    const navigate = useNavigate(); // Initialize useNavigate hook
  
    const handleProfileClick = () => {
      navigate('/admin/profile'); // Navigate to /admin/profile
    };
  
    // Chakra Color Mode
    const navbarIcon = useColorModeValue('gray.400', 'white');
    let menuBg = useColorModeValue('white', 'navy.800');
    const textColor = useColorModeValue('secondaryGray.900', 'white');
  
    const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
  
    const shadow = useColorModeValue(
      '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
      '14px 17px 40px 4px rgba(112, 144, 176, 0.06)',
    );
  
    //get the logged user data from localStorage
    useEffect(()=>{
      const storedUser = localStorage.getItem("user");
      if(storedUser)
        setUser(JSON.parse(storedUser));
    },[]);
  
  //remove session stored in server and localStorage
  const handleLogout = async () => {
    try {
      const response = await fetch(server_url+"/api/logout",{
        method:"DELETE",
        credentials:"include"
      });
      
      if (!response.ok) {
        console.warn(`Logout request failed with status: ${response.status}`);
      }
      
      console.log(response);
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      //delete user from localStorage regardless of server response
      localStorage.clear();
      navigate("/auth/sign-in");
    }
  };

  return (
    <Flex
      w={{ sm: '100%', md: 'auto' }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
        {/* <SearchBar
          mb={() => {
            if (secondary) {
              return { base: '10px', md: 'unset' };
            }
            return 'unset';
          }}
          me="10px"
          borderRadius="30px"
        /> */}
        <SidebarResponsive routes={routes} />
        <Menu>
        </Menu>
  
        <Button
          variant="no-hover"
          bg="transparent"
          p="0px"
          minW="unset"
          minH="unset"
          h="18px"
          w="max-content"
          onClick={toggleColorMode}
        >
          <Icon
            me="10px"
            h="18px"
            w="18px"
            color={navbarIcon}
            as={colorMode === 'light' ? IoMdMoon : IoMdSunny}
          />
        </Button>
        <Menu>
          <MenuButton p="0px">
            <Avatar
              _hover={{ cursor: 'pointer' }}
              color="white"
              name="Adela Parkson"
              bg="#11047A"
              size="sm"
              w="40px"
              h="40px"
            />
          </MenuButton>
          <MenuList
            boxShadow={shadow}
            p="0px"
            mt="10px"
            borderRadius="20px"
            bg={menuBg}
            border="none"
          >
            <Flex w="100%" mb="0px">
              <Text
                ps="20px"
                pt="16px"
                pb="10px"
                w="100%"
                borderBottom="1px solid"
                borderColor={borderColor}
                fontSize="sm"
                fontWeight="700"
                color={textColor}
              >
                👋&nbsp; Hey, {user.name}
              </Text>
            </Flex>
            <Flex flexDirection="column" p="10px">
              <MenuItem
                _hover={{ bg: 'none' }}
                _focus={{ bg: 'none' }}
                borderRadius="8px"
                px="14px"
                onClick={handleProfileClick}
              >
                <Text fontSize="sm">Profile Settings</Text>
              </MenuItem>
              <MenuItem
                _hover={{ bg: 'none' }}
                _focus={{ bg: 'none' }}
                color="red.400"
                borderRadius="8px"
                px="14px"
                onClick={handleLogout}
              >
                <Text fontSize="sm">Log out</Text>
              </MenuItem>
            </Flex>
          </MenuList>
        </Menu>
      </Flex>
    );
  }
  
  HeaderLinks.propTypes = {
    variant: PropTypes.string,
    fixed: PropTypes.bool,
    secondary: PropTypes.bool,
    onOpen: PropTypes.func,
  };
  