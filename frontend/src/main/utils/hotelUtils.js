function setToDefault() {
  const hotelCollection = { nextId: 1, hotels: [] };
  return set(hotelCollection);
}

// get hotels from local storage
const get = () => {
  const value = localStorage.getItem("hotels");
  if (value === undefined) {
    return setToDefault();
  }
  const collection = JSON.parse(value);
  if (collection === null) {
    return setToDefault();
  }

  return collection;
};

const getById = (id) => {
  if (id === undefined) {
    return { error: "id is a required parameter" };
  }

  // convert id from possibly a string to number
  // this is better than using double equals (==)
  id = Number(id);

  const { hotels } = get();

  const found = hotels.find((r) => r.id === id);
  if (found === undefined) {
    return { error: `hotel with id ${id} not found` };
  }
  return { hotel: found };
};

// set hotels in local storage
const set = (hotelCollection) => {
  localStorage.setItem("hotels", JSON.stringify(hotelCollection));
  return hotelCollection;
};

// add a hotel to local storage
const add = (hotel) => {
  const hotelCollection = get();
  hotel = { ...hotel, id: hotelCollection.nextId };
  hotelCollection.nextId++;
  hotelCollection.hotels.push(hotel);
  set(hotelCollection);
  return hotel;
};

// update a hotel in local storage
const update = (hotel) => {
  if (hotel === undefined) {
    return { error: "hotel is a required parameter" };
  }

  const hotelCollection = get();
  const { hotels } = hotelCollection;

  const index = hotels.findIndex((r) => r.id === hotel.id);
  if (index === -1) {
    return { error: `hotel with id ${hotel.id} not found` };
  }

  hotels[index] = hotel;
  set(hotelCollection);
  return { hotelCollection };
};

// delete a hotel from local storage
const del = (id) => {
  if (id === undefined) {
    return { error: "id is a required parameter" };
  }

  const hotelCollection = get();
  const { hotels } = hotelCollection;

  const index = hotels.findIndex((r) => r.id === id);
  if (index === -1) {
    return { error: `hotel with id ${id} not found` };
  }

  hotels.splice(index, 1);
  set(hotelCollection);
  return { hotelCollection };
};

const hotelUtils = {
  get,
  getById,
  add,
  update,
  del,
};

export { hotelUtils };
