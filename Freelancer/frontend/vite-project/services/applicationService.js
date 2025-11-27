import api from './api';

const BASE_URL = '/applications'; 
// Lưu ý: Bạn cần tạo Controller tương ứng ở Backend (ApplicationsController)
// hoặc thêm endpoint vào ProjectsController để update status.

const applicationService = {
  // Cập nhật trạng thái ứng viên (VD: Pending -> Interview)
  updateStatus: (applicationId, newStatus) => {
     // Backend cần API: PUT /api/applications/{id}/status
     // Body: { status: "Interview" }
     return api.put(`${BASE_URL}/${applicationId}/status`, { status: newStatus });
  },
  
  // Mock API nếu chưa có backend (để test UI)
  // updateStatusMock: (id, status) => new Promise(resolve => setTimeout(resolve, 500)),
};

export default applicationService;