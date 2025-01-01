const { getAllUsers
  , getUserById
  , createUser
  , updateUser
  , deleteUser
 } = require('../dao/user.dao');

const findAllUsers = async () => {
  return await getAllUsers();
}

const findAllCustomers = async () => {
  const users = await getAllUsers();
  for (let i = 0; i < users.length; i++) {
    if (users[i].role === 'admin') {
      users.splice(i, 1);
    }
  }
  return users;
}

const findUserById = async (id) => {
  return await getUserById(id);
} 

const addUser = async (user) => {
  return await createUser(user);
}

const editUser = async (id, user) => {
  return await updateUser(id, user);
}

const removeUser = async (id) => {
  return await deleteUser(id);
}

module.exports = {
  findAllUsers,
  findUserById,
  addUser,
  editUser,
  removeUser,
  findAllCustomers,
}