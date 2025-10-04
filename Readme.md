# Admin Control - A Responsive Full-Stack Role-Based Access Control (RBAC) System

> **🚀 Quick Start**: The system automatically creates dummy data (roles, permissions, and users) when the server starts if the database is empty. No manual setup required!

### Dummy Role-Based Login Credentials

**Admin**  
- **Email**: `admin@mail.com`  
- **Password**: `admin`  
- **Permissions**: Can **read**, **write**, and **delete**.  

**Dev**  
- **Email**: `dev@mail.com`  
- **Password**: `dev`  
- **Permissions**: Can **read** and **write**.  

**Viewer**  
- **Email**: `viewer@mail.com`  
- **Password**: `viewer`  
- **Permissions**: Can only **read**.  

---

## System Components

### 1. Users Management
This component allows the admin to view, add, edit, or remove users.  
<details>
  <summary>Functionality</summary>
  <br/>
  
      - Add new user to the list
      - Edit exisiting user details
      - Delete user from the list
  
</details>
<details>
  <summary>User Model</summary>
  <br/>
  
    const UserModel = {
      name: String,
      email: { type: String, unique: true },
      role: String,
      permissions: [String],
      provider: String, //where did the user data come from 
      // password: { // Password field not required as it is being handled by passport-local-mongoose
      //     type: String,
      //     required: true
      // },
      data: Schema.Types.Mixed
    }
  
</details>
<details>
  <summary>API Endpoint</summary>
  <br/>
  
  #### &nbsp;      **1. `/api/user/all`**
  **Method**: `GET`
  **Description**: Retrieves a list of all users in the system. 

  #### &nbsp;      **2. `/api/user/add`** 
  **Method**: `POST`
  **Description**: Adds a new user to the system with specified details. 


  #### &nbsp;      **3. `/api/user/edit`** 
  **Method**: `PUT`
  **Description**: Updates the details of an existing user based on their email. 

  #### &nbsp;      **4. `/api/user/delete`** 
  **Method**: `DELETE`
  **Description**: Deletes a user from the system based on their email. 

  #### &nbsp;      **5. `/api/user`** 
  **Method**: `GET`
  **Description**: Retrieves the details of the currently authenticated user. 
    
</details>
<br/>
<img width="640" alt="users" src="https://github.com/user-attachments/assets/5c0007bf-cb07-4bcd-bae7-a72354747634" />

---

### 2. Roles Management
Allows defining and managing roles with varying permissions, including viewing, adding, editing, or removing roles.  
<details>
  <summary>Functionality</summary>
  <br/>
  
      - Add new role to the list
      - Edit exisiting role details
      - Delete user role the list
  
</details>
<details>
  <summary>Role Model</summary>
  <br/>
  
    const RoleModel = {
        name: String,          // Unique role name
        description: String,   // Description of the role
        permissions: [String]  // List of permissions assigned to the role
    };
  
</details>
<details>
  <summary>API Endpoint</summary>
  <br/>
  
  #### &nbsp;      **1. `/api/role`**  
**Method**: `GET`  
**Description**: Retrieves a list of all roles in the system.

#### &nbsp;      **2. `/api/role/add`**  
**Method**: `POST`  
**Description**: Adds a new role to the system with specified details.

#### &nbsp;      **3. `/api/role/edit`**  
**Method**: `PUT`  
**Description**: Updates the details of an existing role based on its name.

#### &nbsp;      **4. `/api/role/delete`**  
**Method**: `DELETE`  
**Description**: Deletes a role from the system based on its name.
    
</details>
<br/>
<img width="640" alt="roles" src="https://github.com/user-attachments/assets/2743c6cd-4c5c-4723-81c6-041d6082c4a2">

---

### 3. User Profile
Displays the user's profile information, including personal details and settings.  
<br/>
<img width="640" alt="profile" src="https://github.com/user-attachments/assets/d2d6edd4-0f0b-4683-847f-59d75f1091cb">

---

### 4. Permissions Management
Allows the admin to assign or revoke permissions and to view, add, edit, or remove roles.  
<details>
  <summary>Functionality</summary>
  <br/>
  
      - Add new permissions to the list
      - Edit exisiting permissions
      - Delete permission from the list
  
</details>
<details>
  <summary>Permission Model</summary>
  <br/>
  
    const PermissionModel = {
        name: String,          // Unique permission name
        description: String    // Description of the permission
    };

</details>
<details>
  <summary>API Endpoint</summary>
  <br/>
  
  #### &nbsp;      **1. `/api/permission`**  
**Method**: `GET`  
**Description**: Retrieves a list of all permissions in the system.

#### &nbsp;      **2. `/api/permission/add`**  
**Method**: `POST`  
**Description**: Adds a new permission to the system with specified details.

#### &nbsp;      **3. `/api/permission/edit`**  
**Method**: `PUT`  
**Description**: Updates the details of an existing permission based on its name.

#### &nbsp;      **4. `/api/permission/delete`**  
**Method**: `DELETE`  
**Description**: Deletes a permission from the system based on its name.
    
</details>
<br/>
<img width="640" alt="permissions" src="https://github.com/user-attachments/assets/9a54b665-483c-466f-8639-f3b4134f7c5d">

---

### 5. Activity Log
Displays logs to track user actions and maintain system accountability.  
<details>
  <summary>Functionality</summary>
  <br/>
  
      - View logs of change in admin panel
      - store any edit, add and delete changes made to admin Control Panel 
  
</details>
<details>
  <summary>Log Model</summary>
  <br/>
  
    const LogModel = {
        name: String,          // User's name
        email: String,         // User's email
        role: String,          // User's role
        timestamp: String,     // Timestamp of the action
        action: String         // Description of the action performed
    };


</details>
<details>
  <summary>API Endpoint</summary>
  <br/>
  
  #### &nbsp;      **1. `/api/logs`**  
  **Method**: `GET`  
  **Description**: Retrieves a list of all logs for auditing purposes.
    
</details>
<br/>
<img width="640" alt="log" src="https://github.com/user-attachments/assets/fe0a1579-8492-47eb-a6b8-ccb11ee0239d">

---

### 6. Dashboard Overview
Provides a summary of the system's current state, including user statistics and role assignments.  
<br/>
<img width="640" alt="dashboard" src="https://github.com/user-attachments/assets/24878f0a-a453-4708-9359-117d174cea14">

---

## 🌱 Auto-Seeding Feature

The application automatically seeds the database with dummy data when the server starts if the collections are empty:

### Default Permissions
- **read**: Permission to view and read data
- **write**: Permission to create and edit data
- **delete**: Permission to delete data

### Default Roles
- **Admin**: Full access with read, write, and delete permissions
- **Dev**: Developer access with read and write permissions
- **Viewer**: View-only access with read permission

### Default Users
Three test users are automatically created with the credentials listed above. This allows you to:
- Start testing immediately without manual setup
- Understand the RBAC system with pre-configured examples
- Sign up new users with existing roles and permissions

**Note**: The seeding only happens once when collections are empty. Existing data is never overwritten.
