import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import HotelForm from "main/components/Hotels/HotelForm";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useBackend, useBackendMutation } from "main/utils/useBackend";

export default function HotelEditPage() {
  let { id } = useParams();

  const {
    data: hotel,
    error,
    status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/hotels?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/hotels`,
      params: {
        id,
      },
    }
  );

  const objectToAxiosPutParams = (hotel) => ({
    url: "/api/hotels",
    method: "PUT",
    params: {
      id: hotel.id,
    },
    data: {
      name: hotel.name,
      address: hotel.address,
      description: hotel.description,
    },
  });

  const onSuccess = (hotel) => {
    toast(`Hotel Updated - id: ${hotel.id} name: ${hotel.name}`);
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/hotels?id=${id}`]
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess) {
    return <Navigate to="/hotels" />;
  }
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Hotel</h1>
        {hotel && (
          <HotelForm
            submitAction={onSubmit}
            buttonLabel={"Update"}
            initialContents={hotel}
          />
        )}
      </div>
    </BasicLayout>
  );
}
