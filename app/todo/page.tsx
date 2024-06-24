"use client"
import { EditTodo, Todo } from '@/types/type'
import axios from 'axios'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import Message from '../components/message'
import PrintTodo from '../components/printTodo'

const UserTodo = () => {

    const route = useRouter()
    const [successMessage, setSuccessMessage] = useState<string>('')
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [editTodo, setEditTodo] = useState<EditTodo>()
    const [reApiCall, setReApiCall] = useState<number>(0)

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            route.push('/')
        }
    }, [])

    // function to logout user
    const userLogOut = () => {
        localStorage.removeItem('token')
        route.push('/')
    }

    // yup validation to validate user entered data
    const validateUserData = yup.object({
        userTodo: yup.string().required("* Todo is a required field")
    })

    // formik stat for manage stat for user entered data
    const { resetForm, handleSubmit, handleBlur, touched, handleChange, values, errors, setValues } = useFormik({
        initialValues: { userTodo: '' },
        validationSchema: validateUserData,
        onSubmit(values) {
            if (editTodo?._id && editTodo?.edit) {
                updateTodo(values)
            }
            else {
                submitTodo(values)
            }
        }
    });

    // function to submit the todo
    const submitTodo = async (value: Todo) => {
        const data = {
            todo: value?.userTodo
        }
        axios.post('/api/todo', data, {
            headers: {
                token: localStorage.getItem('token')
            }
        }).then((res) => {
            if (res?.data?.dataAdd) {
                setSuccessMessage('Data Added');
                setReApiCall(1)
                setTimeout(() => {
                    setSuccessMessage('')
                    setReApiCall(0)
                }, 1000);
                resetForm()
            }
        }).catch((err) => {
            if (err.response.status === 401) {
                localStorage.removeItem('token')
                route.push('/')
            }
            setErrorMessage("Something Went Wrong !!")
            setTimeout(() => {
                setErrorMessage('')
            }, 1000)
        })
    };

    // Function to update todo value
    const updateTodo = async (value: Todo) => {
        const data = {
            id: editTodo?._id,
            todo: value?.userTodo
        }
        axios.put('/api/todo', data, {
            headers: {
                token: localStorage.getItem('token')
            }
        }).then((res) => {
            if (res?.data?.updated) {
                setSuccessMessage("Data Updated Successfully");
                setReApiCall(1)
                setTimeout(() => {
                    setSuccessMessage('')
                    setReApiCall(0)
                }, 1000)
                resetForm()
                setEditTodo({ _id: '', edit: false, todo: '' })
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    useEffect(() => {
        if (editTodo?._id) {
            const data = {
                userTodo: editTodo?.todo
            }
            setValues(data)
        }
    }, [editTodo])

    return (
        <div className="bg-[#031d4e] w-full h-[100%]">
            <div className='flex justify-end p-2.5'>
                <button className="bg-green-700 p-2 rounded-lg text-white" onClick={userLogOut}>Log-Out</button>
            </div>

            <div className="w-full pt-10">
                <div className="text-white text-4xl align-middle w-full text-center">Todo</div>
                <form onSubmit={handleSubmit}>
                    <div className="w-max border border-white rounded-lg p-4 mx-auto mt-10">
                        <div className="mb-5 mt-1">
                            <input type="text" name="userTodo" id="userTodo" value={values?.userTodo} className={`h-8 rounded-lg px-2 ${touched.userTodo && errors.userTodo ? 'border-2 border-red-700' : ''}`} placeholder="Todo" onChange={handleChange} onBlur={handleBlur} />
                        </div>

                        <div className="mt-5 w-max mx-auto">
                            {(editTodo?._id && editTodo?.edit) ?
                                <button className="bg-green-700 p-2 rounded-lg" type="submit">Update</button>
                                :
                                <button className="bg-green-700 p-2 rounded-lg" type="submit">Add</button>
                            }
                        </div>
                    </div>
                </form>

                <Message successMessage={successMessage} errorMessage={errorMessage} />

                <div className='mt-20'>
                    <PrintTodo setEditTodo={setEditTodo} reApiCall={reApiCall} />
                </div>
            </div>
        </div>
    )
}

export default UserTodo
