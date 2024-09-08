// npm run test src/__tests__/sellercloud.spec.ts

import { describe, it, expect } from 'vitest';

import JsSandbox from '../index';
import { prepCustomFunctions, prepMainFunction } from './sellercloud/infra';

import { HackContext } from './sellercloud/types';

import { WHITELIST_ALL_UTILS } from './sellercloud/utils';
import { WHITELIST_ALL_VALIDATORS } from './sellercloud/validators';

// e.g. a Rack 2 levels high, 5 columns wide
const NAMING_CONVENTION_CONTEXT: HackContext = {
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

    // Our pieces of context & input
    const context = NAMING_CONVENTION_CONTEXT;
    const input = BIN_NAME_WITH_POSITION_12;

    // NOTE: Expectation should be stringified because
    //       The test expression to be evaluated is one of string interpolation
    const expected = `${BIN_POSITION_12_EXPECTED}`;

    // Wrap our pieces of context & input + allowed functions into the JsSandbox concepts
    const option = { context, input };

    const funcs = {
      ...WHITELIST_ALL_UTILS,
      ...WHITELIST_ALL_VALIDATORS,
    };

    // Convert our allowed functions into JsSandbox `CustomFunction` function definitions
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

    expect(result).toEqual(expected);
  });

  it('should not allow fetch', async () => {
    const tag = `primitivesOnlyValidator`;
    const partial = `(context)(input)`;
    const expression = '`${fetch("http://google.com")}`';

    const code = `${tag}${partial}${expression}`;

    // Prepare the main function as a JsSandbox `CustomFunction` function definition
    const mainFunction = prepMainFunction(code);

    const jsSandbox = new JsSandbox({
      entry: mainFunction.functionName,
    });

    const fun = ``;
    const promise = jsSandbox.runCodeSafe(fun, {});

    await expect(promise).rejects.toThrowError();
  });

  it('should not allow inline objects', async () => {
    const tag = `primitivesOnlyValidator`;
    const partial = `(context)(input)`;
    const expression = '`${{ value: 123 }}`';

    const code = `${tag}${partial}${expression}`;

    // Prepare the main function as a JsSandbox `CustomFunction` function definition
    const mainFunction = prepMainFunction(code);

    const jsSandbox = new JsSandbox({
      entry: mainFunction.functionName,
    });

    const fun = ``;
    const promise = jsSandbox.runCodeSafe(fun, {});

    await expect(promise).rejects.toThrowError();
  });

  it('should not allow referenced objects', async () => {
    const tag = `primitivesOnlyValidator`;
    const partial = `(context)(input)`;
    const expression = '`${context}`';

    const code = `${tag}${partial}${expression}`;

    // Prepare the main function as a JsSandbox `CustomFunction` function definition
    const mainFunction = prepMainFunction(code);

    const jsSandbox = new JsSandbox({
      entry: mainFunction.functionName,
    });

    const fun = ``;
    const promise = jsSandbox.runCodeSafe(fun, {});

    await expect(promise).rejects.toThrowError();
  });

  it('should allow inline primitives', async () => {
    const tag = `primitivesOnlyValidator`;
    const partial = `(context)(input)`;
    const expression = '`${"sample-inline-primitive"}`';

    const code = `${tag}${partial}${expression}`;

    const expected = `sample-inline-primitive`;

    // Wrap our pieces of context & input + allowed functions into the JsSandbox concepts
    const option = {};

    const funcs = {
      ...WHITELIST_ALL_UTILS,
      ...WHITELIST_ALL_VALIDATORS,
    };

    // Convert our allowed functions into JsSandbox `CustomFunction` function definitions
    const mainFunction = prepMainFunction(code);
    const customFunctions = prepCustomFunctions(funcs, mainFunction);

    const jsSandbox = new JsSandbox({
      entry: mainFunction.functionName,
      customFunctions,
    });

    const fun = ``;
    const result = await jsSandbox.runCodeSafe(fun, option);

    expect(result).toEqual(expected);
  });

  it('should allow referenced primitives', async () => {
    const tag = `primitivesOnlyValidator`;
    const partial = `(context)(input)`;
    const expression = '`${context.rack.levels}`';

    const code = `${tag}${partial}${expression}`;

    const context = NAMING_CONVENTION_CONTEXT;
    const input = BIN_NAME_WITH_POSITION_12;

    // NOTE: Expectation should be stringified because
    //       The test expression to be evaluated is one of string interpolation
    const expected = `${context.rack.levels}`;

    // Wrap our pieces of context & input + allowed functions into the JsSandbox concepts
    const option = { context, input };

    const funcs = {
      ...WHITELIST_ALL_UTILS,
      ...WHITELIST_ALL_VALIDATORS,
    };

    // Convert our allowed functions into JsSandbox `CustomFunction` function definitions
    const mainFunction = prepMainFunction(code);
    const customFunctions = prepCustomFunctions(funcs, mainFunction);

    const jsSandbox = new JsSandbox({
      entry: mainFunction.functionName,
      customFunctions,
    });

    const fun = ``;
    const result = await jsSandbox.runCodeSafe(fun, option);

    expect(result).toEqual(expected);
  });
});
