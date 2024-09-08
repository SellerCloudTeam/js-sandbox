import { levelNumber, rackNumber } from './rack';

import { numericOnly, padStartZeroes, stringify } from './string';

export const WHITELIST_LOCATION_TERMS_UTILS = {
  rackNumber,
  levelNumber,
};

export const WHITELIST_PRIMITIVES_UTILS = {
  stringify,
  numericOnly,
  padStartZeroes,
};

export const WHITELIST_ALL_UTILS = {
  ...WHITELIST_LOCATION_TERMS_UTILS,
  ...WHITELIST_PRIMITIVES_UTILS,
};
