// npm run test src/__tests__/sellercloud.spec.ts

import { describe, it, expect } from 'vitest';

import JsSandbox from '../index';
import { prepCustomFunctions, prepMainFunction } from './sellercloud/infra';

import { rackLevel, numericOnly } from './sellercloud/utils';
import { primitivesOnlyValidator } from './sellercloud/validators';

// e.g. a Rack 2 levels high, 5 columns wide
const NAMING_CONVENTION_CONTEXT = {
  rack: {
    levels: 2,
    columns: 5,
  },
};

// e.g. Bin # 12 on a shelf
const BIN_NAME_WITH_POSITION_12 = 'P012';
const BIN_POSITION_12_EXPECTED = 12;

describe('javascript tagged template literal', () => {
  it('should be executed ok', async () => {
    const tag = `primitivesOnlyValidator`;
    const partial = `(context)(input)`;
    const expression = '`${numericOnly}`';
    // const expression = '`${{}}}`';
    // const expression = '`abcd`';

    const code = `${tag}${partial}${expression}`;
    // const code = `fetch("http://google.com")`;

    // const code = `input`;

    const expected = BIN_POSITION_12_EXPECTED;

    const context = NAMING_CONVENTION_CONTEXT;
    const input = BIN_NAME_WITH_POSITION_12;

    const option = { context, input };

    const utils = {
      rackLevel,
      numericOnly,
    };

    const validators = {
      primitivesOnlyValidator,
    };

    const funcs = {
      ...utils,
      ...validators,
    };

    const mainFunction = prepMainFunction(code);
    const customFunctions = prepCustomFunctions(funcs, mainFunction);

    // Set a prop at the global level of the CALLER context
    // TODO: Try to read this from the SANDBOX?
    global['abcdefg'] = 'abcdefg';

    const jsSandbox = new JsSandbox({
      entry: mainFunction.functionName,
      customFunctions,
    });

    const fun = ``;
    const result = await jsSandbox.runCodeSafe(fun, option);

    console.log('---- result');
    console.log(result);
    expect(result).toEqual(expected);
  });
});
