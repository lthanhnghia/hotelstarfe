import React, { useState } from "react";
import { formatCurrency } from "../../../../config/formatPrice";
import { Button, Table } from "react-bootstrap";

const OrderRoom = ({ selectedRooms, remove }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const roomsPerPage = 2; // You can change this number to control the number of rows per page

    // Calculate the indexes of the rooms to be displayed on the current page
    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = selectedRooms.slice(indexOfFirstRoom, indexOfLastRoom);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Pagination: calculate total pages
    const totalPages = Math.ceil(selectedRooms.length / roomsPerPage);

    return (
        <div style={{ maxHeight: "150px", width: "100%" }}>
            {selectedRooms.length > 0 && (
                <>
                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th>Tên phòng</th>
                                <th>Loại phòng</th>
                                <th>Nhận phòng</th>
                                <th>Trả phòng</th>
                                <th>Giá</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRooms.map((room) => (
                                <tr key={room.roomId}>
                                    <td>{room.roomName}</td>
                                    <td>{room.typeRoomName}</td>
                                    <td>{room.checkInDate}</td>
                                    <td>{room.checkOutDate}</td>
                                    <td>{formatCurrency(room.price)} VND</td>
                                    <td>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => remove(room.roomId)}  // Call remove function from props
                                        >
                                            Xóa
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    {/* Custom Pagination Controls */}
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <Button
                            variant="outline-secondary"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Trước
                        </Button>
                        <span>Trang {currentPage} / {totalPages}</span>
                        <Button
                            variant="outline-secondary"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Tiếp theo
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default OrderRoom;
