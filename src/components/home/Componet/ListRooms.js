import React, { useState, useRef } from "react";
import './style/ListRooms.css';

const ListRooms = ({ item, selectedRooms, handleSelectRoom, handleDeselectRoom }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(item?.roomId?.length / itemsPerPage);
    const currentItems = item?.roomId?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const listRef = useRef(null);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);

            if (listRef.current) {
                const offset = 100;
                const topPosition = listRef.current.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: topPosition, behavior: "smooth" });
            }
        }
    };

    return (
        <div className="col-12 col-md-8">
            <div className="row">
                <div className="col-12">
                    <h3 className="navbar-brand">Danh sách phòng</h3>
                    <button
                        className="btn btn-primary d-block d-md-none w-100 mb-3"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#roomList-${item.typeRoomId}`}
                        aria-controls={`roomList-${item.typeRoomId}`}
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <i className="fas fa-door-open me-2"></i> Danh sách phòng
                    </button>

                    <div className="card border-0">
                        <div
                            className="collapse d-md-block custom-room-list"
                            id={`roomList-${item.typeRoomId}`}
                            ref={listRef}
                        >
                            <ul className="custom-room-list">
                                {currentItems?.length > 0 ? (
                                    currentItems.map((roomId, subIndex) => {
                                        const isRoomSelected = selectedRooms.some(
                                            (room) => room.roomId === roomId
                                        );

                                        const listItemClass = `custom-room-item ${isRoomSelected ? "selected" : ""
                                            }`;

                                        return (
                                            <li
                                                key={`${roomId}-${subIndex}`}
                                                className={listItemClass}
                                                aria-disabled={isRoomSelected}
                                            >
                                                <span>
                                                    {item.roomName[
                                                        subIndex +
                                                        (currentPage - 1) * itemsPerPage
                                                    ]}
                                                </span>
                                                <button
                                                    className={`custom-room-btn ${isRoomSelected ? "selected" : "select"
                                                        }`}
                                                    onClick={() =>
                                                        isRoomSelected
                                                            ? handleDeselectRoom(roomId)
                                                            : handleSelectRoom({ Object: item, roomId })
                                                    }
                                                    disabled={isRoomSelected}
                                                >
                                                    {isRoomSelected ? "Đã chọn" : "Chọn phòng"}
                                                </button>
                                            </li>
                                        );
                                    })
                                ) : (
                                    <li className="custom-room-item text-center">
                                        Không có phòng nào để hiển thị.
                                    </li>
                                )}
                            </ul>
                            {/* Check if there are more than 5 rooms before displaying pagination */}
                            {item?.roomId?.length > 5 && (
                                <div className="pagination-controls mt-3 d-flex justify-content-center">
                                    <button
                                        className="btn btn-primary me-2"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Trước
                                    </button>
                                    {Array.from({ length: totalPages }, (_, index) => (
                                        <button
                                            key={index + 1}
                                            className={`btn ${currentPage === index + 1 ? "btn-primary" : "btn-outline-warning"} mx-1`}
                                            onClick={() => handlePageChange(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    <button
                                        className="btn btn-primary ms-2"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Sau
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { ListRooms };
