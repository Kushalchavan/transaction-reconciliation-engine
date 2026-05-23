export const parseTimestamp = (value: string) => {
  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return null;
  }

  return date;
};
