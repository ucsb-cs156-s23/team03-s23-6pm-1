import { hotelFixtures } from "../../fixtures/hotelFixtures";
import { hotelUtils } from "../../main/utils/hotelUtils";

describe("hotelUtils tests", () => {
  const createGetItemMock = (returnValue) => (key) => {
    if (key !== "hotels") {
      throw new Error("Unexpected key: " + key);
    }
    return JSON.stringify(returnValue);
  };

  let getItemSpy, setItemSpy;

  beforeEach(() => {
    getItemSpy = jest.spyOn(Storage.prototype, "getItem");
    setItemSpy = jest.spyOn(Storage.prototype, "setItem");

    setItemSpy.mockImplementation(() => null);
  });

  describe("get", () => {
    test.each([null, undefined])(
      "When hotels is %p in local storage, should set to empty list",
      (value) => {
        getItemSpy.mockImplementation(createGetItemMock(value));

        const result = hotelUtils.get();

        const expected = { nextId: 1, hotels: [] };
        expect(result).toEqual(expected);

        expect(setItemSpy).toHaveBeenCalledWith(
          "hotels",
          JSON.stringify(expected)
        );
      }
    );

    test("When hotels is [] in local storage, should return []", () => {
      getItemSpy.mockImplementation(
        createGetItemMock({ nextId: 1, hotels: [] })
      );

      const result = hotelUtils.get();

      const expected = { nextId: 1, hotels: [] };
      expect(result).toEqual(expected);

      expect(setItemSpy).not.toHaveBeenCalled();
    });

    test("When hotels is JSON of three hotels, should return that JSON", () => {
      const hotels = hotelFixtures.threeHotels;
      const mockCollection = { nextId: 10, hotels };
      getItemSpy.mockImplementation(createGetItemMock(mockCollection));

      const result = hotelUtils.get();

      expect(result).toEqual(mockCollection);
      expect(setItemSpy).not.toHaveBeenCalled();
    });
  });

  describe("getById", () => {
    test("Check that getting a hotel by id works", () => {
      // arrange
      const hotels = hotelFixtures.threeHotels;
      getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, hotels }));

      const idToGet = hotels[1].id;

      // act
      const result = hotelUtils.getById(idToGet);

      // assert
      const expected = { hotel: hotels[1] };
      expect(result).toEqual(expected);
    });

    test("Check that getting a hotel by id works when id is a string", () => {
      // arrange
      const hotels = hotelFixtures.threeHotels;
      getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, hotels }));

      const idToGet = hotels[1].id;

      // act
      const result = hotelUtils.getById(idToGet.toString());

      // assert
      const expected = { hotel: hotels[1] };
      expect(result).toEqual(expected);
    });

    test("Check that getting a non-existing hotel returns an error", () => {
      // arrange
      const threeHotels = hotelFixtures.threeHotels;
      getItemSpy.mockImplementation(
        createGetItemMock({ nextId: 5, hotels: threeHotels })
      );

      // act
      const result = hotelUtils.getById(99);

      // assert
      const expectedError = `hotel with id 99 not found`;
      expect(result).toEqual({ error: expectedError });
    });

    test("Check that an error is returned when id not passed", () => {
      // arrange
      const threeHotels = hotelFixtures.threeHotels;
      getItemSpy.mockImplementation(
        createGetItemMock({ nextId: 5, hotels: threeHotels })
      );

      // act
      const result = hotelUtils.getById();

      // assert
      const expectedError = `id is a required parameter`;
      expect(result).toEqual({ error: expectedError });
    });
  });
  describe("add", () => {
    test("Starting from [], check that adding one hotel works", () => {
      // arrange
      const hotel = hotelFixtures.oneHotel[0];
      getItemSpy.mockImplementation(
        createGetItemMock({ nextId: 1, hotels: [] })
      );

      // act
      const result = hotelUtils.add(hotel);

      // assert
      expect(result).toEqual(hotel);
      expect(setItemSpy).toHaveBeenCalledWith(
        "hotels",
        JSON.stringify({ nextId: 2, hotels: hotelFixtures.oneHotel })
      );
    });
  });

  describe("update", () => {
    test("Check that updating an existing hotel works", () => {
      // arrange
      const threeHotels = hotelFixtures.threeHotels;
      const updatedHotel = {
        ...threeHotels[0],
        name: "Updated Name",
      };
      const threeHotelsUpdated = [updatedHotel, threeHotels[1], threeHotels[2]];

      getItemSpy.mockImplementation(
        createGetItemMock({ nextId: 5, hotels: threeHotels })
      );

      // act
      const result = hotelUtils.update(updatedHotel);

      // assert
      const expected = {
        hotelCollection: { nextId: 5, hotels: threeHotelsUpdated },
      };
      expect(result).toEqual(expected);
      expect(setItemSpy).toHaveBeenCalledWith(
        "hotels",
        JSON.stringify(expected.hotelCollection)
      );
    });
    test("Check that updating an non-existing hotel returns an error", () => {
      // arrange
      const threeHotels = hotelFixtures.threeHotels;

      getItemSpy.mockImplementation(
        createGetItemMock({ nextId: 5, hotels: threeHotels })
      );

      const updatedHotel = {
        id: 99,
        name: "Fake Name",
        description: "Fake Description",
      };

      // act
      const result = hotelUtils.update(updatedHotel);

      // assert
      const expectedError = `hotel with id 99 not found`;
      expect(result).toEqual({ error: expectedError });
      expect(setItemSpy).not.toHaveBeenCalled();
    });

    test("Check that an error is returned when hotel not passed", () => {
      // arrange
      const threeHotels = hotelFixtures.threeHotels;
      getItemSpy.mockImplementation(
        createGetItemMock({ nextId: 5, hotels: threeHotels })
      );

      // act
      const result = hotelUtils.update();

      // assert
      const expectedError = `hotel is a required parameter`;
      expect(result).toEqual({ error: expectedError });
    });
  });

  describe("del", () => {
    test("Check that deleting a hotel by id works", () => {
      // arrange
      const threeHotels = hotelFixtures.threeHotels;
      const idToDelete = threeHotels[1].id;
      const threeHotelsUpdated = [threeHotels[0], threeHotels[2]];

      getItemSpy.mockImplementation(
        createGetItemMock({ nextId: 5, hotels: threeHotels })
      );

      // act
      const result = hotelUtils.del(idToDelete);

      // assert

      const expected = {
        hotelCollection: { nextId: 5, hotels: threeHotelsUpdated },
      };
      expect(result).toEqual(expected);
      expect(setItemSpy).toHaveBeenCalledWith(
        "hotels",
        JSON.stringify(expected.hotelCollection)
      );
    });
    test("Check that deleting a non-existing hotel returns an error", () => {
      // arrange
      const threeHotels = hotelFixtures.threeHotels;

      getItemSpy.mockImplementation(
        createGetItemMock({ nextId: 5, hotels: threeHotels })
      );

      // act
      const result = hotelUtils.del(99);

      // assert
      const expectedError = `hotel with id 99 not found`;
      expect(result).toEqual({ error: expectedError });
      expect(setItemSpy).not.toHaveBeenCalled();
    });
    test("Check that an error is returned when id not passed", () => {
      // arrange
      const threeHotels = hotelFixtures.threeHotels;

      getItemSpy.mockImplementation(
        createGetItemMock({ nextId: 5, hotels: threeHotels })
      );

      // act
      const result = hotelUtils.del();

      // assert
      const expectedError = `id is a required parameter`;
      expect(result).toEqual({ error: expectedError });
    });
  });
});
