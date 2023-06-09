import React from 'react'
import Button from 'react-bootstrap/Button';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import BookTable from 'main/components/Books/BookTable';
import { Link } from 'react-router-dom';
import { useCurrentUser } from 'main/utils/currentUser';
import { useBackend } from 'main/utils/useBackend';

export default function BookIndexPage() {
  const currentUser = useCurrentUser();

  const { data: books, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/books/all"],
      { method: "GET", url: "/api/books/all" },
      []
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        <Button style={{ float: "right" }} as={Link} to="/books/create">
          Create Book
        </Button>
        <h1>Books</h1>
        <BookTable books={books} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}