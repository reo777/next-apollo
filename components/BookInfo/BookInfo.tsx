import React from 'react';
import {useLazyQuery, useMutation, useQuery} from '@apollo/react-hooks';
import {gql} from 'apollo-boost';
import faker from 'faker';

// GraphQLに取得したい値のクエリを渡す
// bookオブジェクトに対して要求
const GET_BOOK_DETAILS = gql`
  query {
    book {
      name
      author
    }
    user {
      name
      age
    }
  }
`;

const SET_BOOK_DETAILS = gql`
  mutation UpdateBook($name: String!, $author: String!) {
    updateBook(name: $name, author: $author) {
      name
      author
    }
  }
`;

export const BookInfo = () => {
  // useQueryはレンダリング毎に実行されるため、useLazyQueryで任意のタイミングで呼び出すようにする
  const [getBook, {data, loading, error}] = useLazyQuery(GET_BOOK_DETAILS);
  const [author, setAuthor] = React.useState(faker.name.findName());

  const updateCache = (cache, {data: {updateBook}}) => {
    cache.readQuery({
      query: GET_BOOK_DETAILS,
    });
    cache.writeQuery({
      query: GET_BOOK_DETAILS,
      data: {book: updateBook},
    });
  };
  const [updateBook] = useMutation(SET_BOOK_DETAILS, {update: updateCache});

  React.useEffect(() => {
    getBook();
  }, []);

  if (loading) return <p>loading...</p>;
  if (error) return <p>Error :(</p>;

  const updateBookDetails = () => {
    console.log('----->>> Update Book Details');
    getBook();
    setAuthor(faker.name.findName());
    updateBook({
      variables: {name: 'A Spicy Sausage', author: author},
    });
  };

  return (
    <div>
      {data && data.book && (
        <>
          <p>
            {data.book.name} - {data.book.author}
          </p>
          <p>
            {data.user.name} - {data.user.age}
          </p>
        </>
      )}
      <button onClick={updateBookDetails}>Update Book</button>
    </div>
  );
};
