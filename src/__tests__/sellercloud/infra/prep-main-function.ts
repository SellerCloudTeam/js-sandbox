import { CustomFunction } from '../../..';

export const prepMainFunction = (code: string): CustomFunction => ({
  functionName: 'main',
  arrowSandboxFunctionStr: `({ context, input }) => ${code}`,
});
