import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import HotelCreatePage from "main/pages/Hotels/HotelCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockAdd = jest.fn();
jest.mock("main/utils/hotelUtils", () => {
  return {
    __esModule: true,
    hotelUtils: {
      add: () => {
        return mockAdd();
      },
    },
  };
});

describe("HotelCreatePage tests", () => {
  const queryClient = new QueryClient();
  test("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HotelCreatePage />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("redirects to /hotels on submit", async () => {
    const restoreConsole = mockConsole();

    mockAdd.mockReturnValue({
      // prettier-ignore
      "hotel": {
          id: 1,
          name: "The Ritz-Carlton",
          address: "1150 22nd St NW, Washington, DC 20037",
          description:
            "Guests can enjoy stunning views of the city and easy access to top attractions.",
        },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HotelCreatePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const nameInput = screen.getByLabelText("Name");
    expect(nameInput).toBeInTheDocument();

    const addressInput = screen.getByLabelText("Address");
    expect(addressInput).toBeInTheDocument();

    const descriptionInput = screen.getByLabelText("Description");
    expect(descriptionInput).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

  
    
      fireEvent.change(nameInput, { target: { value: "The Ritz-Carlton" } });
      fireEvent.change(descriptionInput, {
        target: {
          value:
            "Guests can enjoy stunning views of the city and easy access to top attractions.",
        },
      });
      fireEvent.change(addressInput, {
        target: { value: "1150 22nd St NW, Washington, DC 20037" },
      });
      fireEvent.click(createButton);
    

    await waitFor(() => expect(mockAdd).toHaveBeenCalled());
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/hotels"));

    // assert - check that the console.log was called with the expected message
    expect(console.log).toHaveBeenCalled();
    const message = console.log.mock.calls[0][0];
    const expectedMessage = `createdHotel: {"hotel":{"id":1,"name":"The Ritz-Carlton","address":"1150 22nd St NW, Washington, DC 20037","description":"Guests can enjoy stunning views of the city and easy access to top attractions."}`;

    expect(message).toMatch(expectedMessage);
    restoreConsole();
  });
});
