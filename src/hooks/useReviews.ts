import { useState, useEffect, useCallback, useMemo } from 'react';
import { Review, ReviewFormData, ReviewStatus } from '../types';
import { dataStore } from '../lib/dataStore';

export function useReviews(filterParam: ReviewStatus | 'all' | boolean = 'approved') {
  const [reviews, setReviews] = useState<Review[]>(() =>
    dataStore.getReviews(filterParam)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncFromStore = useCallback(() => {
    setReviews(dataStore.getReviews(filterParam));
  }, [filterParam]);

  useEffect(() => {
    syncFromStore();
    const unsubscribe = dataStore.subscribe(() => {
      syncFromStore();
    });
    return unsubscribe;
  }, [syncFromStore]);

  const submitReview = async (formData: ReviewFormData) => {
    try {
      return await dataStore.submitReview(formData);
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateReviewStatus = async (
    reviewId: string,
    status: ReviewStatus,
    featured?: boolean
  ) => {
    try {
      return await dataStore.updateReviewStatus(reviewId, status, featured);
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const approveReview = (reviewId: string) => updateReviewStatus(reviewId, 'approved');
  const rejectReview = (reviewId: string) => updateReviewStatus(reviewId, 'rejected');

  const deleteReview = async (reviewId: string) => {
    try {
      return await dataStore.deleteReview(reviewId);
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const refreshReviews = async () => {
    setLoading(true);
    await dataStore.fetchFromSupabase();
    syncFromStore();
    setLoading(false);
  };

  // Calculated metrics
  const totalReviews = reviews.length;
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 5.0;
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
  }, [reviews]);

  const ratingCounts = useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      const val = Math.min(5, Math.max(1, Math.round(r.rating)));
      counts[val] = (counts[val] || 0) + 1;
    });
    return counts;
  }, [reviews]);

  const pendingReviewsCount = useMemo(() => {
    return reviews.filter((r) => r.status === 'pending').length;
  }, [reviews]);

  return {
    reviews,
    loading,
    error,
    refreshReviews,
    submitReview,
    updateReviewStatus,
    approveReview,
    rejectReview,
    deleteReview,
    averageRating,
    totalReviews,
    ratingCounts,
    pendingReviewsCount,
  };
}

