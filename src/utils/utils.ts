import moment from 'moment';

export const formatDate = (date: number | null, format: string = 'DD-MM-YYYY') => {
  if (!date) return '';
  return moment(date).format(format);
};

export const formatNumber = (number: number | null, fd = 2) => {
  if (!number) return fd != 0 ? '0.00' : '0';

  return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: fd });
};

export const formatStatus = (status: number) => {
  if (status == 1) return 'ສຳເລັດ';
  if (status == 2) return 'ຍົກເລີກ';
  if (status == 3) return 'ຄືນເງິນ';
  else return 'ກຳລັງດຳເນີນການ';
};

export const dialogDelay = 3000;
export const cfmBtnColor = '#26a69a';
export const cancelBtnColor = '#c10015';
export const cfmBtnText = 'Yes, delete it!';
export const cancelBtnText = 'ຍົກເລີກ';
