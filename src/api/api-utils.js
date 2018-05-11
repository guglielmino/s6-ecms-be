const getDate = (req) => {
  let date = new Date();
  const queryDate = req.query.date;
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

const getHourlyDates = (date) => {
  const todayHours = [];
  date.setUTCHours(0);
  todayHours.push(new Date(date));
  while (date.getUTCHours() < 23) {
    date.setUTCHours(date.getUTCHours() + 1);
    todayHours.push(new Date(date));
  }

  return todayHours;
};

const getHoursBetweenDates = (dateFrom, dateTo) => {
  const hours = [];
  const from = new Date(dateFrom);
  const to = new Date(dateTo);
  hours.push(new Date(from));
  while (from < to) {
    from.setUTCHours(from.getUTCHours() + 1);
    hours.push(new Date(from));
  }
  return hours;
};

export {
  getDate,
  getOverlapped,
  createCsvElements,
  getGroupField,
  getHourlyDates,
  getHoursBetweenDates,
}; // eslint-disable-line import/prefer-default-export
