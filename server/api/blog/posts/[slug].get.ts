import { createError, defineEventHandler, getRouterParam } from "h3";
import { findBlogPostBySlug } from "~/server/database/blog/posts";
import type { BlogPostResponse } from "~/types/blog";

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Slug is required." });
  }

  const post = findBlogPostBySlug(slug);

  if (!post) {
    throw createError({ statusCode: 404, statusMessage: "Post not found." });
  }

  return {
    data: post,
  } satisfies BlogPostResponse;
});
