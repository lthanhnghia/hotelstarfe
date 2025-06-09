import {request} from '../../config/configApi';

const getReservationReport = async (startDate, endDate) => {
    const res = await request({
        method: "GET",
        path: `api/booking/reservation?startDate=${startDate}&endDate=${endDate}`
    });
    return res;
}

const getStartDateWithInvoice = async (date) => {
    const res = await request({
        method: "GET",
        path: `api/booking/by-start-date-with-invoice?date=${date}`
    });
    return res;
}

const getStatistics = async (startDate,endDate) => {
    const res = await request({
        method: "GET",
        path: `api/invoice/statistics?startDate=${startDate}&endDate=${endDate}`
    });
    return res;
}
const getStatistics2 = async (startDate,endDate) => {
    const res = await request({
        method: "GET",
        path: `api/invoice/statistics2?startDate=${startDate}&endDate=${endDate}`
    });
    return res;
}
const getStatisticsAll = async () => {
    const res = await request({
        method: "GET",
        path: `api/invoice/getAll-statistics`
    });
    return res;
}
const getInvoiceStatisticsAll = async () => {
    const res = await request({
        method: "GET",
        path: `api/invoice/getAll-reservation`
    });
    return res;
}

export {getReservationReport,getStartDateWithInvoice,getStatistics,getStatistics2,getStatisticsAll,getInvoiceStatisticsAll};