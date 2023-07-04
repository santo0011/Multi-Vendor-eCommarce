import React from 'react';
import { useNavigate } from 'react-router-dom';


const UnAuthorized = () => {
    const navigate = useNavigate();

    const handelClick = () => {
        navigate('/')
    }

    return (
        <div style={{ padding: "40px" }}>
            <h1 style={{ fontSize: "35px", color: "red" }}>UnAuthorized</h1>
            <button style={{ background: "#444", color: "#fff", padding: "5px", borderRadius: "5px" }} onClick={handelClick}>Go Back</button>
        </div>
    )
}

export default UnAuthorized;