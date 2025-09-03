import moment from 'moment';

export const formatDate = (date: number | null, format: string = 'DD-MM-YYYY') => {
  if (!date) return 'ບໍ່ມີຂໍ້ມູນ';
  return moment(date).format(format);
};

export const dialogDelay = 3000;
export const cfmBtnColor = '#26a69a';
export const cancelBtnColor = '#c10015';
export const cfmBtnText = 'Yes, delete it!';
export const cancelBtnText = 'ຍົກເລີກ';
