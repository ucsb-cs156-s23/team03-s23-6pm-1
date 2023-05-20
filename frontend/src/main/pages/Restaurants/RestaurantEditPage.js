import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import {Navigate, useParams} from "react-router-dom";
import {restaurantUtils} from 'main/utils/restaurantUtils';
import RestaurantForm from 'main/components/Restaurants/RestaurantForm';
import {toast} from "react-toastify";
import {useBackend, useBackendMutation} from "../../utils/useBackend";


export default function RestaurantEditPage() {
  let {id} = useParams();

  const {data: restaurant, error, status} =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/restaurants?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/restaurants`,
        params: {id}
      }
    );

  const objectToAxiosPutParams = (restaurant) => ({
    url: "/api/restaurants",
    method: "PUT",
    params: {
      id: restaurant.id,
    },
    data: {
      name: restaurant.name,
      address: restaurant.address,
      description: restaurant.description,
    }
  });

  const onSuccess = (restaurant) => {
    toast(`Restaurant Updated - id: ${restaurant.id} name: ${restaurant.name}`);
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    {onSuccess},
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/restaurants?id=${id}`]
  );

  const onSubmit = async (restaurant) => {
    mutation.mutate(restaurant);
  };

  if (mutation.isSuccess) {
    return <Navigate to="/restaurants"/>
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Restaurant</h1>
        {
          restaurant &&
          <RestaurantForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={restaurant}/>
        }
      </div>
    </BasicLayout>
  );
}