const getDate = (req) => {
  let date = new Date();
  if (req.query.date) {
    date = new Date(req.query.date) || date;
  }
  return date;
};

export { getDate }; // eslint-disable-line import/prefer-default-export
