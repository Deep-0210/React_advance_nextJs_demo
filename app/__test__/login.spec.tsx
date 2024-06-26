import { render, screen, fireEvent, waitFor, getAllByTestId, getByTestId } from '@testing-library/react';
import LogIn from '../page'
import axios from 'axios';
import PrintTodo from '../components/printTodo';
import { EditTodo } from '@/types/type';
import UserTodo from '../todo/page';
import { headers } from 'next/headers';
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mokeTodo = [
    {
        _id: '123',
        todo: "Test1"
    },
    {
        _id: '456',
        todo: "Test2"
    },
    {
        _id: '789',
        todo: "Test3"
    },
    {
        _id: '1201',
        todo: "Test4"
    }
]

const mockSetEditTodo = jest.fn();
const mockSetSuccessMessage = jest.fn();

const mokeReApiCall = 0

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

test('check todo length', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { message: mokeTodo } });

    const { getByTestId } = render(
        <PrintTodo
            reApiCall={0}
            setSuccessMessage={mockSetSuccessMessage}
            setEditTodo={mockSetEditTodo}
        />
    );

    await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith('/api/todo', { headers: { token: null } });
    });

    const row = await waitFor(() => getByTestId('table-body'));
    expect(row).toBeInTheDocument();

    expect(row.children).toHaveLength(4);
});