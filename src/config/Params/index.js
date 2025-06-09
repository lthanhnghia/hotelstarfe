import { useLocation } from 'react-router-dom';

const useGetParams = (paramName) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const params = queryParams.get(paramName);
    return params;
}

export default useGetParams;
