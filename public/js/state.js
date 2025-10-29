/**
 * State Management Module
 * Handles application state with localStorage persistence
 */

const state = (() => {
  const STORAGE_KEY = 'detectionToDirection';

  // Default state structure
  const defaultState = {
    user: null,
    children: [],
    screenings: [],
    savedTherapists: [],
    settings: {
      language: 'en',
      notifications: true
    }
  };

  // Load state from localStorage
  function loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultState, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Error loading state:', error);
    }
    return { ...defaultState };
  }

  // Save state to localStorage
  function saveState(newState) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }

  // Current state
  let currentState = loadState();

  // Public API
  return {
    // User methods
    getUser() {
      return currentState.user;
    },

    setUser(user) {
      currentState.user = user;
      saveState(currentState);
    },

    isAuthenticated() {
      return currentState.user !== null;
    },

    logout() {
      currentState.user = null;
      saveState(currentState);
      window.location.href = '/';
    },

    // Children methods
    getChildren() {
      return currentState.children || [];
    },

    addChild(child) {
      if (!currentState.children) {
        currentState.children = [];
      }
      const newChild = {
        id: Date.now().toString(),
        ...child,
        createdAt: new Date().toISOString()
      };
      currentState.children.push(newChild);
      saveState(currentState);
      return newChild;
    },

    updateChild(id, updates) {
      const index = currentState.children.findIndex(c => c.id === id);
      if (index !== -1) {
        currentState.children[index] = {
          ...currentState.children[index],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        saveState(currentState);
        return currentState.children[index];
      }
      return null;
    },

    deleteChild(id) {
      currentState.children = currentState.children.filter(c => c.id !== id);
      // Also delete related screenings
      currentState.screenings = currentState.screenings.filter(s => s.childId !== id);
      saveState(currentState);
    },

    getChildById(id) {
      return currentState.children.find(c => c.id === id);
    },

    // Screening methods
    getScreenings() {
      return currentState.screenings || [];
    },

    getScreeningsByChild(childId) {
      return (currentState.screenings || []).filter(s => s.childId === childId);
    },

    addScreening(screening) {
      if (!currentState.screenings) {
        currentState.screenings = [];
      }
      const newScreening = {
        id: Date.now().toString(),
        ...screening,
        createdAt: new Date().toISOString()
      };
      currentState.screenings.push(newScreening);
      saveState(currentState);
      return newScreening;
    },

    getScreeningById(id) {
      return currentState.screenings.find(s => s.id === id);
    },

    // In-progress screening (temporary, not saved)
    _inProgressScreening: null,

    saveInProgressScreening(data) {
      this._inProgressScreening = data;
      // Optionally save to sessionStorage for page refresh persistence
      try {
        sessionStorage.setItem('inProgressScreening', JSON.stringify(data));
      } catch (error) {
        console.error('Error saving in-progress screening:', error);
      }
    },

    getInProgressScreening() {
      if (this._inProgressScreening) {
        return this._inProgressScreening;
      }
      // Try to restore from sessionStorage
      try {
        const stored = sessionStorage.getItem('inProgressScreening');
        if (stored) {
          this._inProgressScreening = JSON.parse(stored);
          return this._inProgressScreening;
        }
      } catch (error) {
        console.error('Error loading in-progress screening:', error);
      }
      return null;
    },

    clearInProgressScreening() {
      this._inProgressScreening = null;
      try {
        sessionStorage.removeItem('inProgressScreening');
      } catch (error) {
        console.error('Error clearing in-progress screening:', error);
      }
    },

    // Saved therapists methods
    getSavedTherapists() {
      return currentState.savedTherapists || [];
    },

    saveTherapist(therapist) {
      if (!currentState.savedTherapists) {
        currentState.savedTherapists = [];
      }
      // Check if already saved
      const exists = currentState.savedTherapists.some(t => t.id === therapist.id);
      if (!exists) {
        currentState.savedTherapists.push({
          ...therapist,
          savedAt: new Date().toISOString()
        });
        saveState(currentState);
        return true;
      }
      return false;
    },

    unsaveTherapist(therapistId) {
      currentState.savedTherapists = currentState.savedTherapists.filter(t => t.id !== therapistId);
      saveState(currentState);
    },

    isTherapistSaved(therapistId) {
      return currentState.savedTherapists.some(t => t.id === therapistId);
    },

    // Settings methods
    getSettings() {
      return currentState.settings || defaultState.settings;
    },

    updateSettings(updates) {
      currentState.settings = {
        ...currentState.settings,
        ...updates
      };
      saveState(currentState);
    },

    getLanguage() {
      return currentState.settings?.language || 'en';
    },

    setLanguage(lang) {
      if (!currentState.settings) {
        currentState.settings = { ...defaultState.settings };
      }
      currentState.settings.language = lang;
      saveState(currentState);
    },

    // Export/Import for data portability
    exportData() {
      return JSON.stringify(currentState, null, 2);
    },

    importData(jsonString) {
      try {
        const imported = JSON.parse(jsonString);
        currentState = { ...defaultState, ...imported };
        saveState(currentState);
        return true;
      } catch (error) {
        console.error('Error importing data:', error);
        return false;
      }
    },

    // Clear all data
    clearAll() {
      currentState = { ...defaultState };
      saveState(currentState);
      localStorage.removeItem(STORAGE_KEY);
    },

    // Get entire state (for debugging)
    getState() {
      return { ...currentState };
    }
  };
})();

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = state;
}
