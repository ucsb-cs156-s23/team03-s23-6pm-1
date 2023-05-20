import {render, screen, waitFor} from "@testing-library/react";
import RestaurantIndexPage from "main/pages/Restaurants/RestaurantIndexPage";
import {QueryClient, QueryClientProvider} from "react-query";
import {MemoryRouter} from "react-router-dom";
import mockConsole from "jest-mock-console";

// for mocking /api/currentUser and /api/systemInfo
import {apiCurrentUserFixtures} from "fixtures/currentUserFixtures";
import {systemInfoFixtures} from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import {restaurantFixtures} from "../../../fixtures/restaurantFixtures";


const mockToast = jest.fn();
jest.mock('react-toastify', () => {
  const originalModule = jest.requireActual('react-toastify');
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x)
  };
});

describe("RestaurantIndexPage tests", () => {
  // mock /api/currentUser and /api/systemInfo
  const axiosMock = new AxiosMockAdapter(axios);
  const testId = "RestaurantTable";

  let queryClient;
  beforeEach(() => {
    queryClient = new QueryClient();
  });

  const setupUserOnly = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
  };

  const setupAdminUser = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
  };

  test("renders without crashing for regular user", () => {
    setupUserOnly();
    axiosMock.onGet("/api/restaurants/all").reply(200, []);
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RestaurantIndexPage/>
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("renders without crashing for admin user", () => {
    setupAdminUser();
    axiosMock.onGet("/api/restaurants/all").reply(200, []);
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RestaurantIndexPage/>
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("renders three restaurants correctly for regular user", async () => {
    setupUserOnly();
    axiosMock.onGet("/api/restaurants/all").reply(200, restaurantFixtures.threeRestaurants);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RestaurantIndexPage/>
        </MemoryRouter>
      </QueryClientProvider>
    );

    const createRestaurantButton = screen.getByText("Create Restaurant");
    expect(createRestaurantButton).toBeInTheDocument();
    expect(createRestaurantButton).toHaveAttribute("style", "float: right;");

    await waitFor(() => {
      const name = screen.getByText("Freebirds");
      expect(name).toBeInTheDocument();
    });

    const description = screen.getByText("Burrito joint, and iconic Isla Vista location");
    expect(description).toBeInTheDocument();

    const address = screen.getByText("879 Embarcadero del Norte");
    expect(address).toBeInTheDocument();

    expect(screen.getByTestId("RestaurantTable-cell-row-0-col-Details-button")).toBeInTheDocument();
    expect(screen.queryByTestId("RestaurantTable-cell-row-0-col-Delete-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("RestaurantTable-cell-row-0-col-Edit-button")).not.toBeInTheDocument();
  });

  test("renders three restaurants correctly for admin user", async () => {
    setupAdminUser();
    axiosMock.onGet("/api/restaurants/all").reply(200, restaurantFixtures.threeRestaurants);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RestaurantIndexPage/>
        </MemoryRouter>
      </QueryClientProvider>
    );

    const createRestaurantButton = screen.getByText("Create Restaurant");
    expect(createRestaurantButton).toBeInTheDocument();
    expect(createRestaurantButton).toHaveAttribute("style", "float: right;");

    await waitFor(() => {
      const name = screen.getByText("Freebirds");
      expect(name).toBeInTheDocument();
    });

    const description = screen.getByText("Burrito joint, and iconic Isla Vista location");
    expect(description).toBeInTheDocument();

    const address = screen.getByText("879 Embarcadero del Norte");
    expect(address).toBeInTheDocument();

    expect(screen.getByTestId("RestaurantTable-cell-row-0-col-Details-button")).toBeInTheDocument();
    expect(screen.getByTestId("RestaurantTable-cell-row-0-col-Delete-button")).toBeInTheDocument();
    expect(screen.getByTestId("RestaurantTable-cell-row-0-col-Edit-button")).toBeInTheDocument();
  });

  // delete is tested in RestaurantTable.test.js

  test("renders empty table when backend unavailable", async () => {
    setupUserOnly();
    const restoreConsole = mockConsole();

    axiosMock.onGet("/api/restaurants/all").timeout();


    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RestaurantIndexPage/>
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1));

    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching("Error communicating with backend via GET on /api/restaurants/all"),
      expect.anything()
    );
    restoreConsole();

    expect(screen.queryByTestId(`${testId}-cell-row-0-id`)).not.toBeInTheDocument();
  });

});