import { useState, useEffect, useCallback } from 'react';
import { fetchPropertiesApi } from '../services/HomeService';
import { PropertyModel } from '../models/HomeModel';

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const useHomeViewModel = () => {
  const [properties, setProperties] = useState<PropertyModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const greeting = getGreeting();

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPropertiesApi();
      setProperties(data);
    } catch {
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter properties by search query
  const filteredProperties = properties.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.address.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return {
    properties: filteredProperties,
    loading,
    error,
    greeting,
    searchQuery,
    setSearchQuery,
    fetchProperties,
  };
};