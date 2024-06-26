import { render, waitFor } from "@testing-library/react";
import PrintTodo from "../components/printTodo";
import axios from "axios";
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