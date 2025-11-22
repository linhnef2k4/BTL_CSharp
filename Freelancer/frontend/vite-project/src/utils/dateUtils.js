import { formatDistanceToNow, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

export const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  try {
    // Backend trả về UTC (ví dụ: 2023-10-27T10:00:00Z)
    // parseISO sẽ tự động hiểu và chuyển về giờ local của trình duyệt
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: vi });
  } catch (error) {
    console.error("Lỗi format ngày:", error);
    return '';
  }
};

export const formatFullDate = (dateString) => {
   if (!dateString) return '';
   try {
     const date = parseISO(dateString);
     return new Intl.DateTimeFormat('vi-VN', {
       dateStyle: 'full',
       timeStyle: 'short'
     }).format(date);
   } catch (error) {
     return '';
   }
}