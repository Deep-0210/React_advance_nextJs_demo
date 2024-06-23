import { userLogInModel } from "@/models/logIn";
import { dbConnect } from "@/utils/dbConnect";
import { validateLogInUserData } from "@/validators/validateLogInData";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const POST = async (req: NextRequest, res: NextResponse) => {
    try {
        const data = await req.json()
        const validateData = validateLogInUserData(data)

        if (validateData.error) {
            return new Response(JSON.stringify({ "message": validateData.error.details[0]?.message }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            })
        }
        else {
            const isConnect = await dbConnect();

            if (isConnect) {

                const isUserExist = await userLogInModel.findOne({ "email": data.email });

                if (isUserExist) {

                    const validatePassword = await bcrypt.compare(data.password, isUserExist.password);

                    if (validatePassword) {
                        const token = await jwt.sign({ "email": isUserExist.email }, `todo`);
                        return new Response(JSON.stringify({ "token": token }), {
                            status: 200,
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                    }
                    else {
                        return new Response(JSON.stringify({ "message": "Please check your email or password" }), {
                            status: 200,
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                    }
                }
                else {
                    return new Response(JSON.stringify({ "message": "User not found" }), {
                        status: 200,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                }
            }
        }
    } catch (error) {
        return new Response(JSON.stringify({ "message": error }), { status: 500 })
    }
}