import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { ParsedUrlQuery } from "querystring";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const SinglePage: NextPage<Props> = (props) => {
  return (
    <div>
      <h1>{props.post.title}</h1>
      <p>{props.post.content}</p>
    </div>
  );
};

interface IStaticProps extends ParsedUrlQuery {
  postSlug: string;
}

type Post = {
  post: {
    content: string;
    title: string;
  };
};

export const getStaticProps: GetStaticProps<Post> = (context) => {
  console.log(context);
  const { params } = context;
  const { postSlug } = params as IStaticProps;

  const filePathToRead = path.join(process.cwd(), "posts/" + postSlug + ".md");
  const fileContent = fs.readFileSync(filePathToRead, { encoding: "utf-8" });
  const { content, data } = matter(fileContent);
  return {
    props: {
      post: {
        content,
        title: data.title,
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  const dirPathToRead = path.join(process.cwd(), "posts");
  const dirs = fs.readdirSync(dirPathToRead);
  const paths = dirs.map((fileName) => {
    const filePathToRead = path.join(dirPathToRead, fileName);
    console.log(filePathToRead);
    const fileContent = fs.readFileSync(filePathToRead, { encoding: "utf-8" });
    return { params: { postSlug: matter(fileContent).data.slug } };
  });

  return {
    paths,
    fallback: false,
  };
};

export default SinglePage;
