import React, { useState } from "react";
import { Button, Modal } from 'react-bootstrap';
import DatPhong from "../../list-reservation/modalDatPhong";
import ModalNhanPhong from "../modalNhanPhong";
import InsertCustomer from "../../list-reservation/modalInsertCustomer";
import { Link } from "react-router-dom";

const ModalORR = ({ onClose }) => {
    const [ShowInserRoom, setShowInsertRoom] = useState(false);

    const handleShowModalInserRoom = () => {
        setShowInsertRoom(true);
    };
    const handleCloseModalInserRoom = () => {
        setShowInsertRoom(false);
    };

    const [showModalNhanPhong, setShowModalNhanPhong] = useState(false);

    const handleShowModalNhanPhong = () => {
        setShowModalNhanPhong(true);
    }
    const handleCloseModalNhanPhong = () => {
        setShowModalNhanPhong(false);
    }
    const [showModalInsertCustomer, setShowModalInsertCustomer] = useState(false);

    const handleShowModalInsertCustomer = () => {
        setShowModalInsertCustomer(true);
    }
    const handleCloseModalInsertCustomer = () => {
        setShowModalInsertCustomer(false);
    }
    return (
        <>
            <Modal className="custom-modal-width1 modal-dialog-centered" show={true} onHide={onClose} style={{paddingRight: "143px"}}>
                <div className="modal-content modal-fill" style={{ width: "auto" }}>
                    <Modal.Header closeButton>
                        <Modal.Title id="exampleModalLabel">Đặt/Nhận phòng nhanh</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-body-order-recevice">
                        <div className="boxster ng-star-inserted">
                            <div className="collapse d-block" id="cashierInfoCollapse">
                                <div className="cashier-info-row row">
                                    <div className="cashier-info-col col-md-3 col-12 mb-2">
                                        <label className="cashier-info-label">Khách hàng</label>
                                        <div className="cashier-info-customer-search">
                                            <div className="customer-search">
                                                <div className="auto-complete-wrapper form-control-wrapper d-flex">
                                                    <a className="customer-search-name form-control text-info font-medium" title="Lê Minh Khôi | Nợ: 0 Số lượng mua: 0">
                                                        Lê Minh Khôi
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="cashier-info-col col-md-3 col-12 mb-2">
                                        <label className="cashier-info-label">Khách lưu trú</label>
                                        <div className="cashier-info-capacity">
                                            <button className="form-control d-flex align-items-center text-neutral justify-content-between" onClick={handleShowModalInsertCustomer}>
                                                <span><i className="fa fa-user icon-mask icon-xs w-auto"></i> 1</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="table-responsive boxster mt-2">
                            <table className="table table-striped">
                                <thead style={{ borderStyle: "hidden" }}>
                                    <tr>
                                        <td>Hạng phòng</td>
                                        <td>Phòng</td>
                                        <td>Giờ nhận</td>
                                        <td>Giờ trả</td>
                                        <td>Thành tiền</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="text-center">
                                        <td> Phòng 01 giường đôi cho 2 người </td>
                                        <td>
                                            <select className="form-select"
                                                style={{ lineHeight: 1, width: "auto" }}
                                                aria-label="Default select example">
                                                <option></option>
                                                <option value="1">P.309</option>
                                                <option value="2">P.302</option>
                                                <option value="3">P.310</option>
                                            </select>
                                        </td>
                                        <td>
                                            <input type="datetime-local" name="" id="" />
                                        </td>
                                        <td>
                                            <input type="datetime-local" name="" id="" />
                                        </td>
                                        <td>
                                            <span>100,000</span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-icon-only btn-circle text-danger">
                                                <i className="fa fa-trash-alt"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="d-flex justify-content-end mt-5 btn-responsive">
                            <button className="btn btn-outline-success" onClick={handleShowModalInserRoom}>
                                <i className="fa fa-plus-circle me-2"></i>
                                <span>Chọn thêm phòng</span>
                            </button>
                        </div>
                        <div className="d-flex spacer spacer-lg justify-content-between w-100 align-items-start mt-3 ng-star-inserted">
                            <div className="flex-fill">
                                <div className="form-row form-labels-50">
                                    <label className="col-form-label font-semibold text-nowrap">Ghi chú </label>
                                    <div className="col-form-control">
                                        <textarea id="note-booking-calendar" maxlength="1000"
                                            name="note"
                                            className="form-control form-control-line max-width-400 ng-pristine ng-valid ng-touched"
                                            style={{ height: "2rem" }}>
                                        </textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="payment-suggest-money p-4">
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <span className="font-semibold"> Khách cần trả </span>
                                    </div>
                                    <div className="col-md-6 text-end">
                                        <button
                                            className="form-control" style={{width: "auto"}}>
                                            <strong className="text-primary">150,000</strong>
                                        </button>
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6 d-flex align-items-center">
                                        <span> Khách thanh toán </span>
                                    </div>
                                    <div className="col-md-6">
                                        <input
                                            id="txt-payment"
                                            type="text"
                                            className="form-control"
                                            style={{ borderBottom: "1px solid gray" }} />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <span> Tiền thừa </span>
                                    </div>
                                    <div className="col-md-6 text-end">
                                        <span className="font-regular text-primary">150,000</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Link to="/employee/edit-room">
                        <button className="btn btn-light text-secondary">Thêm tùy chọn</button>
                        </Link>
                        <Button variant="outline-success" onClick={handleShowModalNhanPhong}>Nhận phòng</Button>
                        <Button variant="success">Đặt trước</Button>
                    </Modal.Footer>
                </div>
                {ShowInserRoom && <DatPhong onClose={handleCloseModalInserRoom} />}
                {showModalNhanPhong && <ModalNhanPhong onClose={handleCloseModalNhanPhong} />}
                {showModalInsertCustomer && <InsertCustomer onClose={handleCloseModalInsertCustomer} />}
            </Modal>
        </>
    )
}

export default ModalORR