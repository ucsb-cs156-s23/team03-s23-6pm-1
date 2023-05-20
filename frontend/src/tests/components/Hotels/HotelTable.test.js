import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import HotelTable, { showCell } from "main/components/Hotels/HotelTable";
import { hotelFixtures } from "fixtures/hotelFixtures";
import mockConsole from "jest-mock-console";
import { currentUserFixtures } from "../../../fixtures/currentUserFixtures";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("HotelTable tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = ["id", "Name", "Description", "Address"];
  const expectedFields = ["id", "name", "description", "address"];
  const testId = "HotelTable";

  test("showCell function works properly", () => {
    const cell = {
      row: {
        values: { a: 1, b: 2, c: 3 },
      },
    };
    expect(showCell(cell)).toBe(`{"a":1,"b":2,"c":3}`);
  });

  test("renders without crashing for empty table with user not logged in", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HotelTable hotels={[]} currentUser={null} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("renders without crashing for empty table for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HotelTable hotels={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("renders without crashing for empty table for admin", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HotelTable hotels={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("Has the expected column headers, content, and buttons for adminUser", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HotelTable
            hotels={hotelFixtures.threeHotels}
            currentUser={currentUser}
          />
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

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "2"
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-name`)
    ).toHaveTextContent("The Beverly Hills Hotel");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-address`)
    ).toHaveTextContent(hotelFixtures.threeHotels[0].address);
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-description`)
    ).toHaveTextContent(hotelFixtures.threeHotels[0].description);

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "3"
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-name`)
    ).toHaveTextContent("Four Seasons Resort Orlando at Walt Disney World");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-address`)
    ).toHaveTextContent(hotelFixtures.threeHotels[1].address);
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-description`)
    ).toHaveTextContent(hotelFixtures.threeHotels[1].description);

    const detailsButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Details-button`
    );
    expect(detailsButton).toBeInTheDocument();
    expect(detailsButton).toHaveClass("btn-primary");

    const editButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Edit-button`
    );
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`
    );
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");
  });
  test("Has the expected column headers, content, and buttons for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HotelTable
            hotels={hotelFixtures.threeHotels}
            currentUser={currentUser}
          />
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

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "2"
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-name`)
    ).toHaveTextContent("The Beverly Hills Hotel");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-address`)
    ).toHaveTextContent(hotelFixtures.threeHotels[0].address);
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-description`)
    ).toHaveTextContent(hotelFixtures.threeHotels[0].description);

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "3"
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-name`)
    ).toHaveTextContent("Four Seasons Resort Orlando at Walt Disney World");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-address`)
    ).toHaveTextContent(hotelFixtures.threeHotels[1].address);
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-description`)
    ).toHaveTextContent(hotelFixtures.threeHotels[1].description);

    const detailsButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Details-button`
    );
    expect(detailsButton).toBeInTheDocument();
    expect(detailsButton).toHaveClass("btn-primary");

    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  test("Has the expected column headers, content and no buttons when showButtons=false", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HotelTable hotels={hotelFixtures.threeHotels} showButtons={false} />
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

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "2"
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-name`)
    ).toHaveTextContent("The Beverly Hills Hotel");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-address`)
    ).toHaveTextContent(hotelFixtures.threeHotels[0].address);
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-description`)
    ).toHaveTextContent(hotelFixtures.threeHotels[0].description);

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "3"
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-name`)
    ).toHaveTextContent("Four Seasons Resort Orlando at Walt Disney World");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-address`)
    ).toHaveTextContent(hotelFixtures.threeHotels[1].address);
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-description`)
    ).toHaveTextContent(hotelFixtures.threeHotels[1].description);

    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Details")).not.toBeInTheDocument();
  });

  test("Edit button navigates to the edit page for admin", async () => {
    const currentUser = currentUserFixtures.adminUser;

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HotelTable
            hotels={hotelFixtures.threeHotels}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(
      await screen.findByTestId(`${testId}-cell-row-0-col-id`)
    ).toHaveTextContent("2");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-name`)
    ).toHaveTextContent("The Beverly Hills Hotel");

    const editButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Edit-button`
    );
    expect(editButton).toBeInTheDocument();

    // act - click the edit button
    fireEvent.click(editButton);

    // assert - check that the navigate function was called with the expected path
    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith("/hotels/edit/2")
    );
  });

  test("Details button navigates to the details page", async () => {
    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HotelTable hotels={hotelFixtures.threeHotels} currentUser={null} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(
      await screen.findByTestId(`${testId}-cell-row-0-col-id`)
    ).toHaveTextContent("2");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-name`)
    ).toHaveTextContent("The Beverly Hills Hotel");

    const detailsButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Details-button`
    );
    expect(detailsButton).toBeInTheDocument();

    // act - click the details button
    fireEvent.click(detailsButton);

    // assert - check that the navigate function was called with the expected path
    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith("/hotels/details/2")
    );
  });
});
