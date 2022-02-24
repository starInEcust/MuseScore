const stepExchange = (step) => {
  switch (step) {
  case 'C':
    return 1;
  case 'D':
    return 2;
  case 'E':
    return 3;
  case 'F':
    return 4;
  case 'G':
    return 5;
  case 'A':
    return 6;
  case 'B':
    return 7;
  default:
    throw new Error('no step');
  }
};

export default stepExchange;
