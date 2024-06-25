"use client"
import React, { useEffect, useState } from 'react'
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { Data } from '@/types/type';
import axios from 'axios';
import { headers } from 'next/headers';
import { useRouter } from 'next/navigation';

const ConfirmationModal = ({ confirmationModal, resetModalValue, deleteData }: { confirmationModal: number, resetModalValue: Function, deleteData: Data }) => {
    const [open, setOpen] = useState(false);
    const route = useRouter()

    // function to open and close the modal
    const handleOpen = () => {
        setOpen(!open);
        resetModalValue(0)
    };

    /**
     * useEffect will trigger when the @param confirmationModal value will change
    */
    useEffect(() => {
        if (confirmationModal === 1) {
            setOpen(!open);
        }
    }, [confirmationModal]);

    // function to delete todo
    const deleteTodo = () => {
        // Delete a todo with the given ID
        const data = {
            id: deleteData?._id
        };

        const config = {
            headers: {
                token: localStorage.getItem('token')
            },
            data: data
        }

        axios.delete('/api/todo', config).then((res) => {
            if(res.data?.removed){
                setOpen(!open);
                resetModalValue(1)
            }
        }).catch((err) => {
            if (err.response.status === 401) {
                localStorage.removeItem('token')
                route.push('/')
            }
            console.error(err);
        });

    }

    return (
        <div>
            <Dialog open={open} handler={handleOpen} placeholder={'mainClass'} >
                <DialogHeader placeholder={'title'} children={'Delete Todo'} />
                <DialogBody placeholder={'description'} >
                    Are you sure want to delete {deleteData?.todo}
                </DialogBody>
                <DialogFooter placeholder={'footer'} >
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleOpen}
                        className="mr-1" children={'cancel'} placeholder={'cancel'} />
                    <Button variant="gradient" color="green" onClick={deleteTodo} children={'delete'} placeholder={'delete'} />
                </DialogFooter>
            </Dialog>
        </div>
    )
}

export default ConfirmationModal
