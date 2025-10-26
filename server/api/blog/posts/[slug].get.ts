import { createError, defineEventHandler, getRouterParam } from "h3";
import { findPostBySlug } from "~/server/database/blog/repository";
import type { BlogPostResponse } from "~/types/blog";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Slug is required." });
  }

  const post = await findPostBySlug(slug);

  if (!post) {
    throw createError({ statusCode: 404, statusMessage: "Post not found." });
  }

  return {
    data: post,
  } satisfies BlogPostResponse;
});
