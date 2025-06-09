import Swal from "sweetalert2";

const AlertComfirm = {
    confirm: async ({ type = "warning", title, text, confirmButtonText = "OK", cancelButtonText = "Hủy" }) => {
        const result = await Swal.fire({
            icon: type,
            title: title,
            text: text,
            showCancelButton: true,
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText,
        });

        return result.isConfirmed;
    },
};

export default AlertComfirm;
