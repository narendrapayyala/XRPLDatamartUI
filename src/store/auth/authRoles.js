/**
 * Authorization Roles
 */
const authRoles = {
  admin: ['admin'],
  owner: ['admin', 'owner'],
  user: ['admin', 'owner', 'user'],
  onlyGuest: []
};

export default authRoles;
