import React from "react";
import HotelTable from "main/components/Hotels/HotelTable";
import { hotelFixtures } from "fixtures/hotelFixtures";

export default {
  title: "components/Hotels/HotelTable",
  component: HotelTable,
};

const Template = (args) => {
  return <HotelTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  hotels: [],
};

export const ThreeSubjectsNoButtons = Template.bind({});

ThreeSubjectsNoButtons.args = {
  hotels: hotelFixtures.threeHotels,
  showButtons: false,
};

export const ThreeSubjectsWithButtons = Template.bind({});
ThreeSubjectsWithButtons.args = {
  hotels: hotelFixtures.threeHotels,
  showButtons: true,
};
