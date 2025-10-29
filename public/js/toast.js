/**
 * Toast Notification System
 * Displays temporary notifications with auto-dismiss
 */

const toast = (() => {
  const TOAST_DURATION = 5000; // 5 seconds
  const container = document.getElementById('toast-container');

  /**
   * Show a toast notification
   * @param {string} message - The message to display
   * @param {string} type - Type of toast: 'success', 'danger', 'warning', 'info'
   * @param {number} duration - Duration in milliseconds (default: 5000)
   */
  function show(message, type = 'info', duration = TOAST_DURATION) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    toast.setAttribute('aria-atomic', 'true');

    // Icon based on type
    let iconSvg = '';
    let iconColor = 'var(--color-text-primary)';

    switch (type) {
      case 'success':
        iconSvg = getIcon('check');
        iconColor = 'var(--color-success)';
        break;
      case 'danger':
        iconSvg = getIcon('alertCircle');
        iconColor = 'var(--color-danger)';
        break;
      case 'warning':
        iconSvg = getIcon('alertCircle');
        iconColor = 'var(--color-warning)';
        break;
      case 'info':
      default:
        iconSvg = getIcon('info');
        iconColor = 'var(--color-primary)';
        break;
    }

    // Build toast HTML
    toast.innerHTML = `
      <div style="color: ${iconColor}; flex-shrink: 0;">
        ${iconSvg}
      </div>
      <div style="flex: 1;">
        <p style="margin: 0; font-weight: var(--font-weight-medium);">${escapeHtml(message)}</p>
      </div>
      <button class="toast-close" aria-label="Close notification" style="background: none; border: none; padding: var(--space-2); cursor: pointer; color: var(--color-text-muted); display: flex; align-items: center; justify-content: center; margin-left: var(--space-2); border-radius: var(--radius-md); transition: all var(--transition-fast);">
        ${getIcon('x')}
      </button>
    `;

    // Add close button functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => remove(toast));
    closeBtn.addEventListener('mouseenter', function() {
      this.style.background = 'var(--color-bg)';
    });
    closeBtn.addEventListener('mouseleave', function() {
      this.style.background = 'none';
    });

    // Append to container
    if (container) {
      container.appendChild(toast);

      // Auto-dismiss after duration
      if (duration > 0) {
        setTimeout(() => remove(toast), duration);
      }
    } else {
      console.warn('Toast container not found. Add <div class="toast-container" id="toast-container"></div> to your HTML.');
    }

    return toast;
  }

  /**
   * Remove a toast notification
   * @param {HTMLElement} toast - The toast element to remove
   */
  function remove(toast) {
    toast.classList.add('removing');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300); // Match animation duration
  }

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Show success toast
   * @param {string} message - Success message
   */
  function success(message) {
    return show(message, 'success');
  }

  /**
   * Show error/danger toast
   * @param {string} message - Error message
   */
  function error(message) {
    return show(message, 'danger');
  }

  /**
   * Show warning toast
   * @param {string} message - Warning message
   */
  function warning(message) {
    return show(message, 'warning');
  }

  /**
   * Show info toast
   * @param {string} message - Info message
   */
  function info(message) {
    return show(message, 'info');
  }

  /**
   * Clear all toasts
   */
  function clearAll() {
    if (container) {
      container.innerHTML = '';
    }
  }

  // Public API
  return {
    show,
    success,
    error,
    warning,
    info,
    clearAll
  };
})();

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = toast;
}
