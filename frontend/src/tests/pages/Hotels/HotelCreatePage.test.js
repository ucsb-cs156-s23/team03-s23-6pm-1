import { render, waitFor, fireEvent } from "@testing-library/react";
import HotelCreatePage from "main/pages/Hotels/HotelCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("HotelCreatePage tests", () => {
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
  });

  test("renders without crashing", () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HotelCreatePage />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("when you fill in the form and hit submit, it makes a request to the backend", async () => {
    const queryClient = new QueryClient();
    const hotel = {
      id: 17,
      name: "Grand Hotel",
      description: "best place!",
      address: "123 State",
    };

    axiosMock.onPost("/api/hotels/post").reply(202, hotel);

    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HotelCreatePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(getByTestId("HotelForm-address")).toBeInTheDocument();
    });

    const addressField = getByTestId("HotelForm-address");
    const nameField = getByTestId("HotelForm-name");
    const descriptionField = getByTestId("HotelForm-description");
    const submitButton = getByTestId("HotelForm-submit");

    fireEvent.change(addressField, { target: { value: "123 State" } });
    fireEvent.change(nameField, { target: { value: "Grand Hotel" } });
    fireEvent.change(descriptionField, { target: { value: "best place!" } });

    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      name: "Grand Hotel",
      description: "best place!",
      address: "123 State",
    });

    expect(mockToast).toBeCalledWith(
      "New hotel created - id: 17 name: Grand Hotel"
    );
    expect(mockNavigate).toBeCalledWith({ to: "/hotels/" });
  });
});
