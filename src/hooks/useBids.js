'use client';

import { useState, useEffect } from 'react';

export function useBids(productId) {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBids = async () => {
    if (!productId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/products/${productId}/bids`);
      const data = await res.json();
      if (data.bids) {
        setBids(data.bids);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBids();
  }, [productId]);

  return { bids, loading, error, refetch: fetchBids };
}
