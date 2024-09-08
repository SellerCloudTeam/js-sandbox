// npm run test src/__tests__/sellercloud.spec.ts

import { describe, it, expect } from 'vitest';

import JsSandbox, { CustomFunction } from '../index';
import { prepCustomFunctions } from './sellercloud/infra';

import { rackLevel } from './sellercloud/utils';
import { primitivesOnlyValidator } from './sellercloud/validators';

describe('javascript tagged template literal', () => {
  it('should be ok', async () => {
    const fun = ``;

    const tag = `primitivesOnlyValidator`;
    const partial = `(context)(input)`;
    const expression = '`${rackLevel}`';
    // const expression = '`${{}}}`';
    // const expression = '`abcd`';

    const code = `${tag}${partial}${expression}`;
    // const code = `fetch("http://google.com")`;

    // const code = `input`;

    const option = { context: { rack: { levels: 2, columns: 5 } }, input: 'input-text' };

    const funcs = {
      rackLevel,
      primitivesOnlyValidator,
    };

    const mainFunction: CustomFunction = {
      functionName: 'main',
      arrowSandboxFunctionStr: `({ context, input }) => ${code}`,
    };

    const customFunctions = prepCustomFunctions(funcs, mainFunction);

    // console.log(customFunctions[1].arrowGlobalFunction);
    // console.log(customFunctions[1].arrowGlobalFunction.toString());
    // console.log(customFunctions[2].functionName);
    // console.log(customFunctions[2].arrowSandboxFunctionStr);

    const expected = 'abcd';

    // Set a prop at the global level of the CALLER context
    // TODO: Try to read this from the SANDBOX?
    global['abcdefg'] = 'abcdefg';

    const jsSandbox = new JsSandbox({
      entry: mainFunction.functionName,
      customFunctions,
    });

    const result = await jsSandbox.runCodeSafe(fun, option);
    console.log('---- result');
    console.log(result);
    expect(result).toEqual(expected);
  });
});
