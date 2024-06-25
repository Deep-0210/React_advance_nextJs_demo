import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event'
import LogIn from '../page'
import axios from 'axios';
jest.mock('axios')

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

test('api call for log-in', async () => {
    // axios.post.mockResolvedValueOnce({ data: { message: "Success" } })

    const { getByPlaceholderText, getByText } = render(<LogIn />);

    const emailInput = getByPlaceholderText("Email")
    const passwordInput = getByPlaceholderText("Password")
    const submitButton = getByText("Submit")

    fireEvent.change(emailInput, { target: { value: 'deep4853867@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Deep@123' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalledTimes(1)
        expect(axios.post).toHaveBeenCalledWith("/api/logIn", {
            email: "deep4853867@gmail.com",
            password: "Deep@123"
        })
        expect(getByText('User not found!!')).toBeInTheDocument();
    })
})