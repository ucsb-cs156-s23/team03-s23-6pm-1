import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { Navigate } from "react-router-dom";
import BookForm from "main/components/Books/BookForm";
import { toast } from "react-toastify";
import { useBackendMutation } from "main/utils/useBackend";

export default function BookCreatePage() {
  const objectToAxiosParams = (book) => ({
    url: "/api/books/post",
    method: "POST",
    params: {
      name: book.name,
      author: book.author,
      genre: book.genre
    }
  });

  const onSuccess = (book) => {
    toast(`New book Created - id: ${book.id} name: ${book.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/books/all"]
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/books/" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Book</h1>
        <BookForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}
