export const getTimeFilter = (time) => {
  const today = new Date();
  if (time === 'today') {
    return { $gte: new Date(today.setHours(0, 0, 0, 0)) };
  } else if (time === 'last-week') {
    return { $gte: new Date(today.setDate(today.getDate() - 7)) };
  } else if (time === 'last-month') {
    return { $gte: new Date(today.setMonth(today.getMonth() - 1)) };
  }
  return null;
};
