// npm run test src/__tests__/sellercloud.spec.ts

import { describe, it, expect } from 'vitest';

import JsSandbox, { CustomFunction } from '../index';
import { prepCustomFunctions } from './sellercloud/infra';

import { rackLevel } from './sellercloud/utils';
import { primitivesOnlyValidator } from './sellercloud/validators';

describe('javascript tagged template literal', () => {
  it('should be executed ok', async () => {
    const tag = `primitivesOnlyValidator`;
    const partial = `(context)(input)`;
    const expression = '`${rackLevel}`';
    // const expression = '`${{}}}`';
    // const expression = '`abcd`';

    const code = `${tag}${partial}${expression}`;
    // const code = `fetch("http://google.com")`;

    // const code = `input`;

    const context = { rack: { levels: 2, columns: 5 } };
    const input = 'input-text';

    const option = { context, input };

    const funcs = {
      rackLevel,
      primitivesOnlyValidator,
    };

    const mainFunction: CustomFunction = {
      functionName: 'main',
      arrowSandboxFunctionStr: `({ context, input }) => ${code}`,
    };

    const customFunctions = prepCustomFunctions(funcs, mainFunction);

    const expected = 'abcd';

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
