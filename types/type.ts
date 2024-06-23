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