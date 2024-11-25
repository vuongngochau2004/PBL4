const { User } = require('./../app/models/index.model');

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
  return await User.update(user, {
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