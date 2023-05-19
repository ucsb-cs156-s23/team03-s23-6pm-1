import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import HotelEditPage from "main/pages/Hotels/HotelEditPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    id: 3,
  }),
  useNavigate: () => mockNavigate,
}));

const mockUpdate = jest.fn();
jest.mock("main/utils/hotelUtils", () => {
  return {
    __esModule: true,
    hotelUtils: {
      update: (_hotel) => {
        return mockUpdate();
      },
      getById: (_id) => {
        return {
          hotel: {
            id: 3,
            name: "Beverly Hills",
            address: "1234 Main St",
            description: "Nice hotel",
          },
        };
      },
    },
  };
});

describe("HotelEditPage tests", () => {
  const queryClient = new QueryClient();

  test("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HotelEditPage />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("loads the correct fields", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HotelEditPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByTestId("HotelForm-name")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Beverly Hills")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1234 Main St")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Nice hotel")).toBeInTheDocument();
  });

  test("redirects to /hotels on submit", async () => {
    const restoreConsole = mockConsole();

    mockUpdate.mockReturnValue({
      hotel: {
        id: 3,
        name: "Village Inn",
        address: "1234 Main St",
        description: "Neat hotel",
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HotelEditPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const nameInput = screen.getByLabelText("Name");
    expect(nameInput).toBeInTheDocument();

    const descriptionInput = screen.getByLabelText("Description");
    expect(descriptionInput).toBeInTheDocument();

    const addressInput = screen.getByLabelText("Address");
    expect(addressInput).toBeInTheDocument();

    const updateButton = screen.getByText("Update");
    expect(updateButton).toBeInTheDocument();

   
    fireEvent.change(nameInput, {
      target: { value: "Village Inn" },
    });
    fireEvent.change(descriptionInput, {
      target: { value: "1234 Main St" },
    });
    fireEvent.change(addressInput, {
      target: { value: "Neat hotel" },
    });
    fireEvent.click(updateButton);
    

    await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/hotels"));

    // assert - check that the console.log was called with the expected message
    expect(console.log).toHaveBeenCalled();
    const message = console.log.mock.calls[0][0];
    const expectedMessage = `updatedHotel: {"hotel":{"id":3,"name":"Village Inn","address":"1234 Main St","description":"Neat hotel"}}`;

    expect(message).toMatch(expectedMessage);
    restoreConsole();
  });
});
