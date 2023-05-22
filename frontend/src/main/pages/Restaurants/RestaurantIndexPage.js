import React from 'react';
import Button from 'react-bootstrap/Button';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RestaurantTable from 'main/components/Restaurants/RestaurantTable';
import {Link} from 'react-router-dom';
import {useBackend} from "../../utils/useBackend";
import {useCurrentUser} from "../../utils/currentUser";

export default function RestaurantIndexPage() {

  // Stryker disable all : don't test internal caching of React Query
  const {data: restaurants} =
    useBackend(
      ["/api/restaurants/all"],
      {method: "GET", url: "/api/restaurants/all"},
      []
    );
  // Stryker enable all

  const currentUser = useCurrentUser();

  return (
    <BasicLayout>
      <div className="pt-2">
        <Button style={{float: "right"}} as={Link} to="/restaurants/create">
          Create Restaurant
        </Button>
        <h1>Restaurants</h1>
        <RestaurantTable restaurants={restaurants} currentUser={currentUser}/>
      </div>
    </BasicLayout>
  );
}