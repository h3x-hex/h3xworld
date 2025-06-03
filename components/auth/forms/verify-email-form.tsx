'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'


const VerifyEmailForm = () => {

    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    
    console.log(token);

    return (
        <div>VerifyEmailForm</div>
    )
}

export default VerifyEmailForm