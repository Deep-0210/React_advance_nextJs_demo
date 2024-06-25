"use client"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { SetStateAction, useEffect, useState } from 'react'
import Table from '@mui/material/Table'
import { Paper, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { Data } from '@/types/type'
import ConfirmationModal from './confirmationModal'
import Message from './message'

const PrintTodo = ({ setEditTodo, reApiCall }: { setEditTodo: React.Dispatch<SetStateAction<any>>, reApiCall: number }) => {
    const route = useRouter();
    const [todo, setTodo] = useState([])
    const [confirmationModal, setConfirmationModal] = useState<number>(0)
    const [deleteData, setDeleteData] = useState<Data>({ todo: "", _id: "" })
    const [successMessage, setSuccessMessage] = useState<string>('')

    // function to call the api to get the todo list
    const getData = () => {
        axios.get('/api/todo', {
            headers: {
                token: localStorage.getItem('token')
            }
        }).then((res) => {
            if (res.data?.message) {
                setTodo(res.data?.message)
            }
        }).catch((err) => {
            if (err.response.status === 401) {
                localStorage.removeItem('token')
                route.push('/')
            }
            console.log(err)
        })
    };

    useEffect(() => {
        if (reApiCall === 1) {
            getData()
        }
    }, [reApiCall])

    useEffect(() => {
        getData()
    }, []);

    // function to get the data for edit todo
    const editTodo = (e: React.MouseEvent<HTMLButtonElement>) => {
        const id = (e.target as HTMLButtonElement).id
        const data: any = todo?.find((e: Data) => e?._id === id)
        setEditTodo({ todo: data?.todo, _id: data?._id, edit: true })
    };

    // function to get todo data for delete
    const deleteTodo = (e: React.MouseEvent<HTMLButtonElement>) => {
        const id = (e.target as HTMLButtonElement).id
        setConfirmationModal(1)
        const data: any = todo?.find((e: Data) => e?._id === id)
        setDeleteData(data)
    };

    // function to reset the modal value
    const resetModalValue = (e: number) => {
        if (e === 1) {
            getData();
            setSuccessMessage("Data removed successfully!!")
            setTimeout(() => {
                setSuccessMessage('')
            }, 1000)
        }
        setConfirmationModal(0);
    };

    return (
        <div>
            <div>
                {todo?.length > 0 && <TableContainer component={Paper} style={{ backgroundColor: 'transparent' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {Object.keys(todo[0]).map((d, j) => {
                                    return (
                                        <TableCell key={++j} sx={{ border: 2, borderColor: 'white' }} align="center">
                                            <span className="text-xl font-semibold text-white">
                                                {d}
                                            </span>
                                        </TableCell>
                                    )
                                })}
                                <TableCell sx={{ border: 2, borderColor: 'white' }} align="center">
                                    <span className="text-xl font-semibold text-white">
                                        Controls
                                    </span>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {todo.map((e: any, i) => {
                                return (
                                    <TableRow key={++i}>
                                        {Object.values(e).map((a, j) => {
                                            return (
                                                <TableCell key={++j} scope="row" align="center" sx={{ border: 2, borderColor: 'white' }}>
                                                    <span className="text-lg text-white">
                                                        {j === 0 ? ++i : (a as string)}
                                                    </span>
                                                </TableCell>
                                            )
                                        })}
                                        <TableCell scope="row" align="center" sx={{ border: 2, borderColor: 'white' }} >
                                            <div className="flex justify-center w-max mx-auto">
                                                <div className="me-3">
                                                    <button className="bg-green-700 px-6 py-3 rounded-lg text-white font-semibold" id={e?._id} onClick={(e) => editTodo(e)}>EDIT</button>
                                                </div>
                                                <div className="ms-3">
                                                    <button className="bg-red-700 px-6 py-3 rounded-lg text-white font-semibold" id={e?._id} onClick={(e) => deleteTodo(e)}>DELETE</button>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>}
            </div>

            <ConfirmationModal confirmationModal={confirmationModal} resetModalValue={resetModalValue} deleteData={deleteData} />

            <Message errorMessage='' successMessage={successMessage} />
        </div>
    )
}

export default PrintTodo
