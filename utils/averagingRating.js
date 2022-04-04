exports.getAverageRating = (reviews, totalReviews) => {
  if (totalReviews === 0) return 0;
  const result = reviews.reduce((totalCount, review) => {
    return totalCount + parseInt(review.rating);
  }, 0);
  return result / totalReviews;
};
