const bookingIdConfig = {
    dateFormat: "ddmmyyyy", // Định dạng ngày: "ddmmyyyy", "dd-mm-yyyy", "mmddyyyy", v.v.
    prefix: "BK",          // Tiền tố cho mã booking
    suffix: "TT",          // Hậu tố cho mã booking
    separator: "",         // Dấu phân cách giữa các phần tử
};

export const getIdBooking = (id, dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    // Định dạng ngày theo config
    let formattedDate = "";
    switch (bookingIdConfig.dateFormat) {
        case "ddmmyyyy":
            formattedDate = `${day}${bookingIdConfig.separator}${month}${bookingIdConfig.separator}${year}`;
            break;
        case "mmddyyyy":
            formattedDate = `${month}${bookingIdConfig.separator}${day}${bookingIdConfig.separator}${year}`;
            break;
        case "yyyyddmm":
            formattedDate = `${year}${bookingIdConfig.separator}${day}${bookingIdConfig.separator}${month}`;
            break;
        // Thêm các định dạng khác nếu cần
        default:
            formattedDate = `${day}${bookingIdConfig.separator}${month}${bookingIdConfig.separator}${year}`;
    }

    // Tạo mã booking
    return `${bookingIdConfig.prefix}${formattedDate}${bookingIdConfig.suffix}${id}`;
};
