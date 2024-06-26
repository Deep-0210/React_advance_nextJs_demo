import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LogIn from '../page'
import axios from 'axios';
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>;


test('LogIn text', () => {
    render(<LogIn />)
    const element = screen.getByText(/Log-In/i)
    expect(element).toBeInTheDocument
});

test('email input', async () => {
    render(<LogIn />)
    const element = screen.getByPlaceholderText("Email")
    expect(element).toBeInTheDocument;
    expect(element).toHaveAttribute("type", "email");
    expect(element).toHaveClass('rounded-lg');
});

test("password input", () => {
    render(<LogIn />)
    const element = screen.getByPlaceholderText("Password")
    expect(element).toBeInTheDocument;
    expect(element).toHaveAttribute("type", "password");
    expect(element).toHaveClass('rounded-lg');
})

test("validation check", async () => {
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

test('api call for log-in', async () => {
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
})