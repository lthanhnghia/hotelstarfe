import React, { useEffect, useState } from "react";
import LayoutAdmin from "../../../components/layout/admin/DefaultLayout";
import { Button, Card, Col, Container, Form, Row, Carousel } from "react-bootstrap";
import ModalImage from "./modal-image";
import { getProvinces, getDistrictsByProvince, getWardsByDistrict, getHotel, getImageHotel, updateHotel, updateHotelNew } from "../../../services/admin/home-info-service";
import Alert from "../../../config/alert";

const HotelInfo = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [hotel, setHotel] = useState({});
    const [imageHotel, setImageHotel] = useState({});
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        getProvinces()
            .then((data) => {
                setProvinces(data);
            })
            .catch(error => console.error(error));
        handleHotelChange();
        handleImageHotelChange();
    }, []);

    const handleProvinceChange = async (event) => {
        const provinceCode = event.target.value;
        setSelectedProvince(provinceCode);
        setSelectedDistrict(''); // Đặt lại district và ward
        setWards([]);
        setDistricts([]); // Đặt lại districts để tránh hiển thị sai

        try {
            const districts = await getDistrictsByProvince(provinceCode);
            setDistricts(districts);

            // Tìm tên của tỉnh đã chọn
            const selectedProvince = provinces.find(province => String(province.code) === String(provinceCode));
            console.log("Selected Province:", selectedProvince);
            setHotel(prevHotel => ({
                ...prevHotel,
                province: selectedProvince ? selectedProvince.name : '' // Cập nhật tên tỉnh
            }));
        } catch (error) {
            console.error(error);
        }
    };

    const handleDistrictChange = async (event) => {
        const districtCode = event.target.value;
        setSelectedDistrict(districtCode);

        try {
            const wards = await getWardsByDistrict(districtCode);
            setWards(wards);

            // Tìm tên của huyện đã chọn
            const selectedDistrict = districts.find(district => String(district.code) === String(districtCode));
            setHotel(prevHotel => ({
                ...prevHotel,
                district: selectedDistrict ? selectedDistrict.name : '' // Cập nhật tên huyện
            }));
        } catch (error) {
            console.error(error);
        }
    };

    const handleWardChange = (event) => {
        const wardCode = event.target.value;
        setSelectedWard(wardCode);
        // Tìm tên của xã đã chọn
        const selectedWard = wards.find(ward => String(ward.code) === String(wardCode));
        setHotel(prevHotel => ({
            ...prevHotel,
            ward: selectedWard ? selectedWard.name : '' // Cập nhật tên xã
        }));
    };

    const handleHotelChange = async () => {
        const data = await getHotel();
        if (!data?.status) {
            setHotel(data);
        } else {
            setAlert({ type: 'errorr', title: `${data.status}` });
        }
    };

    const handleImageHotelChange = async () => {
        try {
            const data = await getImageHotel();
            setImageHotel(data[0]);
            if (data?.code) {
                setAlert({ type: `${data.status}`, title: `${data.message}` });
            }
        } catch (error) {
            setAlert({ type: 'error', title: 'Lỗi khi tải dữ liệu thông tin khách sạn' });
        }

    };
    const updateHotel = async () => {
        console.log("Updating hotel with data:", hotel); // Log dữ liệu để kiểm tra
        const updateHotelData = await updateHotelNew(hotel);
        console.log("Update response:", updateHotelData); // Log phản hồi từ API

        if (updateHotelData?.status === "Success") {
            await handleHotelChange(); // Gọi lại hàm để cập nhật thông tin khách sạn mới
            setAlert({ type: "success", title: `${updateHotelData?.message}` });
        } else {
            setAlert({ type: "error", title: `${updateHotelData?.message}` });
        }
    };


    const handleUpdateHotel = () => {
        // Kiểm tra xem người dùng đã chọn tỉnh/thành và quận/huyện hợp lệ chưa
        if (selectedProvince && !selectedDistrict) {
            setAlert({ type: "error", title: "Vui lòng chọn quận/huyện khớp với tỉnh/thành đã chọn." });
            return; // Dừng lại và không cho phép cập nhật
        }

        if (selectedDistrict && !selectedWard) {
            setAlert({ type: "error", title: "Vui lòng chọn phường/xã khớp với quận/huyện đã chọn." });
            return; // Dừng lại và không cho phép cập nhật
        }

        // Nếu tất cả trường hợp hợp lệ, tiến hành cập nhật
        updateHotel();
        setTimeout(() => setAlert(null), 3000); // Xóa thông báo sau 3 giây
    };


    return (
        <LayoutAdmin>
            <Container>
                {alert && <Alert type={alert.type} title={alert.title} />}
                <Card style={{ backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px" }}>
                    <h4 style={{ fontWeight: "bold" }}>Thông tin khách sạn</h4>
                    <Row className="mt-4">
                        <Col md={3} className="text-center">
                            <img
                                src={imageHotel?.imageName}
                                alt="Logo"
                                style={{ width: "200px", height: "200px", objectFit: "contain", marginBottom: "10px" }}
                            />
                            <div style={{ color: "#007bff", cursor: "pointer" }} onClick={handleShow}>Chọn ảnh</div>
                            <p style={{ fontSize: "12px", color: "gray" }}>Lưu ý: Ảnh không vượt quá 10 tấm và lấy ảnh đầu làm ảnh đại diện</p>
                        </Col>
                        <Col md={9}>
                            <Row>
                                <Col md={6} className="mb-3">
                                    <Form.Group controlId="storeName">
                                        <Form.Label>Tên khách sạn</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={hotel?.hotelName || ''} // Đảm bảo hotelName không bị undefined
                                            onChange={(e) => setHotel({ ...hotel, hotelName: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <Form.Group controlId="province">
                                        <Form.Label>Tỉnh/Thành phố</Form.Label>
                                        <Form.Control as="select" value={selectedProvince} onChange={handleProvinceChange}>
                                            <option value="">{hotel?.province}</option>
                                            {provinces.map(province => (
                                                <option key={province.code} value={province.code}>{province.name}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>

                                <Col md={6} className="mb-3">
                                    <Form.Group controlId="district">
                                        <Form.Label>Quận/Huyện</Form.Label>
                                        <Form.Control as="select" value={selectedDistrict} onChange={handleDistrictChange} disabled={!selectedProvince}>
                                            <option value="">{hotel?.district}</option>
                                            {Array.isArray(districts) && districts.map(district => (
                                                <option key={district.code} value={district.code}>{district.name}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <Form.Group controlId="ward">
                                        <Form.Label>Phường/Xã</Form.Label>
                                        <Form.Control as="select" disabled={!selectedDistrict} onChange={handleWardChange}>
                                            <option value="">{hotel?.ward}</option>
                                            {Array.isArray(wards) && wards.map(ward => (
                                                <option key={ward.code} value={ward.code}>{ward.name}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <Form.Group controlId="address">
                                        <Form.Label>Địa chỉ</Form.Label>
                                        <Form.Control type="text" value={hotel?.address}
                                            onChange={(e) => setHotel({ ...hotel, address: e.target.value })} />
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <Form.Group controlId="ward">
                                        <Form.Label>Mô tả</Form.Label>
                                        <Form.Control as="textarea" value={hotel?.descriptions} placeholder="Mô tả dịch vụ phòng"
                                            onChange={(e) => setHotel({ ...hotel, descriptions: e.target.value })} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="text-right mt-3">
                                <Button variant="success" onClick={handleUpdateHotel}>
                                    <i className="fa fa-save"></i> Lưu
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </Container>
            <ModalImage show={show} handleClose={handleClose} />
        </LayoutAdmin>
    );
};

export default HotelInfo;
