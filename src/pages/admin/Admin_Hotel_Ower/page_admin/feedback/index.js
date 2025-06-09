import React, { useState } from "react";
import FeedbackDangCho from "./DangCho";
import FeedbackDaPhanHoi from "./DaPhanHoi";

const FeedbackPageComponent = () => {
    const [currentTab, setCurrentTab] = useState(0);

    const renderTabContent = () => {
        switch (currentTab) {
            case 0:
                return (<FeedbackDangCho />);
            case 1:
                return (<FeedbackDaPhanHoi />);
            default:
                return null;
        }
    };
    

    return (
        <div className="container-fluid">
            <div className="card shadow-sm">
                <div className="card-body">
                    <h2 className="card-title">Đánh giá</h2>

                    {/* Tabs */}
                    <ul className="nav nav-tabs mt-4">
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link ${currentTab === 0 ? "active" : ""}`}
                                onClick={() => setCurrentTab(0)}
                            >
                                Chờ phản hồi
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link ${currentTab === 1 ? "active" : ""}`}
                                onClick={() => setCurrentTab(1)}
                            >
                                Đã phản hồi
                            </button>
                        </li>
                    </ul>
                    <div className="tab-content">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default FeedbackPageComponent;