import { render, screen } from "@testing-library/react";
import BookDetailsPage from "main/pages/Books/BookDetailsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 1,
            name: 'The Hobbit',
            author: "J. R. R. Tolkien",
            genre: "High Fantasy"
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("BookDetailsPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);
    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        setupUserOnly();
        axiosMock.onGet("/api/books", { params: { id: 1 } }).reply(200, {
            id: 1,
            name: "The Hobbit",
            author: "J. R. R. Tolkien",
            genre: "High Fantasy"
        });
    });

    const testId = "BookTable";
    const queryClient = new QueryClient();

    const setupUserOnly = () => {
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdminUser = () => {
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields, and no buttons", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(screen.getByText("The Hobbit")).toBeInTheDocument();
        expect(screen.getByText("J. R. R. Tolkien")).toBeInTheDocument();
        expect(screen.getByText("High Fantasy")).toBeInTheDocument();

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.queryByText("Details")).not.toBeInTheDocument();
    });

});


