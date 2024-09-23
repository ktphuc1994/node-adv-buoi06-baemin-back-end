const checkIsNumber = (value: string) => {
  return !isNaN(Number(value)) && !isNaN(parseFloat(value));
};

const checkIsInteger = (value: string) => {
  const numberValue = Number(value);
  return (
    !isNaN(numberValue) &&
    !isNaN(parseFloat(value)) &&
    Number.isInteger(numberValue)
  );
};

export { checkIsNumber, checkIsInteger };
