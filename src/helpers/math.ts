export const rFact = (num: number): number => {
  if (num === 0) {
    return 1;
  } else {
    return num * rFact(num - 1);
  }
};
