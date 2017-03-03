

const transformStat = stat => ({
  current: stat.Current,
  power: stat.Power,
});

export { transformStat }; // eslint-disable-line import/prefer-default-export
