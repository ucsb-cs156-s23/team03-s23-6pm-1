import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import RestaurantCreatePage from "main/pages/Restaurants/RestaurantCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";
import { toBeInTheDocument } from "@testing-library/jest-dom/dist/matchers";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockAdd = jest.fn();
jest.mock('main/utils/restaurantUtils', () => {
    return {
        __esModule: true,
        restaurantUtils: {
            add: () => { return mockAdd(); }
        }
    }
});

describe("RestaurantCreatePage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("redirects to /restaurants on submit", async () => {

        const restoreConsole = mockConsole();

        mockAdd.mockReturnValue({
            "restaurant": {
                id: 3,
                name: "South Coast Deli",
                description: "Sandwiches and Salads",
                address: "10 E. Carrillo St."
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();


        const descriptionInput = screen.getByLabelText("Description");
        expect(descriptionInput).toBeInTheDocument();

        const addressInput = screen.getByLabelText("Address");
        expect(addressInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(nameInput, { target: { value: 'South Coast Deli' } });
        fireEvent.change(descriptionInput, { target: { value: 'Sandwiches and Salads' } });
        fireEvent.change(addressInput, { target: { value: '10 E. Carrillo St.' } });

        expect(createButton).toBeInTheDocument();

        fireEvent.click(createButton);

        await waitFor(() => expect(mockAdd).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/restaurants"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `createdRestaurant: {"restaurant":{"id":3,"name":"South Coast Deli","description":"Sandwiches and Salads","address":"10 E. Carrillo St."}}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


