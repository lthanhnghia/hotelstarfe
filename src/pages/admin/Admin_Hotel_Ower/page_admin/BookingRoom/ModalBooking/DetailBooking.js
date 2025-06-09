import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { getByIdBooking } from '../../../../../../services/admin/crudServiceReservations';
import { format, isValid } from 'date-fns';
import 'bootstrap/dist/css/bootstrap.min.css';

function DetailRow({ label, value }) {
    return (
        <div className="detail-row">
            <strong>{label}:</strong>
            <span>{value}</span>
        </div>
    );
}

function DetailBooking({ object }) {
    const [isModalVisible, setModalVisible] = useState(false);
    const [dataDetailBooking, setDataDetailBooking] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const closeModal = () => {
        setModalVisible(false);
    };

    const openModal = () => {
        setModalVisible(true);
        handleDetailBooking();
    };

    useEffect(() => {
        handleDetailBooking();
    }, [object.bookingId, object.roomName]);

    const handleDetailBooking = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getByIdBooking(object.bookingId, object.roomName);
            setDataDetailBooking(res);
        } catch (err) {
            setError('Lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrencyVND = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const getFormattedDate = (date) => {
        const parsedDate = new Date(date);
        return isValid(parsedDate) ? format(parsedDate, 'yyyy-MM-dd HH:mm:ss') : 'Chưa có thông tin';
    };

    const bookingDetails = {
        customerName: dataDetailBooking.fullname || 'Chưa có thông tin',
        phone: dataDetailBooking.phone || 'Chưa có thông tin',
        email: dataDetailBooking.email || 'Chưa có thông tin',
        bookingId: dataDetailBooking.bookingId || 'Chưa có thông tin',
        checkIn: getFormattedDate(dataDetailBooking.startAt),
        checkOut: getFormattedDate(dataDetailBooking.endAt),
        guestCount: dataDetailBooking.maxGuests || 'Chưa có thông tin',
        roomType: dataDetailBooking.typeRoomName || 'Chưa có thông tin',
        roomNumber: dataDetailBooking.roomName || 'Chưa có thông tin',
        roomRate: formatCurrencyVND(dataDetailBooking.price || 0),
        totalAmount: formatCurrencyVND(dataDetailBooking.totalAmount || 0),
        status: dataDetailBooking.statusBookingName || 'Chưa có thông tin',
        paymentMethod: dataDetailBooking.methodPaymentName || 'Chưa có thông tin',
        paymentStatus: dataDetailBooking.statusPayment ? "Đã thanh toán" : "Chưa thanh toán",
    };

    const labelMap = {
        customerName: 'Tên khách hàng',
        phone: 'Số điện thoại',
        email: 'Email',
        bookingId: 'Mã đặt phòng',
        checkIn: 'Ngày nhận phòng',
        checkOut: 'Ngày trả phòng',
        guestCount: 'Số khách',
        roomType: 'Loại phòng',
        roomNumber: 'Số phòng',
        roomRate: 'Giá phòng',
        totalAmount: 'Tổng tiền',
        status: 'Trạng thái',
        paymentMethod: 'Phương thức thanh toán',
        paymentStatus: 'Trạng thái thanh toán',
    };

    const renderGroup = (groupTitle, fields) => (
        <div className="detail-group">
            <h5>{groupTitle}</h5>
            {fields.map((key) => (
                <DetailRow key={key} label={labelMap[key]} value={bookingDetails[key]} />
            ))}
        </div>
    );

    return (
        <>
            <Button variant="primary" size="sm" onClick={openModal}>
                Chi tiết
            </Button>
            <Modal show={isModalVisible} onHide={closeModal} centered>
                <Modal.Header closeButton className="modal-header-custom">
                    <Modal.Title className="w-100 text-center">
                        <h3 className="modal-title">Chi Tiết Đặt Phòng</h3>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading && <p>Đang tải dữ liệu...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {!loading && !error && (
                        Object.keys(bookingDetails).length === 0 || Object.values(bookingDetails).every(value => !value) ? (
                            <p>Chưa có đơn đã đặt</p>
                        ) : (
                            <div className="modal-detail row">
                                <div className='col-md-6'>
                                    {renderGroup("Thông tin khách hàng", ["customerName", "phone", "email"])}
                                </div>
                                <div className='col-md-6' style={{ borderLeft: '1px solid #cccccc' }}>
                                    {renderGroup("Thông tin thanh toán", ["totalAmount", "status", "paymentMethod", "paymentStatus"])}
                                </div>
                                <hr />
                                <div className='col-md-12 mt-2'>
                                    {renderGroup("Thông tin phòng", ["bookingId", "checkIn", "checkOut", "guestCount", "roomType", "roomNumber", "roomRate"])}
                                </div>
                            </div>
                        )
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            <style>{`
                .modal-header-custom {
                    background-color: #fea116;
                    color: white;
                    border-bottom: 1px solid #dddddd;
                }
                .modal-title {
                    font-size: 1.5rem;
                    font-weight: bold;
                }
                .modal-detail {
                    display: flex;
                    flex-wrap: wrap;
                }
                .detail-group {
                    padding-bottom: 10px;
                    margin-bottom: 10px;
                }
                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                }
                .detail-group h5 {
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 8px;
                }
                .detail-row:last-child {
                    border-bottom: none;
                }
                .detail-row strong {
                    font-weight: 600;
                }
                .detail-group span {
                    font-weight: normal;
                }
                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    padding: 1rem;
                }
            `}</style>
        </>
    );
}

export default DetailBooking;
