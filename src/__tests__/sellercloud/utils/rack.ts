import { HackContext } from '../types';
import { numericOnly } from './string';

export const rackNumber = (context: HackContext) => (source: string) => {
  const number = numericOnly(context)(source);

  const binsInRack = context.rack.columns * context.rack.levels;
  const rack = Math.ceil(number / binsInRack);

  return rack;
};

export const levelNumber = (context: HackContext) => (source: string) => {
  const ordinal = ordinalNumberInRack(context)(source);

  const level = Math.ceil(ordinal / context.rack.columns);

  return level;
};

const ordinalNumberInRack = (context: HackContext) => (source: string) => {
  const number = numericOnly(context)(source);

  const binsInRack = context.rack.columns * context.rack.levels;

  // e.g. bin 7 becomes # 3 in a 4-bin rack scenario
  const ordinal = ((number - 1) % binsInRack) + 1;

  return ordinal;
};
