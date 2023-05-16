import { render, screen } from "@testing-library/react";
import HotelDetailsPage from "main/pages/Hotels/HotelDetailsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    id: 3,
  }),
  useNavigate: () => mockNavigate,
}));

jest.mock("main/utils/hotelUtils", () => {
  return {
    __esModule: true,
    hotelUtils: {
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

describe("HotelDetailsPage tests", () => {
  const queryClient = new QueryClient();
  test("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HotelDetailsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("loads the correct fields, and no buttons", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HotelDetailsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(screen.getByText("Beverly Hills")).toBeInTheDocument();
    expect(screen.getByText("1234 Main St")).toBeInTheDocument();
    expect(screen.getByText("Nice hotel")).toBeInTheDocument();

    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Details")).not.toBeInTheDocument();
  });
});
