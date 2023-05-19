import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { Navigate } from "react-router-dom";
import HotelForm from "main/components/Hotels/HotelForm";
import { toast } from "react-toastify";
import { useBackendMutation } from "main/utils/useBackend";

export default function HotelCreatePage() {
  const objectToAxiosParams = (hotel) => ({
    url: "/api/hotels/post",
    method: "POST",
    params: {
      name: hotel.name,
      address: hotel.address,
      description: hotel.description,
    },
  });

  const onSuccess = (hotel) => {
    toast(`New hotel created - id: ${hotel.id} name: ${hotel.name}`);
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/hotels/all"]
  );

  const { isSuccess } = mutation;

  const onSubmit = async (hotel) => {
    mutation.mutate(hotel);
  };

  if (isSuccess) {
    return <Navigate to="/hotels/" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Hotel</h1>
        <HotelForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}
