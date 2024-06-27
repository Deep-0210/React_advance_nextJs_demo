import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import LogIn from '../page'
import axios from 'axios';
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("LogIn test cases",() => {

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    })

    it('LogIn text', () => {
        render(<LogIn />)
        const element = screen.getByText(/Log-In/i)
        expect(element).toBeInTheDocument
    });
    
    it('email input', async () => {
        render(<LogIn />)
        const element = screen.getByPlaceholderText("Email")
        expect(element).toBeInTheDocument;
        expect(element).toHaveAttribute("type", "email");
        expect(element).toHaveClass('rounded-lg');
    });
    
    it("password input", () => {
        render(<LogIn />)
        const element = screen.getByPlaceholderText("Password")
        expect(element).toBeInTheDocument;
        expect(element).toHaveAttribute("type", "password");
        expect(element).toHaveClass('rounded-lg');
    })
    
    it("validation check", async () => {
        const { getByPlaceholderText, getByText } = render(<LogIn />);
    
        const emailInput = getByPlaceholderText("Email");
        const passwordInput = getByPlaceholderText("Password");
        const submitButton = getByText("Submit");
    
        fireEvent.change(emailInput, { target: { value: 'deep485386@gmail' } });
        fireEvent.change(passwordInput, { target: { value: 'Deep' } });
    
        fireEvent.click(submitButton);
    
        await waitFor(() => {
            const passwordElement = screen.getByTestId("ok-password");
            expect(passwordElement).toHaveClass('border-2 border-red-700');
    
            const emailElement = screen.getByTestId("ok-email");
            expect(emailElement).toHaveClass('border-2 border-red-700');
        });
    });
    
    it('api call for log-in', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: { message: "User not found" } })
    
        const { getByPlaceholderText, getByText } = render(<LogIn />);
    
        const emailInput = getByPlaceholderText("Email")
        const passwordInput = getByPlaceholderText("Password")
        const submitButton = getByText("Submit")
    
        fireEvent.change(emailInput, { target: { value: 'deep4853867@gmail.com' } });
        fireEvent.change(passwordInput, { target: { value: 'Deep@123' } });
    
        fireEvent.click(submitButton);
        const tostMessage = screen.getByTestId("tost-message")
    
    
        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledTimes(1)
            expect(tostMessage.textContent).toBe("User not found!!")
        })
    });
    
    it('api call for log-in invalid credentials', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: { message: "Please check your email or password" } })
    
        const { getByPlaceholderText, getByText } = render(<LogIn />);
    
        const emailInput = getByPlaceholderText("Email")
        const passwordInput = getByPlaceholderText("Password")
        const submitButton = getByText("Submit")
    
        fireEvent.change(emailInput, { target: { value: 'deep485386@gmail.com' } });
        fireEvent.change(passwordInput, { target: { value: 'Deep@1234' } });
    
        fireEvent.click(submitButton);
    
        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledTimes(1);
            expect(mockedAxios.post).toHaveBeenCalledWith('/api/logIn', {
                email: 'deep485386@gmail.com',
                password: 'Deep@1234'
            });
    
            const toastMessage = screen.getByTestId("tost-message");
            expect(toastMessage.textContent).toBe("Invalid Credentials!!");
        });
    });
});