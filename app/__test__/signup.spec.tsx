import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SignUp from "../signUp/page";
import axios from "axios";
const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock('axios')

test('email input', async () => {
    render(<SignUp />)
    const element = screen.getByPlaceholderText("Email")
    expect(element).toBeInTheDocument;
    expect(element).toHaveAttribute("type", "email");
    expect(element).toHaveClass('rounded-lg');
});

test("password input", () => {
    render(<SignUp />)
    const element = screen.getByPlaceholderText("Password")
    expect(element).toBeInTheDocument;
    expect(element).toHaveAttribute("type", "password");
    expect(element).toHaveClass('rounded-lg');
})

test("validation check", async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);

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

test("api call for sign-up", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { userExist: "User Exist" } });

    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");
    const submitButton = getByText("Submit");

    fireEvent.change(emailInput, { target: { value: 'deep485386@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Deep@123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/signUp', {
            email: 'deep485386@gmail.com',
            password: 'Deep@123'
        });

        const toastMessage = screen.getByTestId("tost-message");
        expect(toastMessage.textContent).toBe("User Exist");
    });
});