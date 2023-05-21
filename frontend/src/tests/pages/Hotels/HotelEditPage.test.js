import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";
import AxiosMockAdapter from "axios-mock-adapter";
import axios from "axios";
import { apiCurrentUserFixtures } from "../../../fixtures/currentUserFixtures";
import { systemInfoFixtures } from "../../../fixtures/systemInfoFixtures";
import HotelEditPage from "../../../main/pages/Hotels/HotelEditPage";

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
            name: "Grandest Hotel",
            description: "Fantastic",
            address: "123 State",
          },
        };
      },
    },
  };
});

jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    useParams: () => ({
      id: 3,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("HotelEditPage tests", () => {
  const queryClient = new QueryClient();

  describe("when the backend doesn't return", () => {
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
      axiosMock.onGet("/api/hotels", { params: { id: 3 } }).timeout();
    });
    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      const { getByText, queryByTestId, findByText } = render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HotelEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );
      await findByText("Edit Hotel");
      expect(queryByTestId("HotelForm-name")).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("when the backend is working normally", () => {
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
        description: "Fantastic",
        address: "123 State",
      });
      axiosMock.onPut("/api/hotels").reply(200, {
        id: "3",
        name: "Best Hotel",
        description: "great place",
        address: "321 State",
      });
    });
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

    test("Is populated with the data provide", async () => {
      const { getByTestId, findByTestId } = render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HotelEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      await findByTestId("HotelForm-name");

      const idField = getByTestId("HotelForm-id");
      const nameField = getByTestId("HotelForm-name");
      const descriptionField = getByTestId("HotelForm-description");
      const addressField = getByTestId("HotelForm-address");

      expect(idField).toHaveValue("3");
      expect(nameField).toHaveValue("Grand Hotel");
      expect(descriptionField).toHaveValue("Fantastic");
      expect(addressField).toHaveValue("123 State");
    });

    test("changes when you click Update", async () => {
      const { getByTestId, findByTestId } = render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HotelEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      await findByTestId("HotelForm-name");

      await findByTestId("HotelForm-name");

      const idField = getByTestId("HotelForm-id");
      const nameField = getByTestId("HotelForm-name");
      const descriptionField = getByTestId("HotelForm-description");
      const addressField = getByTestId("HotelForm-address");

      const submitButton = getByTestId("HotelForm-submit");

      expect(idField).toHaveValue("3");
      expect(nameField).toHaveValue("Grand Hotel");
      expect(descriptionField).toHaveValue("Fantastic");
      expect(addressField).toHaveValue("123 State");

      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(nameField, { target: { value: "Best Hotel" } });
      fireEvent.change(descriptionField, {
        target: { value: "great place" },
      });
      fireEvent.change(addressField, { target: { value: "321 State" } });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toHaveBeenCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Hotel Updated - id: 3 name: Best Hotel"
      );
      expect(mockNavigate).toBeCalledWith({ to: "/hotels" });

      expect(axiosMock.history.put.length).toBe(1);
      expect(axiosMock.history.put[0].params).toEqual({ id: 3 });

      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          name: "Best Hotel",
          address: "321 State",
          description: "great place",
        })
      );
    });
  });
});
