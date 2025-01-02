const { search, searchUsers } = require('../dao/search.dao');

const searchData = async (query) => {
  return await search(query);
}

const searchUsersData = async (query) => {
  const results = await searchUsers(query);
  for( let item of results){
    console.log(item);
  }
  return results;
}

module.exports = {
  searchData,
  searchUsersData,
}