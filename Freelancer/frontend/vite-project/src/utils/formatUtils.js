import { formatDistanceToNow, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

// Format lương: 10000000 -> "10 triệu"
export const formatSalary = (min, max) => {
  if (!min && !max) return 'Thỏa thuận';
  
  const toMillion = (val) => {
    if (val >= 1000000) return (val / 1000000) + ' triệu';
    return val.toLocaleString('vi-VN') + ' đ';
  };

  if (min && max) return `${toMillion(min)} - ${toMillion(max)}`;
  if (min) return `Từ ${toMillion(min)}`;
  if (max) return `Lên đến ${toMillion(max)}`;
  return 'Thỏa thuận';
};

// Format thời gian: "2 giờ trước"
export const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true, locale: vi });
  } catch {
    return '';
  }
};