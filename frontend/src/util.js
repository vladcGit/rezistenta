import { createContext } from 'react';
const ColorModeContext = createContext({ toggleColorMode: () => {} });

function formatDate(date) {
  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }
  const dataCalendaristica = [
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join('/');

  const ora = [
    padTo2Digits(date.getHours()),
    padTo2Digits(date.getMinutes()),
  ].join(':');

  return `${dataCalendaristica}, ${ora}`;
}

export { ColorModeContext, formatDate };
