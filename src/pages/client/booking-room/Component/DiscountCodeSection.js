import { useState } from 'react';

const DiscountCodeSection = ({ discounts, discountNameTotal }) => {
    const [selectedDiscount, setSelectedDiscount] = useState(null);

    const handleDiscountSelect = (discount) => {
        if (selectedDiscount?.id === discount.id) {
            // If the discount is already selected, deselect it
            setSelectedDiscount(null);
            discountNameTotal(null); // Notify the parent that no discount is selected
        } else {
            // Select the new discount
            setSelectedDiscount(discount);
            discountNameTotal(discount); // Pass the selected discount to the parent component
        }
    };
    const formattedDate = (dateString) => {
        const [year, month, day] = dateString.split("-");
        return `${day}/${month}/${year}`;
    };
    return (
        <div className="col-12">
            <div className="discount-code-section p-3 rounded shadow-sm bg-light">
                <h4 className="mb-3 text-warning">Áp dụng mã giảm giá</h4>

                {/* Check if discounts list is empty */}
                {discounts.length > 0 ? (
                    <div className="row row-cols-1 row-cols-md-2 g-4">
                        {discounts.map((discount) => (
                            <div
                                key={discount.id}
                                className="col"
                                onClick={() => handleDiscountSelect(discount)} // Toggle selection
                            >
                                <div
                                    className={`card shadow-sm border-0 cursor-pointer ${selectedDiscount?.id === discount.id ? 'bg-warning text-dark' : 'bg-white text-muted'}`}
                                    style={{
                                        transition: 'background-color 0.3s ease, border 0.3s ease',
                                        border: selectedDiscount?.id === discount.id ? '2px solid #FEAF39' : '1px solid #ddd',
                                    }}
                                >
                                    <div className="card-body p-3">
                                        <h5 className="card-title" style={{
                                            color: selectedDiscount?.id === discount.id ? '#333' : '#FEAF39',
                                            fontSize: '1.1rem',
                                            fontWeight: 'bold',
                                        }}>
                                            {discount.discountName}
                                        </h5>
                                        <p className="card-text" style={{
                                            fontSize: '0.9rem',
                                            margin: '5px 0',
                                            color: selectedDiscount?.id === discount.id ? '#333' : '#6c757d',
                                        }}>
                                            {discount.percent}% Giảm giá
                                        </p>
                                        <p className="text-muted" style={{
                                            fontSize: '0.85rem',
                                            margin: '5px 0',
                                        }}>
                                            {formattedDate(discount.startDate.substring(0, 10))} - {formattedDate(discount.endDate.substring(0, 10))}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted">Không có mã giảm giá khả dụng.</p>
                )}
            </div>
        </div>
    );
};

export default DiscountCodeSection;
