import { render, screen, waitFor } from "@testing-library/react";

import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";
import HotelIndexPage from "main/pages/Hotels/HotelIndexPage";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockDelete = jest.fn();
jest.mock("main/utils/hotelUtils", () => {
  return {
    __esModule: true,
    hotelUtils: {
      del: (id) => {
        return mockDelete(id);
      },
      get: () => {
        return {
          nextId: 5,
          hotels: [
            {
              id: 3,
              name: "Beverly Hills",
              address: "1234 Main St",
              description: "Great place",
            },
          ],
        };
      },
    },
  };
});

describe("HotelIndexPage tests", () => {
  const queryClient = new QueryClient();
  test("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HotelIndexPage />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("renders correct fields", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HotelIndexPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const createHotelButton = screen.getByText("Create Hotel");
    expect(createHotelButton).toBeInTheDocument();
    expect(createHotelButton).toHaveAttribute("style", "float: right;");

    const name = screen.getByText("Beverly Hills");
    expect(name).toBeInTheDocument();

    const address = screen.getByText("1234 Main St");
    expect(address).toBeInTheDocument();

    const description = screen.getByText("Great place");
    expect(description).toBeInTheDocument();

    expect(
      screen.getByTestId("HotelTable-cell-row-0-col-Delete-button")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("HotelTable-cell-row-0-col-Details-button")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("HotelTable-cell-row-0-col-Edit-button")
    ).toBeInTheDocument();
  });

  test("delete button calls delete and reloads page", async () => {
    const restoreConsole = mockConsole();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HotelIndexPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const name = screen.getByText("Beverly Hills");
    expect(name).toBeInTheDocument();

    const address = screen.getByText("1234 Main St");
    expect(address).toBeInTheDocument();

    const description = screen.getByText("Great place");
    expect(description).toBeInTheDocument();

    const deleteButton = screen.getByTestId(
      "HotelTable-cell-row-0-col-Delete-button"
    );
    expect(deleteButton).toBeInTheDocument();

    deleteButton.click();

    expect(mockDelete).toHaveBeenCalledTimes(1);
    expect(mockDelete).toHaveBeenCalledWith(3);

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/hotels"));

    // assert - check that the console.log was called with the expected message
    expect(console.log).toHaveBeenCalled();
    const message = console.log.mock.calls[0][0];
    const expectedMessage = `HotelIndexPage deleteCallback: {"id":3,"name":"Beverly Hills","address":"1234 Main St","description":"Great place"}`;
    expect(message).toMatch(expectedMessage);
    restoreConsole();
  });
});
