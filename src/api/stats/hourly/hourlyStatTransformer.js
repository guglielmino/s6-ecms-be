const transformHourlyStat = stat => ({
  current: stat.Current,
  power: stat.Power,
  hour: stat._id, // eslint-disable-line no-underscore-dangle
});

export { transformHourlyStat }; // eslint-disable-line import/prefer-default-export
