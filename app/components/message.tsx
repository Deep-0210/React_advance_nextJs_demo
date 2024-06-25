"use client"
import React, { useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Message = React.memo(({ successMessage, errorMessage }: { successMessage: string, errorMessage: string }) => {
    useEffect(() => {
        if (errorMessage?.length) {
            toast.error(`${errorMessage}`, {
                className: "login-toast",
                position: 'bottom-left',
                autoClose: 3000
            });
        }
    }, [errorMessage])

    useEffect(() => {
        if (successMessage?.length) {
            console.log('...')
            toast.success(`${successMessage}`, {
                className: "login-toast",
                position: 'bottom-left',
                autoClose: 3000
            });
        }
    }, [successMessage])

    return (
        <div>
            <ToastContainer />
        </div>
    )
})

export default Message
