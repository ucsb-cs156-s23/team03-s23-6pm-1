import {
  onDeleteSuccess,
  cellToAxiosParamsDelete,
} from "main/utils/hotelUtils";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

describe("hotelUtils tests", () => {
  test("onDeleteSuccess puts message in console.log and in a toast", () => {
    const restoreConsole = mockConsole();

    onDeleteSuccess("abc");

    expect(mockToast).toHaveBeenCalledWith("abc");
    expect(console.log).toHaveBeenCalledWith(expect.stringMatching("abc"));

    restoreConsole();
  });

  test("cellToAxiosParamsDelete returns correct params", () => {
    const cell = { row: { values: { id: 17 } } };

    const result = cellToAxiosParamsDelete(cell);

    expect(result).toEqual({
      url: "/api/hotels",
      method: "DELETE",
      params: { id: 17 },
    });
  });
});
