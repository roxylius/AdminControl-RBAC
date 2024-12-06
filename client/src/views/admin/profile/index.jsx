// Chakra imports
import { Box, Grid } from "@chakra-ui/react";
import {useEffect,useState} from "react";

// Custom components
import Banner from "views/admin/profile/components/Banner";

// Assets
import banner from "assets/img/auth/banner.png";
import avatar from "assets/img/avatars/avatar4.png";
import React from "react";

export default function Overview() {
  const [user,setUser] = useState({name:"",role:""});

  useEffect(()=>{
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if(storedUser)
      setUser(storedUser);
  },[])
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <Grid
        templateColumns={{
          base: "1fr",
          lg: "1.34fr 1fr 1.62fr",
        }}
        templateRows={{
          base: "repeat(3, 1fr)",
          lg: "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}>
        <Banner
          gridArea='1 / 1 / 2 / 2'
          banner={banner}
          avatar={avatar}
        name={user.name}
          role={user.role}
        />
       
      </Grid>
    </Box>
  );
}
