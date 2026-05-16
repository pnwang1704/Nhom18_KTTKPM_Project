export const formatCurrency = (value) => {
  if (value === undefined || value === null) return 'N/A';
  const num = Number(value);
  if (isNaN(num)) return 'N/A';
  return num.toLocaleString('vi-VN') + 'đ';
};
