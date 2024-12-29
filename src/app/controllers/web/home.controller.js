const { searchData } = require('./../../../services/search.service');

module.exports = {
  getData: async (req, res) => {
    res.send("HomePage");
  },
  searchData: async (req, res) => {
    const query = req.query.q;
    const results = await searchData(query);
    res.json(results);
  }
}