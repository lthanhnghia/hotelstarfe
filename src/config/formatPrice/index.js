import { format } from "date-fns";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount).replace("₫", "").trim(); // Loại bỏ ký hiệu "₫" và khoảng trắng thừa
};
const formatDateTime = (dateString) => {
  if (dateString) {
    return format(new Date(dateString), "dd-MM-yyyy HH:mm");
  }
  return "dd-MM-yyyy HH:mm";
};
const formatDate = (dateString) => {
  if (dateString) {
    return format(new Date(dateString), "dd-MM-yyyy");
  }
  return "dd-MM-yyyy";
};
export { formatCurrency, formatDate,formatDateTime };
