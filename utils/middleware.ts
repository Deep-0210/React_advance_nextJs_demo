import jwt from 'jsonwebtoken'

export const validateToken = async (token: string) => {
    try {
        const decodeToken = jwt.verify(token, `todo`);
        if (decodeToken) {
            return { decodeToken: decodeToken, valid: true };
        }
    } catch (error) {
        return false;
    }
}