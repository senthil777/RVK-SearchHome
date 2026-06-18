// src/viewmodels/HomeViewModel.ts
import { useState, useCallback, useEffect } from 'react';
import { fetchPropertiesApi } from '../services/HomeService';
import { fetchMyListApi } from '../services/MyListService';
import { PropertyModel, ListingModel } from '../models/HomeModel';
import { ApiErrorResponse } from '../models/AuthModel';

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const useHomeViewModel = () => {
  const [properties,   setProperties]   = useState<PropertyModel[]>([]);
  const [listings,     setListings]     = useState<ListingModel[]>([]);
  const [loading,      setLoading]      = useState(false);
  const [listLoading,  setListLoading]  = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [listError,    setListError]    = useState<string | null>(null);
  const [searchQuery,  setSearchQuery]  = useState('');
  const [greeting]                      = useState(getGreeting());

  // ── Fetch featured properties (mock) ──────────────────────
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPropertiesApi();
      setProperties(data);
    } catch {
      setError('Failed to load properties.');
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch my listings from real API ───────────────────────
  const fetchMyListings = useCallback(async () => {
    setListLoading(true);
    setListError(null);
    try {
      const data = await fetchMyListApi();
      setListings(data);
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      setListError(apiError.message ?? 'Failed to load your listings.');
    } finally {
      setListLoading(false);
    }
  }, []);

  // ── Refresh all ───────────────────────────────────────────
  const refreshAll = useCallback(async () => {
    await Promise.all([fetchProperties(), fetchMyListings()]);
  }, [fetchProperties, fetchMyListings]);

  // ── Filtered properties by search ─────────────────────────
  const filteredProperties = searchQuery.trim()
    ? properties.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : properties;

  useEffect(() => {
    fetchProperties();
    fetchMyListings();
  }, []);

  return {
    properties: filteredProperties,
    listings,
    loading,
    listLoading,
    error,
    listError,
    greeting,
    searchQuery,
    setSearchQuery,
    fetchProperties,
    fetchMyListings,
    refreshAll,
  };
};