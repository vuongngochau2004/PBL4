const { search } = require('./../dao/search.dao');

const searchData = async (query) => {
  return await search(query);
}
module.exports = {
  searchData,
}