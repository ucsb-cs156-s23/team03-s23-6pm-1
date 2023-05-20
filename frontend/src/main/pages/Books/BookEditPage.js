
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import BookForm from 'main/components/Books/BookForm';
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { Navigate } from "react-router-dom";


export default function BookEditPage() {
    let { id } = useParams();

    const { data: book, error, status } =
      useBackend(
        // Stryker disable next-line all : don't test internal caching of React Query
        [`/api/books?id=${id}`],
        {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
          method: "GET",
          url: `/api/books`,
          params: {
            id
          }
        }
      );
  
  
    const objectToAxiosPutParams = (book) => ({
      url: "/api/books",
      method: "PUT",
      params: {
        id: book.id,
      },
      data: {
        title: book.title,
        author: book.author,
        genre: book.genre
      }
    });
  
    const onSuccess = (book) => {
      toast(`Book Updated - id: ${book.id} name: ${book.name}`);
    }
  
    const mutation = useBackendMutation(
      objectToAxiosPutParams,
      { onSuccess },
      // Stryker disable next-line all : hard to set up test for caching
      [`/api/books?id=${id}`]
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
          <h1>Edit Book</h1>
          {book &&
            <BookForm initialContents={book} submitAction={onSubmit} buttonLabel="Update" />
          }
        </div>
      </BasicLayout>
    )
  }
  