import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseURL } from "../../../utils/baseURL";

const reviewsApi = createApi({
  reducerPath: 'reviewsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseURL()}/api/reviews`,
    credentials: 'include',
  }),
  tagTypes: ['Reviews'],
  endpoints: (builder) => ({
    postReview: builder.mutation({
      query: (reviewData) => ({
        url: '/post-review',
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: (result, error, {postId}) => [{ type: 'Reviews', id: postId }],
    }),

    getReviewsCount: builder.query({
      query: () => '/total-reviews',
    }),

    getReviewsByUserId: builder.query({
      query: (userId) => `/${userId}`,
      providesTags: (result) => result ? [{type: 'Reviews', id: result[0]?.email}] : [],
    }),
  }),
});

export const { usePostReviewMutation,
  useGetReviewsCountQuery, useGetReviewsByUserIdQuery } = reviewsApi;
export default reviewsApi;