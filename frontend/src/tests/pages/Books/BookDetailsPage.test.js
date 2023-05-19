import { render, screen } from "@testing-library/react";
import BookDetailsPage from "main/pages/Books/BookDetailsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: 3
    }),
    useNavigate: () => mockNavigate
}));

jest.mock('main/utils/bookUtils', () => {
    return {
        __esModule: true,
        bookUtils: {
            getById: (_id) => {
                return {
                    book: {
                        id: 3,
                        name: "The Great Gatsby",
                        author: "F. Scott Fitzgerald",
                        genre: "Tragedy"
                    }
                }
            }
        }
    }
});

describe("BookDetailsPage tests", () => {

    const queryClient = new QueryClient();
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
        expect(screen.getByText("The Great Gatsby")).toBeInTheDocument();
        expect(screen.getByText("F. Scott Fitzgerald")).toBeInTheDocument();
        expect(screen.getByText("Tragedy")).toBeInTheDocument();

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.queryByText("Details")).not.toBeInTheDocument();
    });

});


