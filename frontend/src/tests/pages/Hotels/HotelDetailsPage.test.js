import { render, screen } from "@testing-library/react";
import HotelDetailsPage from "main/pages/Hotels/HotelDetailsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
// for mocking /api/currentUser and /api/systemInfo
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    useParams: () => ({
      id: 3,
      name: "Grand Hotel",
      description: "fantastic",
      address: "123 State",
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("HotelDetailsPage tests", () => {
  // mock /api/currentUser and /api/systemInfo
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
    axiosMock.onGet("/api/hotels", { params: { id: 3 } }).reply(200, {
      id: 3,
      name: "Grand Hotel",
      description: "fantastic",
      address: "123 State",
    });
  });

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
    expect(screen.getByText("Grand Hotel")).toBeInTheDocument();
    expect(screen.getByText("fantastic")).toBeInTheDocument();
    expect(screen.getByText("123 State")).toBeInTheDocument();

    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Details")).not.toBeInTheDocument();
  });
});
