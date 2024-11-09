import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * @param {function} callback
*/
export const observeClassChange = (callback) => new window.MutationObserver((mutations) => {
  mutations.forEach(mu => {
    if (mu.type !== 'attributes' || mu.attributeName !== 'class') return
    callback(mu.target)
  })
})

/** @type {Map<HTMLElement, function[]>} */
export const eventListeners = new Map()

/** @type {Set<ScrollTrigger>} */
export const scrollTriggers = new Set()

/** @type {Map<string, {tween: GSAPTween, element: HTMLElement | string}} */
export const gsapElements = new Map()

/** @type {Map<HTMLElement, function[]>} */
export const eventListenersDesktop = new Map()

/** @type {Map<HTMLElement, function[]>} */
export const gsapElementsDesktop = new Map()

export const eventListenersMobile = new Map()

/**
 * @param {Map<HTMLElement, function[]>} map
*/
export const removeAllEventListeners = (map) => {
  map.forEach((listeners, item) => {
    listeners.forEach(({ event, handler }) => {
      item.removeEventListener(event, handler)
    })
  })
}

export const resetAllScrollTriggers = () => {
  const totalScrollTriggers = ScrollTrigger.getAll()
  totalScrollTriggers.forEach(st => st.refresh())
}

/**
 * @param {Map<string, {tween: GSAPTween, element: HTMLElement | string }} map
 */
export const resetGsapElements = (map) => {
  map.forEach(({ tween, element }) => {
    if (tween) {
      tween.scrollTrigger?.kill(true)
    }
    gsap.set(element, { clearProps: true })
  })
  map.clear()
}
