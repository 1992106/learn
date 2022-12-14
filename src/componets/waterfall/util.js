const inBrowser = typeof window !== 'undefined' && window !== null

function checkIntersectionObserver() {
  if (
    inBrowser &&
    'IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRatio' in window.IntersectionObserverEntry.prototype
  ) {
    // Minimal polyfill for Edge 15's lack of `isIntersecting`
    // See: https://github.com/w3c/IntersectionObserver/issues/211
    if (!('isIntersecting' in window.IntersectionObserverEntry.prototype)) {
      Object.defineProperty(window.IntersectionObserverEntry.prototype, 'isIntersecting', {
        get: function() {
          return this.intersectionRatio > 0
        }
      })
    }
    return true
  }
  return false
}

export { checkIntersectionObserver }
