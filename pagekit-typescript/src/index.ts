export { Pagekit, DEFAULT_BASE_URL } from "./client";
export type { PagekitOptions } from "./client";

export { PagekitError } from "./errors";

export type { HttpClient, HttpMethod, RequestOptions } from "./http";

export { AuthorsResource } from "./resources/authors";
export { CategoriesResource } from "./resources/categories";
export { MediaResource } from "./resources/media";
export { PostsResource } from "./resources/posts";
export { TagsResource } from "./resources/tags";

export type {
  Author,
  AuthorCreateInput,
  AuthorListParams,
  AuthorUpdateInput,
  Category,
  CategoryListParams,
  Media,
  MediaCreateInput,
  MediaListParams,
  Paginated,
  Pagination,
  Post,
  PostCreateInput,
  PostListParams,
  PostStatus,
  PostUpdateInput,
  Seo,
  Tag,
  TagListParams,
} from "./types";
