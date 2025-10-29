/**
 * Therapist Finder Module
 * Search, filter, and display therapist centers
 */

const therapistFinder = (() => {
  let therapists = [];
  let filteredTherapists = [];

  /**
   * Load therapist data
   * @returns {Promise<Array>} Array of therapists
   */
  async function loadTherapists() {
    try {
      const response = await fetch('/data/therapists.json');
      therapists = await response.json();
      filteredTherapists = [...therapists];
      return therapists;
    } catch (error) {
      console.error('Error loading therapists:', error);
      return [];
    }
  }

  /**
   * Search therapists by text query
   * @param {string} query - Search query
   * @returns {Array} Filtered therapists
   */
  function search(query) {
    if (!query || query.trim() === '') {
      filteredTherapists = [...therapists];
      return filteredTherapists;
    }

    const lowerQuery = query.toLowerCase().trim();

    filteredTherapists = therapists.filter(therapist => {
      return (
        therapist.name.toLowerCase().includes(lowerQuery) ||
        therapist.city.toLowerCase().includes(lowerQuery) ||
        therapist.state.toLowerCase().includes(lowerQuery) ||
        therapist.address.toLowerCase().includes(lowerQuery) ||
        therapist.services.some(service => service.toLowerCase().includes(lowerQuery))
      );
    });

    return filteredTherapists;
  }

  /**
   * Filter therapists by disorder specialization
   * @param {string} disorder - Disorder type (ASD, ADHD, Dyslexia)
   * @returns {Array} Filtered therapists
   */
  function filterByDisorder(disorder) {
    if (!disorder || disorder === 'all') {
      filteredTherapists = [...therapists];
      return filteredTherapists;
    }

    filteredTherapists = therapists.filter(therapist =>
      therapist.specializations.includes(disorder)
    );

    return filteredTherapists;
  }

  /**
   * Filter therapists by state
   * @param {string} state - State name
   * @returns {Array} Filtered therapists
   */
  function filterByState(state) {
    if (!state || state === 'all') {
      filteredTherapists = [...therapists];
      return filteredTherapists;
    }

    filteredTherapists = therapists.filter(therapist =>
      therapist.state.toLowerCase() === state.toLowerCase()
    );

    return filteredTherapists;
  }

  /**
   * Apply multiple filters
   * @param {object} filters - Filter options
   * @returns {Array} Filtered therapists
   */
  function applyFilters(filters = {}) {
    filteredTherapists = [...therapists];

    // Filter by disorder
    if (filters.disorder && filters.disorder !== 'all') {
      filteredTherapists = filteredTherapists.filter(therapist =>
        therapist.specializations.includes(filters.disorder)
      );
    }

    // Filter by state
    if (filters.state && filters.state !== 'all') {
      filteredTherapists = filteredTherapists.filter(therapist =>
        therapist.state.toLowerCase() === filters.state.toLowerCase()
      );
    }

    // Search by text
    if (filters.query && filters.query.trim() !== '') {
      const lowerQuery = filters.query.toLowerCase().trim();
      filteredTherapists = filteredTherapists.filter(therapist =>
        therapist.name.toLowerCase().includes(lowerQuery) ||
        therapist.city.toLowerCase().includes(lowerQuery) ||
        therapist.address.toLowerCase().includes(lowerQuery) ||
        therapist.services.some(service => service.toLowerCase().includes(lowerQuery))
      );
    }

    return filteredTherapists;
  }

  /**
   * Sort therapists
   * @param {string} sortBy - Sort criteria (name, city, state)
   * @param {string} order - Sort order (asc, desc)
   * @returns {Array} Sorted therapists
   */
  function sort(sortBy = 'name', order = 'asc') {
    const sorted = [...filteredTherapists].sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (order === 'asc') {
        return valA > valB ? 1 : valA < valB ? -1 : 0;
      } else {
        return valA < valB ? 1 : valA > valB ? -1 : 0;
      }
    });

    filteredTherapists = sorted;
    return filteredTherapists;
  }

  /**
   * Get all filtered therapists
   * @returns {Array} Current filtered list
   */
  function getFilteredTherapists() {
    return filteredTherapists;
  }

  /**
   * Get therapist by ID
   * @param {string} id - Therapist ID
   * @returns {object|null} Therapist object
   */
  function getTherapistById(id) {
    return therapists.find(t => t.id === id) || null;
  }

  /**
   * Get unique states
   * @returns {Array} Array of state names
   */
  function getStates() {
    const states = [...new Set(therapists.map(t => t.state))];
    return states.sort();
  }

  /**
   * Get unique cities for a state
   * @param {string} state - State name
   * @returns {Array} Array of city names
   */
  function getCitiesForState(state) {
    const cities = therapists
      .filter(t => t.state === state)
      .map(t => t.city);
    return [...new Set(cities)].sort();
  }

  /**
   * Get all unique disorders covered
   * @returns {Array} Array of disorder types
   */
  function getDisorders() {
    const disorders = new Set();
    therapists.forEach(t => {
      t.specializations.forEach(spec => disorders.add(spec));
    });
    return Array.from(disorders).sort();
  }

  /**
   * Calculate distance between two coordinates (simplified)
   * @param {object} coord1 - First coordinate {lat, lng}
   * @param {object} coord2 - Second coordinate {lat, lng}
   * @returns {number} Distance in kilometers (approximate)
   */
  function calculateDistance(coord1, coord2) {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(coord2.lat - coord1.lat);
    const dLng = toRad(coord2.lng - coord1.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(coord1.lat)) *
        Math.cos(toRad(coord2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Convert degrees to radians
   * @param {number} deg - Degrees
   * @returns {number} Radians
   */
  function toRad(deg) {
    return (deg * Math.PI) / 180;
  }

  /**
   * Sort by distance from user location
   * @param {object} userLocation - User coordinates {lat, lng}
   * @returns {Array} Sorted therapists with distance
   */
  function sortByDistance(userLocation) {
    const withDistance = filteredTherapists.map(therapist => ({
      ...therapist,
      distance: calculateDistance(userLocation, therapist.coordinates)
    }));

    filteredTherapists = withDistance.sort((a, b) => a.distance - b.distance);
    return filteredTherapists;
  }

  /**
   * Format therapist for display
   * @param {object} therapist - Therapist object
   * @returns {string} Formatted HTML
   */
  function formatTherapistCard(therapist) {
    const isSaved = state.isTherapistSaved(therapist.id);
    const savedIcon = isSaved ? 'bookmark' : 'bookmark';
    const savedClass = isSaved ? 'text-primary' : '';

    return `
      <div class="card" data-therapist-id="${therapist.id}">
        <div class="flex justify-between items-center mb-4">
          <div class="flex-1">
            <h3 style="margin: 0 0 var(--space-2) 0;">${therapist.name}</h3>
            <div class="flex gap-2" style="flex-wrap: wrap;">
              ${therapist.specializations
                .map(
                  spec =>
                    `<span class="badge badge-primary">${spec}</span>`
                )
                .join('')}
            </div>
          </div>
          <button
            class="btn btn-ghost btn-sm save-therapist-btn ${savedClass}"
            data-therapist-id="${therapist.id}"
            aria-label="${isSaved ? 'Unsave' : 'Save'} therapist"
          >
            ${getIcon(savedIcon)}
          </button>
        </div>

        <div class="flex flex-col gap-2" style="color: var(--color-text-muted); font-size: var(--font-size-sm);">
          <div class="flex gap-2 items-center">
            ${getIcon('mapPin')}
            <span>${therapist.address}, ${therapist.city}, ${therapist.state} ${therapist.postcode}</span>
          </div>

          <div class="flex gap-2 items-center">
            ${getIcon('phone')}
            <a href="tel:${therapist.phone}">${therapist.phone}</a>
          </div>

          ${
            therapist.website
              ? `
          <div class="flex gap-2 items-center">
            ${getIcon('globe')}
            <a href="${therapist.website}" target="_blank" rel="noopener">${therapist.website}</a>
          </div>
          `
              : ''
          }

          <div class="flex gap-2 items-center">
            ${getIcon('clock')}
            <span>${therapist.hours}</span>
          </div>
        </div>

        ${
          therapist.distance
            ? `
        <div style="margin-top: var(--space-3); padding-top: var(--space-3); border-top: 1px solid var(--color-border);">
          <span class="text-muted" style="font-size: var(--font-size-sm);">
            ${getIcon('mapPin')} ${therapist.distance.toFixed(1)} km away
          </span>
        </div>
        `
            : ''
        }

        <div style="margin-top: var(--space-4); display: flex; gap: var(--space-2); flex-wrap: wrap;">
          <button class="btn btn-primary btn-sm view-details-btn" data-therapist-id="${therapist.id}">
            View Details
          </button>
          ${
            therapist.whatsapp
              ? `
          <a href="https://wa.me/${therapist.whatsapp.replace(/[^0-9]/g, '')}" class="btn btn-secondary btn-sm" target="_blank">
            ${getIcon('phone')} WhatsApp
          </a>
          `
              : ''
          }
          <button class="btn btn-ghost btn-sm copy-address-btn" data-address="${therapist.address}, ${therapist.city}">
            ${getIcon('copy')} Copy Address
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Reset all filters
   * @returns {Array} All therapists
   */
  function resetFilters() {
    filteredTherapists = [...therapists];
    return filteredTherapists;
  }

  // Public API
  return {
    loadTherapists,
    search,
    filterByDisorder,
    filterByState,
    applyFilters,
    sort,
    sortByDistance,
    getFilteredTherapists,
    getTherapistById,
    getStates,
    getCitiesForState,
    getDisorders,
    formatTherapistCard,
    resetFilters
  };
})();

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = therapistFinder;
}
