import React, { useState, useEffect } from "react";
import Select from "react-select";

const SelectRoomTypeAmenities = ({
    onSelectionChange,
    options,
    defaultSelectedOptions = [],
}) => {
    const [selectedOptions, setSelectedOptions] = useState(defaultSelectedOptions);
    const [filteredOptions, setFilteredOptions] = useState([]);

    // Xử lý khởi tạo dữ liệu
    useEffect(() => {
        const selectedValues = defaultSelectedOptions.map((selected) => selected.value);

        // Gộp tất cả các tiện nghi (defaultSelectedOptions + options)
        const allOptions = [
            ...defaultSelectedOptions,
            ...options.filter(
                (option) => !selectedValues.includes(option.value.toString())
            ),
        ];

        setFilteredOptions(allOptions); // Cập nhật filteredOptions
        setSelectedOptions(defaultSelectedOptions); // Cập nhật selectedOptions

        // Gửi dữ liệu mặc định lên component cha
        if (onSelectionChange) {
            onSelectionChange(defaultSelectedOptions);
        }
    }, []);

    // Xử lý thay đổi lựa chọn
    const handleChange = (selected) => {
        setSelectedOptions(selected);

        // Gửi dữ liệu đã chọn lên component cha
        if (onSelectionChange) {
            onSelectionChange(selected);
        }
    };

    // Xử lý chọn/bỏ chọn tất cả
    const handleSelectAll = () => {
        if (selectedOptions.length === filteredOptions.length) {
            setSelectedOptions([]); // Bỏ chọn tất cả
            if (onSelectionChange) {
                onSelectionChange([]); // Gửi danh sách trống
            }
        } else {
            setSelectedOptions(filteredOptions); // Chọn tất cả các tiện nghi
            if (onSelectionChange) {
                onSelectionChange(filteredOptions); // Gửi danh sách đầy đủ
            }
        }
    };

    return (
        <>
            <Select
                isMulti
                options={filteredOptions} // Dùng filteredOptions để hiển thị tất cả tiện nghi
                value={selectedOptions} // Đảm bảo giá trị của select là selectedOptions
                onChange={handleChange}
                placeholder="Chọn tiện nghi loại phòng..."
            />
            <div className="form-check mt-2">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="selectAllCheckbox"
                    checked={selectedOptions.length === filteredOptions.length}
                    onChange={handleSelectAll}
                />
                <label className="form-check-label" htmlFor="selectAllCheckbox">
                    Chọn tất cả
                </label>
            </div>
        </>
    );
};

export default SelectRoomTypeAmenities;
