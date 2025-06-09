import React, { useEffect, useState } from "react";
import Layoutemployee from "../../../components/layout/employee";
import PopupPayment from "./payment";
import useGetParams from "../../../config/Params";
import { getBookingId, getBookingRoomInformation } from "../../../services/employee/booking-manager";
import { addBookingRoomServiceRoom, deleteService, getByIdBookingRoom, updateQuantity } from "../../../services/employee/booking-room";
import { formatCurrency, formatDateTime } from "../../../config/formatPrice";
import DatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import Alert from "../../../config/alert";
import { getAllService } from "../../../services/employee/type-room-service";
import { serviceRoomBookingRoom } from "../../../services/employee/service";
import AlertComfirm from "../../../config/alert/comfirm";
import TTNhanPhong from "../list-reservation/modalTTNP";
import { Modal } from "react-bootstrap";
import CancelBookingModal from "../list-reservation/modalCancel";
import { cilColorBorder } from "@coreui/icons";
import InsertCustomer from "../list-reservation/modalInsertCustomer";
import TTCustomer from "../booking-offline/modalttCustomer";

const EditRoom = () => {
    const encodedIdBooking = useGetParams("idBookingRoom");
    const idBookingRoom = encodedIdBooking ? atob(encodedIdBooking) : null;
    const [showModalInsertCustomer, setShowModalInsertCustomer] = useState(false);
    const [bookingRoom, setBookingRoom] = useState({});
    const [showModalUpdateCustomer, setShowModalUpdateCustomer] = useState(false);
    const [showModalTTCustomer, setShowModalTTCustomer] = useState(false);
    const [booking, setBooking] = useState({});
    const [modalCancel, setModalCancel] = useState(false);
    const [loading, setLoading] = useState(true);
    const [customerInformation, setCustomerInformation] = useState([]);
    const [alert, setAlert] = useState(null);
    const [typeServiceRoom, setTypeServiceRoom] = useState([]);
    const [activeTab, setActiveTab] = useState("all");
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [selectedManualService, setSelectedManualService] = useState([]);
    const [selectedApiService, setSelectedApiService] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [totalRoomPrice, setTotalRoomPrice] = useState(0);
    const [totalBookingRoom, setToltalBookingRoom] = useState(0);
    const flag = [6, 8].includes(booking?.statusBookingDto?.id) || false;
    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };
    useEffect(() => {
        hanhdleBooking();
    }, [encodedIdBooking, selectedManualService]);

    useEffect(() => {
        calculateTotalPrice();
    }, [selectedManualService, selectedApiService]);

    const hanhdleBooking = async () => {
        try {
            if (idBookingRoom) {
                setLoading(true);
                const bookingRoom = await getByIdBookingRoom(idBookingRoom);
                const booking = await getBookingId(bookingRoom.booking.id);
                setBookingRoom(bookingRoom);
                const data = await getBookingRoomInformation([bookingRoom?.id]);
                setCustomerInformation(data);
                setBooking(booking);
                if (bookingRoom?.id) {
                    try {
                        const data = await serviceRoomBookingRoom(bookingRoom?.id);
                        setSelectedApiService(data);
                        const totalManualServicePrice = selectedManualService.reduce((sum, service) => sum + (service.price * service.quantity), 0);
                        const totalApiServicePrice = data.reduce((sum, service) => sum + (service.price * service.quantity), 0);
                        const total = totalManualServicePrice + totalApiServicePrice + (bookingRoom?.price || 0);
                        setToltalBookingRoom(total);
                    } catch (error) {
                        setAlert({ type: "error", title: "Lỗi tải dữ liệu dịch vụ" });
                    }
                }
                const totalPriceRoom = booking.bookingRooms.map((e) => e.room?.typeRoomDto?.price || 0);
                const totalRoomPrice = totalPriceRoom.reduce((sum, price) => sum + price, 0);
                setTotalRoomPrice(totalRoomPrice);
            }
            const service = await getAllService();
            setTypeServiceRoom(service);
        } catch (error) {
            setAlert({ type: "error", title: "Lỗi khi tải dữ liệu" });
        } finally {
            setLoading(false);
        }
    }

    const handleCloseCancel = () => {
        setModalCancel(false);
    }
    const handleCancelBooking = async (booking) => {
        setBooking(booking);
        setModalCancel(true);
    }
    // dịch vụ

    const handleAddService = async () => {
        const date = new Date();
        const serviceRoom = selectedManualService.map(
            service => ({
                createAt: date.toISOString(),
                price: service.price,
                quantity: service.quantity,
                bookingRoomId: idBookingRoom * 1,
                serviceRoomId: service.id
            }))
        if (serviceRoom && selectedManualService.length > 0) {
            const data = await addBookingRoomServiceRoom(serviceRoom);
            if (data) {
                setAlert({ type: data.status, title: data.message });
                setSelectedManualService([]);
            }
        } else {
            setAlert({ type: "warning", title: "Vui lòng chọn dịch vụ" });
        }

    }
    const calculateTotalPrice = () => {
        const totalManualServicePrice = selectedManualService.reduce((sum, service) => sum + (service.price * service.quantity), 0);
        const totalApiServicePrice = selectedApiService.reduce((sum, service) => sum + (service.price * service.quantity), 0);
        const total = totalManualServicePrice + totalApiServicePrice + (bookingRoom?.price || 0);
        setToltalBookingRoom(flag ? bookingRoom?.price : total);
    };

    const handleSelectService = async (service) => {
        const isServiceFromApi = selectedApiService.some(
            (apiService) => apiService.serviceRoomDto?.id === service.id
        );

        if (isServiceFromApi) {
            // Dịch vụ từ API
            const updatedServices = await Promise.all(
                selectedApiService.map(async (apiService) => {
                    if (apiService.serviceRoomDto?.id === service.id) {
                        const updated = {
                            ...apiService,
                            quantity: apiService.quantity + 1,
                        };
                        // Cập nhật số lượng qua API
                        const data = await updateQuantity(updated.id, updated);
                        return { ...updated, ...data }; // Cập nhật state với dữ liệu từ API
                    }
                    return apiService;
                })
            );
            setSelectedApiService(updatedServices);
        } else {
            // Dịch vụ nằm trong selectedManualService
            setSelectedManualService((prevSelectedServices) => {
                const existingServiceIndex = prevSelectedServices.findIndex(
                    (item) => item.id === service.id
                );
                if (existingServiceIndex !== -1) {
                    const updatedServices = [...prevSelectedServices];
                    updatedServices[existingServiceIndex].quantity += 1; // Tăng số lượng
                    return updatedServices;
                } else {
                    return [...prevSelectedServices, { ...service, quantity: 1 }];
                }
            });
        }
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

    const handleRemoveService = (indexToRemove) => {
        setSelectedManualService((prevSelectedServices) =>
            prevSelectedServices.filter((_, index) => index !== indexToRemove)
        );
    };
    const handleUpdateQuantity = async (service, newQuantity) => {
        const isServiceFromApi = selectedApiService.some(apiService => apiService?.id === service.id);

        if (isServiceFromApi) {
            // Nếu dịch vụ đến từ API
            const updatedServices = await Promise.all(
                selectedApiService.map(async (apiService) => {
                    if (apiService?.id === service.id) {
                        const updated = { ...apiService, quantity: newQuantity };
                        const data = await updateQuantity(updated.id, updated); // Cập nhật lại số lượng qua API
                        return { ...updated, ...data }; // Trả về kết quả cập nhật từ API
                    }
                    return apiService;
                })
            );
            setSelectedApiService(updatedServices);
        } else {
            // Nếu dịch vụ đến từ manual
            const updatedServices = selectedManualService.map(item => {
                if (item.id === service.id) {
                    return { ...item, quantity: newQuantity };
                }
                return item;
            });
            setSelectedManualService(updatedServices);
        }
    };

    const handleIncreaseQuantity = async (service) => {
        const isServiceFromApi = selectedApiService.some(apiService => apiService?.id === service.id);
        if (isServiceFromApi) {
            const updatedServices = await Promise.all(
                selectedApiService.map(async (apiService) => {
                    if (apiService?.id === service.id) {
                        const updated = { ...apiService, quantity: apiService.quantity + 1 };
                        const data = await updateQuantity(updated.id, updated);
                        return { ...updated, ...data };
                    }
                    return apiService;
                })
            );
            setSelectedApiService(updatedServices);
        } else {
            setSelectedManualService((prevSelectedServices) => {
                return prevSelectedServices.map(item =>
                    item.id === service.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            });
        }
        // Cập nhật tổng giá tiền
        calculateTotalPrice();
    };


    const handleDecreaseQuantity = async (service) => {
        const isServiceFromApi = selectedApiService.some(apiService => apiService?.id === service.id);
        if (isServiceFromApi) {
            const updatedServices = await Promise.all(
                selectedApiService.map(async (apiService) => {
                    if (apiService?.id === service.id && apiService.quantity > 1) {
                        const updated = { ...apiService, quantity: apiService.quantity - 1 };
                        const data = await updateQuantity(updated.id, updated);
                        return { ...updated, ...data };
                    }
                    return apiService;
                })
            );
            setSelectedApiService(updatedServices);
        } else {
            setSelectedManualService((prevSelectedServices) => {
                return prevSelectedServices.map(item =>
                    item.id === service.id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
                );
            });
        }
        // Cập nhật tổng giá tiền
        calculateTotalPrice();
    };

    //dịch vụ    

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
            <div className="product-item-info">
                <h6 className="product-item-name">{service.serviceRoomName}</h6>
                <span className="product-item-price text-danger">
                    {service.price ? `${formatCurrency(service.price)}` : "miễn phí"}
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

    const calculateUsageDuration = (checkIn) => {
        if (!checkIn) return '0 giờ';

        const start = new Date(checkIn);
        const now = new Date();

        if (isNaN(start) || now < start) return 'N/A';

        const diffMs = now - start;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // Số giờ còn lại

        if (diffDays > 0) {
            return `${diffDays} ngày ${diffHours} giờ`;
        } else {
            return `${diffHours} giờ`;
        }
    };

    const calculateDuration = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return 0;

        const start = new Date(checkIn);
        const end = new Date(checkOut);

        if (isNaN(start) || isNaN(end)) return 0;

        const diffMs = end - start; // Khoảng thời gian thuê tính bằng milliseconds
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)); // Số ngày (làm tròn lên để tính ngày lẻ)

        return diffDays > 0 ? diffDays : 1; // Nếu ngày <= 0, trả về 0
    };

    const handleShowModalInsertCustomer = () => {
        setShowModalInsertCustomer(true);
    }
    const handleCloseModalInsertCustomer = () => {
        setShowModalInsertCustomer(false);
    }
    const handleShowModalUpdateCustomer = () => {
        setShowModalUpdateCustomer(true);
    }
    const handleCloseModalUpdateCustomer = () => {
        setShowModalUpdateCustomer(false);
    }
    const handleShowModalTTCustomer = () => {
        setShowModalTTCustomer(true);
    }
    const handleCloseModalTTCustomer = () => {
        setShowModalTTCustomer(false);
    }
    return (
        <Layoutemployee title={"Cập nhật đặt phòng"} icons={cilColorBorder}>
            <div className="mb-3">
                {/* {loading ? (
                    <div className="overlay-loading">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : ""} */}
                {alert && <Alert type={alert.type} title={alert.title} />}
                <div className="cashier-head">
                    <div className="cashier-info">
                        <button className="navbar-toggler custom-toggler d-block d-md-none" type="button" data-bs-toggle="collapse" data-bs-target="#cashierInfoCollapse" aria-controls="cashierInfoCollapse" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse d-md-block" id="cashierInfoCollapse">
                            <div className="cashier-info-row row">
                                <div className="cashier-info-col col-md-3 col-12 mb-2">
                                    <label className="cashier-info-label">Khách hàng</label>
                                    <div className="cashier-info-customer-search">
                                        <div className="customer-search">
                                            {bookingRoom?.booking?.descriptions === "Đặt trực tiếp" ? 
                                            <div className="auto-complete-wrapper form-control-wrapper d-flex" onClick={handleShowModalUpdateCustomer}>
                                                <a className="customer-search-name form-control text-success font-medium">
                                                    {customerInformation[0]?.customerInformationDto?.fullname}
                                                </a>
                                            </div>
                                            : 
                                            <div className="auto-complete-wrapper form-control-wrapper d-flex" onClick={handleShowModalTTCustomer}>
                                                <a className="customer-search-name form-control text-success font-medium">
                                                    {bookingRoom?.booking?.accountDto?.fullname}
                                                </a>
                                            </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="cashier-info-col col-md-3 col-12 mb-2">
                                    <label className="cashier-info-label">Khách ở cùng</label>
                                    <div className="cashier-info-capacity" onClick={handleShowModalInsertCustomer}>
                                        <button className="form-control d-flex align-items-center text-neutral justify-content-between" onClick={handleShowModalInsertCustomer}>
                                            <span><i className="fa fa-user icon-mask icon-xs w-auto"></i>{customerInformation.length} người</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="cashier-info-col col-md-3 col-12">
                                    <label className="cashier-info-label">Ghi chú</label>
                                    <div className="cashier-info-note" style={{ width: "275px" }}>
                                        <div className="form-control">
                                            <span
                                                className="note-text"
                                                style={{
                                                    fontSize: '14px',
                                                    color: 'gray',
                                                    display: 'inline-block',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}
                                            >
                                                {bookingRoom?.booking?.descriptions || "Mô tả...."}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="cashier-body row m-0">
                    <div className="col-12 col-md-4">
                        <div className="cashier-aside" style={{ height: "auto" }}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link nav-dichvu active" id="pills-sp-tab" data-bs-toggle="pill" data-bs-target="#pills-sp" type="button" role="tab" aria-controls="pills-sp" aria-selected="false">
                                            Sản phẩm/Dịch vụ
                                        </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link nav-dichvu" id="pills-ds-tab" data-bs-toggle="pill" data-bs-target="#pills-ds" type="button" role="tab" aria-controls="pills-ds" aria-selected="false">
                                            Danh sách phòng
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            <div className="tab-content" id="pills-tabContent">
                                <div className="tab-pane fade show active" id="pills-sp" role="tabpanel" aria-labelledby="pills-sp-tab">
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
                                                    className={`nav-link ${activeTab === "all" ? "active" : ""}`}
                                                    onClick={() => setActiveTab("all")}
                                                >
                                                    Tất cả
                                                </button>
                                            </li>
                                            {typeServiceRoom.map((category) => (
                                                <li key={category.id} className="nav-item" role="presentation">
                                                    <button
                                                        className={`nav-link ${activeTab === category.serviceRoomName ? "active" : ""}`}
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

                                <div className="tab-pane fade" id="pills-ds" role="tabpanel" aria-labelledby="pills-ds-tab">
                                    <div className="cashier-aside-tab-content">
                                        <div className="group-room" style={{ maxHeight: "450px", overflowY: "auto" }}>
                                            <div className="group-room-list">
                                                <div className="accordion accordion-flush" id="accordionFlushExample">
                                                    {booking.bookingRooms && booking.bookingRooms.length > 0 ? (
                                                        booking.bookingRooms.map((item, index) => {
                                                            const encodedIdBookingRoom = btoa(item.id);
                                                            return (
                                                                <div className="accordion-item mb-2" key={index}>

                                                                    <h2 className="accordion-header">
                                                                        <button
                                                                            className="accordion-button collapsed"
                                                                            type="button"
                                                                            data-bs-toggle="collapse"
                                                                            data-bs-target={`#flush-collapse${index}`}
                                                                            aria-expanded="false"
                                                                            aria-controls={`flush-collapse${index}`}
                                                                            style={{ border: "1px solid #ccc", borderRadius: "0.6rem", boxShadow: "0 2px 12px 0 rgba(0, 0, 0, 12%" }}
                                                                        >
                                                                            {item.room.roomName}
                                                                        </button>
                                                                    </h2>
                                                                    <Link to={`/employee/edit-room?idBookingRoom=${encodedIdBookingRoom}`} style={{ backgroundColor: 'lightblue', transition: 'none' }}>
                                                                        <div id={`flush-collapse${index}`} className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                                                            <div className="accordion-body">
                                                                                <div className="group-room-item mb-1">
                                                                                    <div className="d-flex justify-content-between">
                                                                                        <div>
                                                                                            <strong className="me-1 text-success">{item.room.roomName}</strong>
                                                                                            <span className="tag text-success">{item.room.statusRoomDto.statusRoomName}</span>
                                                                                        </div>
                                                                                        <div className="cell-price fw-bolder text-success">{formatCurrency(item?.room?.typeRoomDto?.price || 0)}</div>
                                                                                    </div>
                                                                                    <div className="text-neutral">{formatDateTime(item.checkIn)} - {formatDateTime(item.checkOut)}</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </Link>
                                                                </div>
                                                            );
                                                        })
                                                    ) : (
                                                        <p>Không có phòng</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="group-room-footer">
                                            <div className="text-success text-right fw-bolder">Tổng cộng: {formatCurrency(totalRoomPrice)} VNĐ</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-8">
                        <div className="cashier-cart">
                            <div className="cashier-cart-body">
                                <div className="cart-container">
                                    <div className="cart-head">
                                        <div className="active">
                                            <div className="d-flex justify-content-between align-items-center flex-wrap">
                                                <div className="cart-head-title d-flex align-items-center">
                                                    <h3 className="mb-0 mr-2 me-2">{bookingRoom?.room?.roomName} - {bookingRoom?.room?.typeRoomDto.typeRoomName}</h3>

                                                    <div className={booking?.statusBookingDto?.id === 6 ? "text-danger" : "text-success"}>
                                                        <span>
                                                            - {booking?.statusBookingDto?.id === 7
                                                                ? `Đang sử dụng: ${calculateUsageDuration(bookingRoom.checkIn)}`
                                                                : booking?.statusBookingDto?.statusBookingName}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="cart-body">
                                        <div className="d-block mb-4">
                                            <div className="cart-info-box">
                                                <div className="row g-3">
                                                    <div className="col-12 col-md-auto">
                                                        <label className="text-neutral font-sm">Phòng</label>
                                                        <span className="form-control">{bookingRoom?.room?.roomName}</span>
                                                    </div>
                                                    <div className="col-12 col-md-auto">
                                                        <label className="text-neutral font-sm d-block">Nhận phòng</label>
                                                        <DatePicker
                                                            selected={bookingRoom.checkIn ? new Date(bookingRoom.checkIn) : null}
                                                            className="custom-date-picker"
                                                            onChange={(date) => setBookingRoom({ ...bookingRoom, checkIn: date })}
                                                            disabled
                                                            showTimeSelect
                                                            timeFormat="HH:mm"
                                                            timeIntervals={15}
                                                            timeCaption="Time"
                                                            dateFormat="dd/MM/yyyy, HH:mm"
                                                        />
                                                    </div>
                                                    <div className="col-12 col-md-auto">
                                                        <label className="text-neutral font-sm d-block">Trả phòng</label>
                                                        <DatePicker
                                                            selected={bookingRoom.checkOut ? new Date(bookingRoom.checkOut) : null}
                                                            className="custom-date-picker"
                                                            onChange={(date) => setBookingRoom({ ...bookingRoom, checkOut: date })}
                                                            disabled={booking?.statusBookingDto?.id === 6 || booking?.statusBookingDto?.id === 8}
                                                            showTimeSelect
                                                            timeFormat="HH:mm"
                                                            timeIntervals={15}
                                                            timeCaption="Time"
                                                            dateFormat="dd/MM/yyyy, HH:mm"
                                                        />
                                                    </div>
                                                    <div className="col-12 col-md-auto">
                                                        <label className="text-neutral font-sm">Lưu trú</label>
                                                        <span className="form-control">
                                                            {calculateDuration(bookingRoom?.booking?.startAt, bookingRoom?.booking?.endAt)} ngày
                                                            {bookingRoom?.booking?.endAt && new Date() > new Date(bookingRoom?.booking?.endAt) && (
                                                                bookingRoom?.booking?.statusDto.id === 7 ? <span className="text-danger"> (Đã quá hạn trả)</span> : ""
                                                            )}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="cart-list">
                                            <table className="table" style={{ margin: "12px" }}>
                                                <thead className="cart-item cart-list-head px-3 font-semibold">
                                                    <tr className="row font-weight-bold align-items-center">
                                                        <th className="col-2 col-lg-1 text-start">STT</th>
                                                        <th className="col-5 col-lg-3">Hạng mục</th>
                                                        <th className="col-4 col-lg-2 text-center">Số lượng</th>
                                                        <th className="col-5 col-lg-3 text-center">Đơn giá</th>
                                                        <th className="col-5 col-lg-2 text-center">Thành tiền</th>
                                                        <th className="col-auto"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="cart-item row align-items-center">
                                                        <td className="col-2 col-lg-1 text-start">1</td>
                                                        <td className="col-5 col-lg-3">
                                                            <h6 className="cart-item-name mb-0">{bookingRoom?.room?.typeRoomDto?.typeRoomName} (Ngày)</h6>
                                                        </td>
                                                        <td className="col-4 col-lg-2 text-center">
                                                            <div className="form-number form-number-sm d-flex justify-content-center align-items-center">
                                                                <input
                                                                    type="text"
                                                                    className="form-control mx-1 text-center"
                                                                    value={calculateDuration(
                                                                        bookingRoom?.booking?.startAt,
                                                                        (booking?.statusBookingDto?.id === 6 || booking?.statusBookingDto?.id === 8)
                                                                            ? bookingRoom?.checkOut
                                                                            : bookingRoom?.booking?.endAt
                                                                    )}
                                                                    style={{ maxWidth: "50px", borderBottom: "none" }}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="col-5 col-lg-3 d-flex justify-content-center">
                                                            <span className="w-auto">{formatCurrency(bookingRoom?.room?.typeRoomDto?.price)}</span>
                                                        </td>
                                                        <td className="col-5 col-lg-2 d-flex text-danger fw-bolder justify-content-center font-semibold">{formatCurrency(bookingRoom?.room?.typeRoomDto?.price * calculateDuration(
                                                            bookingRoom?.booking?.startAt,
                                                            (booking?.statusBookingDto?.id === 6 || booking?.statusBookingDto?.id === 8)
                                                                ? bookingRoom?.checkOut
                                                                : bookingRoom?.booking?.endAt
                                                        ))}</td>
                                                        <td className="col-auto"></td>
                                                    </tr>
                                                    {selectedManualService && selectedManualService.length > 0 ? (
                                                        selectedManualService.map((item, index) => {
                                                            return (
                                                                <tr className="cart-item row align-items-center" key={index}>
                                                                    <td className="col-2 col-lg-1 text-start">{index + 2}</td>
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
                                                                        <span className="text-neutral">{formatDateTime(item.createAt)}</span>
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
                                        <div className="cart-footer">
                                            <div className="text-success fw-bold font-semibold d-flex">
                                                <div className="text-right me-2">Tổng tiền: </div>
                                                <div className="text-right">{formatCurrency(booking?.statusBookingDto?.id === 8 ? booking?.invoiceDtos[0]?.totalAmount : totalBookingRoom)} VNĐ</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="cashier-cart-footer">
                                <div className="d-flex justify-content-between align-items-center flex-wrap">
                                    <div className="d-flex align-items-center">

                                    </div>
                                    <div className="d-flex align-items-center">
                                        <button className="btn btn-outline-success ng-star-inserted mx-2" type="button" onClick={handleAddService} disabled={booking?.statusBookingDto?.id === 6 || booking?.statusBookingDto?.id === 8}>Lưu</button>
                                        <PopupPayment bookings={booking} ></PopupPayment>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {modalCancel && <CancelBookingModal handleClose={handleCloseCancel} booking={booking} />}
            {showModalInsertCustomer && <TTNhanPhong onHide={handleCloseModalInsertCustomer} bookingRoomIds={booking.bookingRooms.map((e) => e.id)} />}
            {showModalUpdateCustomer && <InsertCustomer onClose={handleCloseModalUpdateCustomer} item={customerInformation[0]} bookingRoom={[bookingRoom]} />}
            {showModalTTCustomer && <TTCustomer onClose={handleCloseModalTTCustomer} item={bookingRoom.booking.accountDto}/>}
        </Layoutemployee >
    )
}

export default EditRoom;