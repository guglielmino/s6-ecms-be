'use strict';

const transformStat = (stat) => {
  return {
      current: stat.Current,
      power: stat.Power
  }
}

export { transformStat };