import {ApolloServer, gql} from 'apollo-server-micro';

// Schema定義
// クエリを叩いた時に、どんな値を返すのか型付きで定義する
const typeDefs = gql`
  type Book {
    name: String
    author: String
  }
  # 取得処理 => Query
  type Query {
    book: Book
  }
  # 作成・更新処理 => Mutation
  type Mutation {
    # !はnullを許可しない
    updateBook(name: String!, author: String!): Book
  }
`;

let book = {
  name: 'The Large Hungarian Sausage',
  author: 'Ben Grunfeld',
};

// データの取得方法と更新方法をApolloに伝える
const resolvers = {
  Query: {
    // bookというクエリが投げられたら、bookを返す
    book: () => book,
  },
  Mutation: {
    // updateBookというクエリが返されたら、下記の処理を実行する
    updateBook: (root, args) => {
      book.name = args.name;
      book.author = args.author;
      return book;
    },
  },
};

// ApolloServerを初期化
const server = new ApolloServer({typeDefs, resolvers});
const handler = server.createHandler({path: '/api/graphql-data'});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
