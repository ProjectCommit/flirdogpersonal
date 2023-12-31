import axios from 'axios';
import React, { useEffect, useState } from 'react';

const SomoimDetailMain = ({somoimId}) => {
    const [formData, setFormData] = useState({});

    const { introduceDetail } = formData;

    useEffect(() => {
        console.log('소모임 메인에서 부르는 소모임 아이디 :' + somoimId)
        if(somoimId) {
            axios.get(`/somoim/getSomoimForm?id=${somoimId}`)
                .then(res => {
                    setFormData(res.data)
                }).catch(error => console.log(error))
        }
    },[somoimId])

    return (
        <div>
            {/* 소모임 메인 페이지 입니다.<br/> */}
            {/* { introduceDetail } */}
            <div dangerouslySetInnerHTML={{ __html: introduceDetail }} />
        </div>
    );
};

export default SomoimDetailMain;