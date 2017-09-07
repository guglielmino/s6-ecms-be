const getDate = (req) => {
  let date = new Date();
  const queryDate = req.query.date || req.query.fromDate;
  if (queryDate) {
    date = new Date(queryDate) || date;
  }
  return date;
};

const getGroupField = (req) => {
  let group = null;
  if (req.query.groupBy) {
    group = req.query.groupBy.split(',');
  }
  return group;
};

const getOverlapped = (owned, requested) => (
  owned.filter(item => requested.indexOf(item) !== -1)
);

const createExcelConf = (data) => {
  const conf = {};
  conf.cols = Object.keys(data[0]).map(c => ({ caption: c, type: 'string' }));
  conf.rows = data.map(r => Object.values(r).map(v => v.toString()));
  return conf;
};

export { getDate,
  getOverlapped,
  createExcelConf,
  getGroupField }; // eslint-disable-line import/prefer-default-export
