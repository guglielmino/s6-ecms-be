const getDate = (req) => {
  let date = new Date();
  if (req.query.date) {
    date = new Date(req.query.date) || date;
  }
  return date;
};

const getOverlapped = (owned, requested) => (
  owned.filter(item => requested.indexOf(item) !== -1)
);

export { getDate, getOverlapped }; // eslint-disable-line import/prefer-default-export
