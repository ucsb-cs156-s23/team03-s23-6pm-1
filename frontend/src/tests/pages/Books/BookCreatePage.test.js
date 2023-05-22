import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import BookCreatePage from "main/pages/Books/BookCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

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
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("BooksCreatePage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const book = {
            id: 17,
            name: "The Hobbit",
            author: "J. R. R. Tolkien",
            genre: "High Fantasy"  
        };

        axiosMock.onPost("/api/books/post").reply( 202, book );

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("BookForm-name")).toBeInTheDocument();
        });

        const nameField = getByTestId("BookForm-name");
        const authorField = getByTestId("BookForm-author");
        const genreField = getByTestId("BookForm-genre");
        const submitButton = getByTestId("BookForm-submit");

        fireEvent.change(nameField, { target: { value: 'The Hobbit' } });
        fireEvent.change(authorField, { target: { value: 'J. R. R. Tolkien' } });
        fireEvent.change(genreField, { target: { value: 'High Fantasy' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
                name: "The Hobbit",
                author: "J. R. R. Tolkien",
                genre: "High Fantasy" 
        });

        expect(mockToast).toBeCalledWith("New book Created - id: 17 name: The Hobbit");
        expect(mockNavigate).toBeCalledWith({ "to": "/books/" });
    });


});


