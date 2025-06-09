import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { getAllService } from "../../../../services/employee/type-room-service";
import { formatCurrency } from "../../../../config/formatPrice";
import { addServiceNew, bookingServiceRoom, serviceRoomBookingRoom } from "../../../../services/employee/service";
import Alert from "../../../../config/alert";
import AlertComfirm from "../../../../config/alert/comfirm";
import { deleteService } from "../../../../services/employee/booking-room";

const ProductServiceModal = ({ handleClose, booking }) => {
    const [typeServiceRoom, setTypeServiceRoom] = useState([]);
    const [activeTab, setActiveTab] = useState("all");
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [selectedManualService, setSelectedManualService] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [selectedRoomIds, setSelectedRoomIds] = useState([]);
    const [selectedApiService, setSelectedApiService] = useState([]);
    const [totalRoomPrice, setTotalRoomPrice] = useState(0);
    const [totalBookingRoom, setToltalBookingRoom] = useState(0);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        hanhdleBooking();
        
        if (booking) {
            const idBookingRooms = booking?.bookingRooms?.map(e => e.id);
            console.log(idBookingRooms);
            const idBookingRoom = selectedRoomIds.length > 0 ? selectedRoomIds : idBookingRooms;
            handleServiceApi(idBookingRoom);
        }

        setTimeout(() => setAlert(null), 500);
    }, [booking, selectedRoomIds, selectedManualService, alert]);
    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };
    const hanhdleBooking = async () => {
        try {
            const service = await getAllService();
            setTypeServiceRoom(service);
        } catch (error) {
            setAlert({ type: "error", title: "Lỗi khi tải dữ liệu" });
        }
    }

    const handleServiceApi = async (id) => {
        const data = await bookingServiceRoom(id);
        console.log(data);
        
        setSelectedApiService(data);
    }
    const handleAddService = async () => {
        const date = new Date();
        const serviceRoom = selectedManualService.map(
            service => ({
                createAt: date.toISOString(),
                price: service.price,
                quantity: service.quantity,
                serviceRoomId: service.id
            }))
        if (selectedRoomIds && selectedRoomIds.length > 0) {
            if (serviceRoom && selectedManualService.length > 0) {
                const data = await addServiceNew(serviceRoom, selectedRoomIds.join(", "));
                if (data) {
                    setAlert({ type: data.status, title: data.message });
                    setSelectedManualService([]);
                }
            } else {
                setAlert({ type: "warning", title: "Vui lòng chọn dịch vụ" });
            }
        } else {
            setAlert({ type: "warning", title: "Vui lòng chọn phòng" });
        }


    }

    const handleCheckboxChange = (bookingRoomId) => {
        setSelectedRoomIds((prevSelected) => {
            if (prevSelected.includes(bookingRoomId)) {
                // Nếu đã có trong danh sách, loại bỏ khỏi danh sách
                return prevSelected.filter((id) => id !== bookingRoomId);
            } else {
                // Nếu chưa có, thêm vào danh sách
                return [...prevSelected, bookingRoomId];
            }
        });
    };

    const handleSelectService = (service) => {
        const existingServiceIndex = selectedManualService.findIndex(
            (item) => item.id === service.id
        );

        if (existingServiceIndex !== -1) {
            const updatedServices = [...selectedManualService];
            updatedServices[existingServiceIndex].quantity += 1; // Tăng số lượng
            setSelectedManualService(updatedServices);
        } else {
            setSelectedManualService([
                ...selectedManualService,
                { ...service, quantity: 1 },
            ]);
        }
    };


    const handleRemoveService = (indexToRemove) => {
        setSelectedManualService((prevSelectedServices) =>
            prevSelectedServices.filter((_, index) => index !== indexToRemove)
        );
    };
    const handleUpdateQuantity = async (service, newQuantity) => {
        const updatedServices = selectedManualService.map(item => {
            if (item.id === service.id) {
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        setSelectedManualService(updatedServices);
    };

    const handleIncreaseQuantity = async (service) => {
        setSelectedManualService((prevSelectedServices) => {
            return prevSelectedServices.map(item =>
                item.id === service.id ? { ...item, quantity: item.quantity + 1 } : item
            );
        });
    };


    const handleDecreaseQuantity = async (service) => {
        setSelectedManualService((prevSelectedServices) => {
            return prevSelectedServices.map(item =>
                item.id === service.id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
            );
        });
    };
    const handleDeleteService = async (item) => {
        const confirmation = await AlertComfirm.confirm({
            type: "warning",
            title: "Xác nhận xóa",
            text: "Bạn có chắc chắn muốn xóa dịch vụ này không?",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        });
        if (confirmation) {
            try {
                const response = await deleteService(item.id);
                if (response) {
                    setAlert({ type: response.status, title: response.message });
                    hanhdleBooking();
                }
            } catch (error) {
                setAlert({ type: "error", title: "Đã xảy ra lỗi khi xóa!" });
            }
        }
    }

    const renderServiceItem = (service) => (
        <div
            key={service.id}
            className="product-item"
            onClick={() => handleSelectService(service)}
            style={{
                cursor: "pointer",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "8px",
            }}
        >
            <div
                className="product-item-thumb"
                style={{
                    width: "100px",
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "8px",
                    backgroundColor: "#f8f8f8",
                    position: "relative",
                }}
            >
                {!isImageLoaded && (
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#e0e0e0",
                        }}
                    >
                        <span style={{ fontSize: "12px", color: "#888" }}>Đang tải...</span>
                    </div>
                )}
                <img
                    src={service.imageName || "https://via.placeholder.com/150"}
                    alt={service.serviceRoomName}
                    onLoad={() => setIsImageLoaded(true)} // Mark image as loaded
                    onError={() => setIsImageLoaded(true)} // Handle failed loading
                    style={{
                        width: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                        display: isImageLoaded ? "block" : "none", // Hide image until loaded
                    }}
                />
            </div>
            <div className="product-item-info" style={{
                wordWrap: "break-word",
                overflowWrap: "break-word",
                maxWidth: "100%"
            }}>
                <h6
                    className="product-item-name"
                    style={{
                        whiteSpace: "normal",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "block",
                        margin: "0"
                    }}
                >
                    {service.serviceRoomName}
                </h6>
                <span
                    className="product-item-price"
                    style={{
                        whiteSpace: "normal",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "block",
                        margin: "0"
                    }}
                >
                    {service.price ? `${formatCurrency(service.price)}` : "Liên hệ"}
                </span>
            </div>
        </div>
    );

    const removeAccents = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    const filteredServices = (services) => {
        if (!searchValue) {
            return typeServiceRoom.flatMap((category) => category?.serviceRoomDtos || []);
        }

        const normalizedSearchValue = removeAccents(searchValue);

        if (Array.isArray(services)) {
            return services.filter((room) => {
                const normalizedRoomName = removeAccents(room.serviceRoomName);
                return (
                    normalizedRoomName.includes(normalizedSearchValue) ||
                    (room.id && room.id.toString().toLowerCase().includes(normalizedSearchValue))
                );
            });
        }

        return (services || []).flatMap((service) => {
            if (service?.serviceRoomDtos) {
                return service.serviceRoomDtos.filter((room) => {
                    const normalizedRoomName = removeAccents(room.serviceRoomName);
                    return (
                        normalizedRoomName.includes(normalizedSearchValue) ||
                        (room.id && room.id.toString().toLowerCase().includes(normalizedSearchValue))
                    );
                });
            }
            return [];
        });
    };

    const renderTabContent = (tab) => {
        const allServices = typeServiceRoom.flatMap((category) => category.serviceRoomDtos || []);

        if (tab === "all") {
            const filteredAllServices = filteredServices(allServices);
            return filteredAllServices.map(renderServiceItem);
        } else {
            const category = typeServiceRoom.find((cat) => cat.serviceRoomName === tab);

            if (!category) {
                return <p>Không có dịch vụ</p>;
            }
            const filteredCategoryServices = searchValue
                ? filteredServices(category.serviceRoomDtos || [])
                : category.serviceRoomDtos || [];

            return filteredCategoryServices.map(renderServiceItem);
        }
    };

    return (
        <Modal show={true} onHide={handleClose} size="xl">
            <Modal.Header closeButton>
                {alert && <Alert type={alert.type} title={alert.title} />}
                <Modal.Title>Thêm sản phẩm, dịch vụ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="cashier-body row m-0">
                    <div className="col-12 col-md-5">
                        <div className="cashier-aside" style={{ height: "auto" }}>
                            <div className="products-filter">
                                <div className="product-search">
                                    <div className="form-control-wrapper w-100">
                                        <div className="form-control-prefix">
                                            <i className="fa fa-search icon-mask" style={{ marginLeft: "10px" }}></i>
                                        </div>
                                        <div className="form-control autocomplete">
                                            <input
                                                type="text"
                                                className="input-unstyled"
                                                id="cart-product-search-id"
                                                placeholder="Tìm theo tên, mã dịch vụ"
                                                value={searchValue} // Liên kết giá trị
                                                onChange={handleSearchChange} // Gọi hàm khi thay đổi giá trị
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="service-hotel mt-3">
                                <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button
                                            className={`nav-link ${activeTab === "all" ? "active mt-2" : "mt-2"}`}
                                            onClick={() => setActiveTab("all")}
                                        >
                                            Tất cả
                                        </button>
                                    </li>
                                    {typeServiceRoom.map((category) => (
                                        <li key={category.id} className="nav-item" role="presentation">
                                            <button
                                                className={`nav-link ${activeTab === category.serviceRoomName ? "active mt-2" : "mt-2"}`}
                                                onClick={() => setActiveTab(category.serviceRoomName)}
                                            >
                                                {category.serviceRoomName}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <div className="tab-content" id="pills-tabContent" style={{ maxHeight: "370px", overflowY: "auto" }}>
                                    <div className="tab-pane fade show active">
                                        <div className="products-grid">{renderTabContent(activeTab)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-7">
                        <div className="row">
                            <div className="d-flex col-md-12" role="group" aria-label="Basic checkbox toggle button group">
                                {booking &&
                                    booking.bookingRooms.map((item, index) => {
                                        const uniqueId = `room-checkbox-${index}`;
                                        return (
                                            <div className="form-check-inline" key={item?.id || index}>
                                                <input
                                                    type="checkbox"
                                                    className="btn-check"
                                                    id={uniqueId}
                                                    autoComplete="off"
                                                    checked={selectedRoomIds.includes(item?.id)} // Kiểm tra xem roomId có trong danh sách không
                                                    onChange={() => handleCheckboxChange(item?.id)} // Gọi hàm khi trạng thái checkbox thay đổi
                                                />
                                                <label className="btn btn-outline-success" htmlFor={uniqueId}>
                                                    {item?.room?.roomName || "Unnamed Room"}
                                                </label>
                                            </div>
                                        );
                                    })}
                            </div>
                            <div className="col-md-12">
                                <table className="table" style={{ margin: "12px" }}>
                                    <thead className="cart-item cart-list-head px-3 font-semibold">
                                        {(selectedManualService || selectedApiService) && (selectedManualService.length > 0 || selectedApiService.length > 0) &&
                                            <tr className="row font-weight-bold align-items-center">
                                                <th className="col-2 col-lg-1 text-start">STT</th>
                                                <th className="col-5 col-lg-3">Hạng mục</th>
                                                <th className="col-4 col-lg-2 text-center">Số lượng</th>
                                                <th className="col-5 col-lg-3 text-center">Đơn giá</th>
                                                <th className="col-5 col-lg-2 text-center">Thành tiền</th>
                                                <th className="col-auto"></th>
                                            </tr>
                                        }
                                    </thead>
                                    <tbody>
                                        {selectedManualService && selectedManualService.length > 0 ? (
                                            selectedManualService.map((item, index) => {
                                                return (
                                                    <tr className="cart-item row align-items-center" key={index}>
                                                        <td className="col-2 col-lg-1 text-start">{index + 1}</td>
                                                        <td className="col-5 col-lg-3">
                                                            <h6 className="cart-item-name mb-0">{item.serviceRoomName} ({item.typeServiceRoomDto.duration})</h6>
                                                        </td>
                                                        <td className="col-4 col-lg-2 text-center">
                                                            <div className="form-number form-number-sm d-flex justify-content-center align-items-center">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-icon-only btn-text-neutral btn-circle down"
                                                                    onClick={() => handleDecreaseQuantity(item)}
                                                                >
                                                                    <i className="fa fa-minus-circle icon-btn"></i>
                                                                </button>
                                                                <input
                                                                    type="text"
                                                                    className="form-control mx-1 text-center"
                                                                    value={item.quantity}
                                                                    style={{ maxWidth: "70px" }}
                                                                    readOnly
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-icon-only btn-text-neutral btn-circle up"
                                                                    onClick={() => handleIncreaseQuantity(item)}
                                                                >
                                                                    <i className="fa fa-plus-circle icon-btn"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className="col-5 col-lg-3 d-flex justify-content-center">
                                                            <span className="w-auto">{formatCurrency(item.price)}</span>
                                                        </td>
                                                        <td className="col-5 col-lg-2 d-flex text-success fw-bolder justify-content-center font-semibold">{formatCurrency(item.price * item.quantity) || 0}</td>
                                                        <td className="col-auto">
                                                            <button className="btn btn-sm btn-icon-only btn-circle text-danger" onClick={() => handleRemoveService(index)}>
                                                                <i className="fa fa-trash-alt"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })

                                        ) : ""}
                                        {selectedApiService && selectedApiService.length > 0 ? (
                                            selectedApiService.map((item, index) => {
                                                return (
                                                    <tr className="cart-item row align-items-center" key={index}>
                                                        <td className="col-2 col-lg-1 text-start">{index + 2 + selectedManualService.length}</td>
                                                        <td className="col-5 col-lg-3">
                                                            <h6 className="cart-item-name mb-0">{item.serviceRoomDto.serviceRoomName} ({item.serviceRoomDto.typeServiceRoomDto.duration})</h6>
                                                            <span>{item.bookingRoomDto.room.roomName}</span>
                                                        </td>
                                                        <td className="col-4 col-lg-2 text-center">
                                                            <div className="form-number form-number-sm d-flex justify-content-center align-items-center">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-icon-only btn-text-neutral btn-circle down"
                                                                    onClick={() => handleDecreaseQuantity(item)}
                                                                >
                                                                    <i className="fa fa-minus-circle icon-btn"></i>
                                                                </button>
                                                                <input
                                                                    type="number"
                                                                    className="form-control mx-1 text-center"
                                                                    value={item.quantity}
                                                                    onChange={(e) => handleUpdateQuantity(item, parseInt(e.target.value) || 1)}
                                                                    style={{ maxWidth: "70px" }}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-icon-only btn-text-neutral btn-circle up"
                                                                    onClick={() => handleIncreaseQuantity(item)}
                                                                >
                                                                    <i className="fa fa-plus-circle icon-btn"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className="col-5 col-lg-3 d-flex justify-content-center">
                                                            <span className="w-auto">{formatCurrency(item.serviceRoomDto.price)}</span>
                                                        </td>
                                                        <td className="col-5 col-lg-2 d-flex text-success fw-bolder justify-content-center font-semibold">{formatCurrency(item.serviceRoomDto.price * item.quantity)}</td>
                                                        <td className="col-auto">
                                                            <button className="btn btn-sm btn-icon-only btn-circle text-danger" onClick={() => handleDeleteService(item)} hidden={booking?.statusBookingDto?.id === 8}>
                                                                <i className="fa fa-trash-alt"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })

                                        ) : ""}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Bỏ qua
                </Button>
                <Button variant="success" onClick={handleAddService}>Lưu</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProductServiceModal;
