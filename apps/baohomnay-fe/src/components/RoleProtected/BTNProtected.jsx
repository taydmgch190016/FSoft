import React, { cloneElement }  from 'react'

export const RoleName = {
    ADMIN : 'admin',
    STAFF : 'staff',
    GUEST : 'guest',
  }

const BTNProtected = (props) => {
    const user = JSON.parse(sessionStorage.getItem('userData') || '{}');

    if (!user.role) return null;
    if (!props.allowedRole.includes(user.role)) {
        return null;
    }

    return cloneElement(props.children, {
        onClick: props.children.props.onClick, 
        className: props.children.props.className, 
    });
}
export default BTNProtected