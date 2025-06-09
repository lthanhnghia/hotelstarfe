import { request } from '../../../../config/configApi';

const uploadProfiles = async (datas) => {
    try {
      const res = await request({
        method: "PUT", // Phương thức HTTP GET
        path: `/api/account/updateAccountCustomer`, // Truyền accountId thẳng trên URL
        data:datas
        //headers: { Authorization: `Bearer ${token}` }, // Thêm token vào header nếu cần
      });
      return res; // Trả về kết quả từ API
    } catch (error) {
      console.error("Error fetching booking history:", error);
      throw error; // Ném lỗi ra nếu cần
    }
  };
  
  export default uploadProfiles;