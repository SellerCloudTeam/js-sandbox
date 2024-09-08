export const primitivesOnlyValidator =
  <T>(context: T) =>
  (input: string) =>
  (strings: string[], ...args: (null | undefined | number | string | object | Function)[]) => {
    // debugger;

    // console.log('iterating');

    let result = '';

    strings.forEach((string, i) => {
      const arg = args[i];

      let value: number | string = '';

      // Throw if `arg` is a complex object
      if (typeof arg === 'object') {
        throw new Error(
          `Interpolated string expression appears to use an object argument value! Expected a primitive value such as a string or a number. Instead, got value: ${JSON.stringify(
            arg,
          )}`,
        );
      }

      // Throw if `arg` is not a function of the form (context) => (input) => value
      if (typeof arg === 'function') {
        const withContext = arg(context);

        if (typeof withContext !== 'function') {
          throw new Error(
            `Interpolated string expression appears to use a function argument incorrectly! Expected a function of the form (context) => (input) => value. Instead, got value: ${withContext}`,
          );
        }

        value = withContext(input);
      } else {
        value = arg || '';
      }

      result += string + value;
    });

    return result;
  };
