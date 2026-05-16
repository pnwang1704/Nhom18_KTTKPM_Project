import React from 'react';

const OrderStatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'PAID':
        return { text: 'Đã thanh toán', classes: 'bg-green-100 text-green-700 border-green-200' };
      case 'FAILED':
        return { text: 'Thanh toán thất bại', classes: 'bg-red-100 text-red-700 border-red-200' };
      case 'WAITING_PAYMENT':
        return { text: 'Chờ thanh toán', classes: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
      case 'PENDING':
      default:
        return { text: 'Đang xử lý', classes: 'bg-blue-100 text-blue-700 border-blue-200' };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${config.classes}`}>
      {config.text}
    </span>
  );
};

export default OrderStatusBadge;
