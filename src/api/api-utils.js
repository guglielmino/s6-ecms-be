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

const createCsvElements = (data) => {
  const csv = {};
  csv.data = data;
  csv.fields = Object.keys(data[0]);
  csv.del = '\t';
  return csv;
};

export { getDate,
  getOverlapped,
  createCsvElements,
  getGroupField }; // eslint-disable-line import/prefer-default-export
