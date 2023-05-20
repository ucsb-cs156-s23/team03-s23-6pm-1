import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "react-query";
import RestaurantTable from "main/components/Restaurants/RestaurantTable";
import {restaurantFixtures} from "fixtures/restaurantFixtures";
import {currentUserFixtures} from "../../../fixtures/currentUserFixtures";
import AxiosMockAdapter from "axios-mock-adapter";
import axios from "axios";
import mockConsole from "jest-mock-console";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
  const originalModule = jest.requireActual('react-toastify');
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x)
  };
});

describe("RestaurantTable tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = ["id", "Name", "Description", "Address"];
  const expectedFields = ["id", "name", "description", "address"];
  const testId = "RestaurantTable";

  test("renders without crashing for empty table with user not logged in", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RestaurantTable restaurants={[]} currentUser={null}/>
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("renders without crashing for empty table for ordinary user", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RestaurantTable restaurants={[]} currentUser={currentUserFixtures.userOnly}/>
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("renders without crashing for empty table for admin", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RestaurantTable restaurants={[]} currentUser={currentUserFixtures.adminUser}/>
        </MemoryRouter>
      </QueryClientProvider>
    );
  });


  test.each([
    "adminUser",
    "userOnly",
  ])

  ("Has the expected column headers, content, and buttons for %s", (user) => {
    const currentUser = currentUserFixtures[user];

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RestaurantTable restaurants={restaurantFixtures.threeRestaurants} currentUser={currentUser}/>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Cristino's Bakery");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-name`)).toHaveTextContent("Freebirds");

    const detailsButton = screen.getByTestId(`${testId}-cell-row-0-col-Details-button`);
    expect(detailsButton).toBeInTheDocument();
    expect(detailsButton).toHaveClass("btn-primary");

    if (user === "adminUser") {


      const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
      expect(editButton).toBeInTheDocument();
      expect(editButton).toHaveClass("btn-primary");

      const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).toHaveClass("btn-danger");
    } else {
      expect(screen.queryByText("Delete")).not.toBeInTheDocument();
      expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    }
  });


  test("Has the expected column headers, content and no buttons when showButtons=false", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RestaurantTable restaurants={restaurantFixtures.threeRestaurants}
                           showButtons={false}
                           currentUser={currentUser}/>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Cristino's Bakery");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-name`)).toHaveTextContent("Freebirds");

    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Details")).not.toBeInTheDocument();
  });


  test("Edit button navigates to the edit page for admin user", async () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RestaurantTable restaurants={restaurantFixtures.threeRestaurants} currentUser={currentUser}/>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Cristino's Bakery");

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/restaurants/edit/2'));
  });

  test("Details button navigates to the details page", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RestaurantTable restaurants={restaurantFixtures.threeRestaurants}/>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Cristino's Bakery");

    const detailsButton = screen.getByTestId(`${testId}-cell-row-0-col-Details-button`);
    expect(detailsButton).toBeInTheDocument();

    fireEvent.click(detailsButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/restaurants/details/2'));
  });

  const axiosMock = new AxiosMockAdapter(axios);
  test("Delete button calls delete callback", async () => {
    const restoreConsole = mockConsole();
    axiosMock.onDelete('/api/restaurants', {params: {id: 2}}).reply(200, "Restaurant with id 2 was deleted");
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RestaurantTable restaurants={restaurantFixtures.threeRestaurants} currentUser={currentUser}/>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Cristino's Bakery");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);

    await waitFor(() => expect(axiosMock.history.delete.length).toBe(1));
    expect(axiosMock.history.delete[0].url).toBe('/api/restaurants');

    expect(console.log).toHaveBeenCalled()
    expect(mockToast).toHaveBeenCalledWith("Restaurant with id 2 was deleted")

    restoreConsole()
  });
});