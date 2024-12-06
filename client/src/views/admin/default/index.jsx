// Chakra imports
import {
  Box,
  Icon,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";

// Custom components
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React,{useState,useEffect} from "react";
import {
  MdKey,
  MdSecurity,
  MdOutlineGroups2
} from "react-icons/md";
import { getCount } from "variables/getData";

export default function UserReports() {
  const [count,setCount] = useState({userCount:"..",roleCount:"..",permissionCount:".."});

  //get all count from localStorage or server
  useEffect(()=>{
    const fetchData = async () => {
      localStorage.removeItem('count');
      const countObj = await getCount();
      console.log({countObj});
      setCount(countObj);
    };
    fetchData();
  },[])
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap='20px'
        mb='20px'>
        <MiniStatistics
          startContent={<IconBox w='56px' h='56px' bg={boxBg} icon={<Icon w='32px' h='32px' as={MdOutlineGroups2} color={brandColor} />}/>}
          name='Users'
          value={count.userCount}
        />
        <MiniStatistics
          startContent={<IconBox w='56px' h='56px' bg={boxBg} icon={<Icon w='32px' h='32px' as={MdSecurity} color={brandColor} />}/>}
          name='Roles'
          value={count.roleCount}
        />
        <MiniStatistics
          startContent={<IconBox w='56px' h='56px' bg={boxBg} icon={<Icon w='32px' h='32px' as={MdKey} color={brandColor} />}/>}
          name='Permissions'
          value={count.permissionCount}
        />
      </SimpleGrid>
    </Box>
  );
}
