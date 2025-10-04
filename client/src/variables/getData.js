// Environment-specific API URL for flexible deployment configuration
const server_url = process.env.REACT_APP_SERVER_URL;

/**
 * get the user list from localStorage if present 
 * else fetch from server
 */
export const getUserList = async () => {
  let userList = localStorage.getItem("userlist");
  if (userList) {
    return JSON.parse(userList);
  } else {
    try {
      const response = await fetch(`${server_url}/api/user/all`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      localStorage.setItem("userList", JSON.stringify(data));
      return data;
    } catch (error) {
      console.error("Error in getUserList:", error);
      return [];
    }
  }
};

/**
 * get the permission list from localStorage if present 
 * else fetch from server
 */
export const getPermissionsList = async () => {
  let permissionsList = localStorage.getItem("permissionList");
  if (permissionsList) {
    return JSON.parse(permissionsList);
  } else {
    try {
      console.log("server_url:",server_url);
      const response = await fetch(`${server_url}/api/permission`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      localStorage.setItem("permissionList", JSON.stringify(data));
      return data;
    } catch (error) {
      console.error("Error in getPermissionsList:", error);
      return [];
    }
  }
};

/**
 * get the role list from localStorage if present 
 * else fetch from server
 */
export const getRolesList = async () => {
  let rolesList = localStorage.getItem("roleList");
  if (rolesList) {
    return JSON.parse(rolesList);
  } else {
    try {
      const response = await fetch(`${server_url}/api/role`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      localStorage.setItem("roleList", JSON.stringify(data));
      return data;
    } catch (error) {
      console.error("Error in getRolesList:", error);
      return [];
    }
  }
};


/**
 * get the log list from localStorage if present 
 * else fetch from server
 */
export const getLogList = async () => {
  let logList = localStorage.getItem("logList");

  if (logList) {
    return JSON.parse(logList);
  } else {
    try {
      const response = await fetch(`${server_url}/api/log`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      localStorage.setItem("logList", JSON.stringify(data));
      return data;
    } catch (error) {
      console.error("Error in getLogList:", error);
      return [];
    }
  }
};

/**
 * This method get logged user from localStorage if present 
 * else fetch server
 */
export const getUser = async () => {
  let user = localStorage.getItem("user");

  if(user){
    return JSON.parse(user);
  } else {
    try {
      const response = await fetch(`${server_url}/api/user`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("body", data);
      return data;
    } catch (error) {
      console.error("Error in getUser:", error);
      return null;
    }
  }
}

export const getCount = async () => {
  let count = localStorage.getItem("count");

  if(count){
    return JSON.parse(count);
  }else{
    //fetch count of each list
    const users  = await getUserList();
    const role = await getRolesList();
    const permission = await getPermissionsList();
    console.log({users,role,permission})
    const userCount = users.length;
    
    const roleCount = role.length;
    
    const permissionCount = permission.length;
    console.log({userCount,roleCount,permissionCount});
    const count = {userCount,roleCount,permissionCount};
    localStorage.setItem("count",JSON.stringify(count));

    return count;

  }
}

