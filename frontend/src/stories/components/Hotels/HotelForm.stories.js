import React from "react";

import HotelForm from "main/components/Hotels/HotelForm";
import { hotelFixtures } from "fixtures/hotelFixtures";

export default {
  title: "components/Hotels/HotelForm",
  component: HotelForm,
};

const Template = (args) => {
  return <HotelForm {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  submitText: "Create",
  submitAction: () => {
    console.log("Submit was clicked");
  },
};

export const Show = Template.bind({});

Show.args = {
  Hotel: hotelFixtures.oneRestaurant,
  submitText: "",
  submitAction: () => {},
};
