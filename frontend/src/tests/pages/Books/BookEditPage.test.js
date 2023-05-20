import { render, waitFor, fireEvent } from "@testing-library/react";
import BookEditPage from "main/pages/Books/BookEditPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("BookEditPage tests", () => {

    describe("when the backend doesn't return a todo", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/books", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            const {getByText, queryByTestId, findByText} = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <BookEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await findByText("Edit Book");
            expect(queryByTestId("BookForm-name")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/books", { params: { id: 17 } }).reply(200, {
                id: 17,
                name: "The Hobbit",
                author: "J. R. R. Tolkien",
                genre: "High Fantasy"  
            });
            axiosMock.onPut('/api/books').reply(200, {
                id: 17,
                name: "The Hobbit 2",
                author: "J. R. R. Tolkien 2",
                genre: "High Fantasy 2"  
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <BookEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <BookEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("BookForm-name");

            const idField = getByTestId("BookForm-id");
            const authorField = getByTestId("BookForm-author");
            const nameField = getByTestId("BookForm-name");
            const genreField = getByTestId("BookForm-genre");
            const submitButton = getByTestId("BookForm-submit");

            expect(idField).toHaveValue("17");
            expect(authorField).toHaveValue("J. R. R. Tolkien");
            expect(nameField).toHaveValue("The Hobbit");
            expect(genreField).toHaveValue("High Fantasy");
        });

        test("Changes when you click Update", async () => {



            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <BookEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("BookForm-author");

            const idField = getByTestId("BookForm-id");
            const authorField = getByTestId("BookForm-author");
            const nameField = getByTestId("BookForm-name");
            const genreField = getByTestId("BookForm-genre");
            const submitButton = getByTestId("BookForm-submit");

            expect(idField).toHaveValue("17");
            expect(authorField).toHaveValue("J. R. R. Tolkien");
            expect(nameField).toHaveValue("The Hobbit");
            expect(genreField).toHaveValue("High Fantasy");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(authorField, { target: { value: "J. R. R. Tolkien 2" } })
            fireEvent.change(nameField, { target: { value: "The Hobbit 2" } })
            fireEvent.change(genreField, { target: { value: "High Fantasy 2" } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled);
            expect(mockToast).toBeCalledWith("Book Updated - id: 17 name: The Hobbit 2");
            expect(mockNavigate).toBeCalledWith({ "to": "/books/" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                author: "J. R. R. Tolkien 2",
                name: "The Hobbit 2",
                genre: "High Fantasy 2"
            })); // posted object

        });

       
    });
});



