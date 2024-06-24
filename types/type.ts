export interface LogIn {
    userEmail: string,
    userPassword: string
}

export interface Todo {
    userTodo: string
}

export interface Middleware {
    decodeToken: {
        email: string,
        iat: number
    },
    valid: boolean
}

export interface EditTodo {
    todo: string
    _id: string
    edit: boolean
}

export interface Data {
    todo: string
    _id: string
}