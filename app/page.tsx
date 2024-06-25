"use client"
import { LogIn } from "@/types/type";
import axios from "axios";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BsEyeSlash, BsEye } from "react-icons/bs";
import * as yup from 'yup'
import Message from "./components/message";

export default function Home() {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  // const router = useRouter()

  // function to manage the password hide and show text
  const handleHideShowPassword = () => {
    if (!showPassword) {
      setShowPassword(true)
    }
    else {
      setShowPassword(false)
    }
  }

  // yup validation to validate user entered data
  const validateUserData = yup.object({
    userEmail: yup.string().required("* Email is a required field").matches(/^[a-zA-Z0-9.]+@[a-zA-Z]+\.[a-zA-Z]{2,5}$/, "* Invalid Email"),
    userPassword: yup.string().required("* Password is a required field").min(6, "* Password must be 6 characters long")
  })

  // formik stat for manage stat for user entered data
  const { resetForm, handleSubmit, handleBlur, touched, handleChange, values, errors } = useFormik({
    initialValues: { userEmail: '', userPassword: '' },
    validationSchema: validateUserData,
    onSubmit(values) {
      handleLogInUser(values)
    }
  })

  // function to call the logIn api
  const handleLogInUser = async (value: LogIn) => {
    const data = {
      email: value?.userEmail,
      password: values?.userPassword
    }

    axios.post('/api/logIn', data).then((res) => {
      if (res.data.message === "Please check your email or password") {
        setErrorMessage("Invalid Credentials!!")
        setTimeout(() => {
          setErrorMessage('')
        }, 1000)
      }
      if (res.data.message === "User not found") {
        setErrorMessage("User not found!!")
        setTimeout(() => {
          setErrorMessage('')
        }, 1000)
      }
      if (res.data.token) {
        localStorage.setItem('token', res?.data?.token)
        // router.push('/todo')
        resetForm()
      }
    }).catch((err) => {
      setErrorMessage("Something Went Wrong !! ")
      setTimeout(() => {
        setErrorMessage('')
      }, 1000)
      console.log(err)
    })
  };

  return (
    <div className="bg-[#031d4e]">
      <div className="flex justify-end p-2.5">
        <button className="text-white p-2 bg-green-700 w-max rounded-lg">  <Link href={'/signUp'}>Sign-Up</Link></button>
      </div>
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <div className="text-white text-4xl align-middle w-full text-center">Log-In</div>

        <form onSubmit={handleSubmit}>
          <div className="w-max border border-white rounded-lg p-4 mx-auto mt-10">
            <span className={`text-sm ${touched?.userEmail && errors?.userEmail ? 'text-red-700 font-semibold' : 'text-white'}`}>Email</span>
            <div className="mb-5 mt-1">
              <input type="email" name="userEmail" id="userEmail" className={`h-8 rounded-lg px-2 ${touched.userEmail && errors.userEmail ? 'border-2 border-red-700' : ''}`} data-testid="ok-email" placeholder="Email" onChange={handleChange} onBlur={handleBlur} />
            </div>

            <span className={`text-sm ${touched?.userPassword && errors?.userPassword ? 'text-red-700 font-semibold' : 'text-white'}`}>Password</span>
            <div className="mb-5 mt-1 relative">
              <input type={showPassword ? 'text' : 'password'} name="userPassword" id="userPassword" className={`h-8 rounded-lg px-2 ${touched?.userPassword && errors?.userPassword ? 'border-2 border-red-700' : ''}`} placeholder="Password" onChange={handleChange} onBlur={handleBlur} />

              <div className="absolute top-0 right-0 pe-5 mt-2 cursor-pointer" onClick={handleHideShowPassword}>
                {showPassword ? <div><BsEyeSlash /></div> : <div className="">
                  <BsEye />
                </div>}
              </div>
            </div>

            <div className="mt-8 w-max mx-auto">
              <button className="bg-green-700 p-2 rounded-lg" type="submit">Submit</button>
            </div>
          </div>
        </form>
      </div>

      {/* <Message errorMessage={errorMessage} successMessage="" /> */}
    </div>
  );
}
