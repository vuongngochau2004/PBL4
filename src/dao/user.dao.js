const { User } = require('../app/models/index.model');

const getAllUsers = async () => {
  return await User.findAll({
    raw: true
  })
    .then(result => {
      return result;
    })
    .catch(error => {
      console.error(error);
      return [];
    });
}

const getUserById = async (id) => {
  return await User.findOne({
    where: {
      id: id
    }
  })
    .then(result => {
      return result;
    })
    .catch(error => {
      console.error(error);
      return null;
    });
}

const createUser = async (user) => {
  return await User.create(user)
    .then(result => {
      return result;
    })
    .catch(error => {
      console.error(error);
      return null;
    });
}

const updateUser = async (id, user) => {
  try {
    const result = await User.update(user, {
      where: {
        id: id
      }
    });

    // Return result, which is an array where the first element indicates how many rows were affected
    return result;
  } catch (error) {
    console.error('Error updating user:', error);
    return null; // or you can throw the error if you prefer to handle it in the calling function
  }
}

const deleteUser = async (id) => {
  return await User.destroy({
    where: {
      id: id
    }
  })
    .then(result => {
      return result;
    })
    .catch(error => {
      console.error(error);
      return null;
    });
}

module.exports = { 
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};