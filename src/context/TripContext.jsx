import React, { createContext, useContext, useState, useEffect } from 'react';
import { sampleUserTrips } from '../data/destinationsData';

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  // Current in-progress trip builder state
  const [currentTrip, setCurrentTrip] = useState(() => {
    const saved = localStorage.getItem('tripwise_current_trip') || localStorage.getItem('traveldirect_current_trip');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved current trip', e);
      }
    }
    return {
      destination: 'manali',
      destinationName: 'Manali, Himachal Pradesh',
      startDate: '2026-05-15',
      endDate: '2026-05-19',
      durationDays: 4,
      travelers: 2,
      budget: 35000,
      interests: ['Adventure', 'Nature', 'Local Food'],
      selectedTransportation: 'train_3ac',
      selectedAccommodation: 'hotel_3star',
      selectedLocalTransport: 'local_scooter',
      selectedSightseeing: ['monument_entries', 'heritage_guide'],
      selectedActivities: ['adventure_sport'],
      selectedFoodTier: 'food_mid'
    };
  });

  // Saved trips list (persisted in localStorage + populated with initial demo trips)
  const [savedTrips, setSavedTrips] = useState(() => {
    const saved = localStorage.getItem('tripwise_saved_trips') || localStorage.getItem('traveldirect_saved_trips');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved trips', e);
      }
    }
    return sampleUserTrips;
  });

  // Mock Authentication state
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('tripwise_user') || localStorage.getItem('traveldirect_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }
    return {
      name: 'Aditya Sharma',
      email: 'aditya.sharma@example.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      isLoggedIn: true
    };
  });

  // Persist currentTrip changes
  useEffect(() => {
    localStorage.setItem('tripwise_current_trip', JSON.stringify(currentTrip));
  }, [currentTrip]);

  // Persist savedTrips changes
  useEffect(() => {
    localStorage.setItem('tripwise_saved_trips', JSON.stringify(savedTrips));
  }, [savedTrips]);

  // Persist user auth changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('tripwise_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('tripwise_user');
      localStorage.removeItem('traveldirect_user');
    }
  }, [user]);

  // Update builder fields
  const updateCurrentTrip = (fields) => {
    setCurrentTrip((prev) => ({
      ...prev,
      ...fields
    }));
  };

  // Add a newly finalized trip to savedTrips
  const saveTrip = (newTripData) => {
    const tripToSave = {
      id: `trip-${Date.now()}`,
      title: `${newTripData.destinationName.split(',')[0]} Custom Adventure`,
      destination: newTripData.destinationName,
      dates: `${newTripData.startDate} to ${newTripData.endDate}`,
      durationDays: newTripData.durationDays,
      travelers: newTripData.travelers,
      budgetTotal: newTripData.budget,
      actualCost: newTripData.calculatedTotal,
      status: 'Planned',
      coverImage: newTripData.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80',
      breakdown: newTripData.breakdown,
      savingsVsAgent: `Custom planned without agent commission`
    };

    setSavedTrips((prev) => [tripToSave, ...prev]);
    return tripToSave.id;
  };

  // Delete trip from list
  const deleteTrip = (tripId) => {
    setSavedTrips((prev) => prev.filter((t) => t.id !== tripId));
  };

  // Mock login function
  const login = (email, name = 'Aditya Sharma') => {
    const userData = {
      name,
      email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      isLoggedIn: true
    };
    setUser(userData);
    localStorage.setItem('tripwise_auth_token', 'mock_jwt_token_tripwise_2026');
    return userData;
  };

  // Mock logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('tripwise_auth_token');
    localStorage.removeItem('traveldirect_auth_token');
    localStorage.removeItem('tripwise_user');
    localStorage.removeItem('traveldirect_user');
  };

  return (
    <TripContext.Provider
      value={{
        currentTrip,
        updateCurrentTrip,
        savedTrips,
        saveTrip,
        deleteTrip,
        user,
        login,
        logout
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
