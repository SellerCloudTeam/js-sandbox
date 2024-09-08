import { CustomFunction } from '../../..';

export const prepCustomFunctions = (funcs: Record<string, Function>, mainFunction: CustomFunction) => {
  const whitelistedFunctions: CustomFunction[] = Object.entries(funcs).map<CustomFunction>(([name, func]) => ({
    functionName: name,
    arrowSandboxFunctionStr: func.toString(),
  }));

  return [...whitelistedFunctions, mainFunction];
};
