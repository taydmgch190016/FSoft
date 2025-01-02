import React, { cloneElement }  from 'react'
import { useNavigate } from 'react-router-dom';

export const RoleName = {
  ADMIN : 'admin',
  STAFF : 'staff',
  GUEST : 'guest',
}

const RoleProtected = (props) => {
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem('userData') || '{}');

    if (!user.role) return null;
    if (!props.allowedRole.includes(user.role)) {
        return navigate('/NotFound');
    }

    return cloneElement(props.children, props);
}
export default RoleProtected