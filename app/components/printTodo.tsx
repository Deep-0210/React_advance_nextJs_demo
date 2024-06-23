"use client"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table'
import { Paper, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { Button, Dialog, DialogHeader, DialogBody } from "@material-tailwind/react"

const PrintTodo = () => {
    const route = useRouter();
    const [todo, setTodo] = useState([])

    useEffect(() => {
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
    }, [])

    return (
        <div>
            <div className={`${todo?.length === 0 ? 'hidden' : ''}`}>
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
                            {todo.map((e, i) => {
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
                                                    <Button placeholder={'edit'} variant='filled' color="green" type='submit'>Edit</Button>
                                                </div>
                                                <div className="ms-3">
                                                    <Button placeholder={'delete'} variant='filled' color="red" type='submit'>Delete</Button>
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
        </div>
    )
}

export default PrintTodo
