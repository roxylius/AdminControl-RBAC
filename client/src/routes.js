import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdPerson,
  MdHome,
  MdLock,
  MdSecurity,
  MdEventNote,
  MdKey,
  MdOutlineGroups2,
  MdPersonAdd
} from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import UserList from 'views/admin/userlist';
import Profile from 'views/admin/profile';
import ActivityLog from 'views/admin/activityLog';
import RolesList from 'views/admin/rolelist';
import PermissionsList from 'views/admin/permissionlist';
import Test from "test";

// Auth Imports
import SignInCentered from 'views/auth/signIn';
import SignUpForm from 'views/auth/signUp';

const routes = [
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  {
    name: 'Users',
    layout: '/admin',
    path: '/user-list',
    icon: (
      <Icon
        as={MdOutlineGroups2}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: <UserList />,
    secondary: true,
  },
  {
    name: 'Roles',
    layout: '/admin',
    path: '/roles-list',
    icon: (
      <Icon
        as={MdSecurity}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: <RolesList />,
    secondary: true,
  },
  {
    name: 'Permissions',
    layout: '/admin',
    path: '/permissions-list',
    icon: (
      <Icon
        as={MdKey}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: <PermissionsList />,
    secondary: true,
  },
  {
    name: 'Log',
    layout: '/admin',
    path: '/activity-log',
    icon: (
      <Icon
        as={MdEventNote}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: <ActivityLog />,
    secondary: true,
  },
  {
    name: 'Profile',
    layout: '/admin',
    path: '/profile',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
  },
  {
    name: 'Sign Up',
    layout: '/auth',
    path: '/sign-up',
    icon: <Icon as={MdPersonAdd} width="20px" height="20px" color="inherit" />,
    component: <SignUpForm />,
  },
  {
    name: 'Test Feat',
    layout: '/admin',
    path: '/test',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <Test />,
  },
];

export default routes;
