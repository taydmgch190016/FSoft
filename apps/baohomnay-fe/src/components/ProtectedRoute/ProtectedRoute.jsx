import React, { useEffect, useState } from 'react'
import { Navigate, Outlet , useNavigate} from 'react-router-dom';
import { getToken } from '../../service/account.service';
import { Spin } from 'antd';

const ProtectedRoute = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem('userData') || '{}');

    const verifyUser = async () => {
        try {
            await getToken();
            setIsAuthenticated(true);
            setIsLoading(false);
        }
        catch(error)
        {
            setIsAuthenticated(false);
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        verifyUser();
    }, []);

    const checkAuthen = () => {
        if(isLoading) {
            return <Spin />
        }
        if (!props.allowedRole.includes(user.role)) {
            return navigate('/NotFound');
        }
        if(isAuthenticated) return props.children;

        return <Navigate to='/auth/login' replace />
    }

    return <>{checkAuthen()}</>
}

export default ProtectedRoute