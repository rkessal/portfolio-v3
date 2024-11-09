import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollToPlugin from 'gsap/ScrollToPlugin'
import { desktop } from './desktop'
import { mobile } from './mobile'
import {
  eventListeners,
  eventListenersDesktop,
  eventListenersMobile,
  gsapElements,
  removeAllEventListeners,
  resetAllScrollTriggers,
  resetGsapElements,
  scrollTriggers
} from './utils'
import SplitType from 'split-type'

const COLOR_SECONDARY = '#EEF6E8'

gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(ScrollToPlugin)

const lenis = new Lenis()

function raf (time) {
  lenis.raf(time)
  window.requestAnimationFrame(raf)
}

window.requestAnimationFrame(raf)

const handleDevice = (value) => {
  resetGsapElements(gsapElements)
  resetAllScrollTriggers()
  state.menu = false
  if (value) {
    removeAllEventListeners(eventListenersDesktop)
    mobile()
  } else {
    removeAllEventListeners(eventListenersMobile)
    desktop()
  }
}

const closeMenu = () => {
  const tl = gsap.timeline()
  tl.to('.navigation__links__item a', {
    yPercent: 100,
    duration: 1.5,
    ease: 'power4.out'
  })
    .to('.navigation__inner__links', {
      width: 0,
      duration: 1.5,
      ease: 'power4.out'
    }, '-=1.3')
}

const openMenu = () => {
  gsap.set('.navigation__links__item a', {
    yPercent: 100
  })
  const tl = gsap.timeline({
  })
  tl.to('.navigation__inner__links', {
    width: state.mobile ? '100%' : '60%',
    duration: 1.5,
    ease: 'power4.inOut'
  })
    .to('.navigation__links__item a', {
      yPercent: 0,
      duration: 1.5,
      ease: 'power4.out',
      stagger: 0.1
    }, '-=1')
}

const onChangeMenuState = (value) => {
  if (value) {
    openMenu()
  } else {
    closeMenu()
  }
}

const onStateChange = (property, value) => {
  if (state[property] === value) {
    return
  }

  if (property === 'mobile') {
    handleDevice(value)
  }

  if (property === 'menu') {
    onChangeMenuState(value)
  }
}

const state = new Proxy(
  {
    mobile: undefined,
    menu: false
  },
  {
    set (target, property, value) {
      onStateChange(property, value)
      target[property] = value
      return true
    }
  }
)

const onMenuButtonClick = () => {
  state.menu = !state.menu
}

const onMenuLinkClick = () => {
  setTimeout(() => { state.menu = false }, 250)
}

const menuButton = document.querySelector('[data-menu-button]')
menuButton.addEventListener('click', onMenuButtonClick)
eventListeners.set(menuButton, [onMenuButtonClick])

const menuLinks = document.querySelectorAll('.navigation__links__item a')
menuLinks.forEach(link => {
  link.addEventListener('click', onMenuLinkClick)
  eventListeners.set(menuLinks, [onMenuLinkClick])
})

gsap.set('.navigation__inner__links', {
  width: 0,
  overflow: 'hidden',
  perspective: 300
})

gsap.set('.navigation__links__item', {
  overflowY: 'clip'
})

gsap.utils.toArray('.section__title').forEach((title, index) => {
  const el = title.querySelector('h1')
  const { lines, words } = SplitType.create(
    el,
    {
      types: 'lines,words',
      tagName: 'span'
    }
  )

  gsap.set(el, {
    fontKerning: 'none'
  })
  gsap.set(lines, {
    overflowY: 'clip',
    perspective: 30
  })
  gsap.set(words, {
    verticalAlign: 'sub'
  })
  gsap.from(words, {
    scrollTrigger: {
      trigger: title,
      start: 'start 70%'
    },
    yPercent: 110,
    duration: 1.5,
    ease: 'power4.out',
    stagger: 0.02,
    rotationX: -2,
    rotationY: -0.2
  })
})

const section3Container = document.querySelector('.section__variant-3__container')
const section3BulletIndicator = document.querySelector('.section__variant-3__bullet-indicator')
const key = 'section-3-bullet-indicator'
if (!scrollTriggers.has(key)) {
  ScrollTrigger.create({
    trigger: section3Container,
    pin: section3BulletIndicator,
    start: () => 'top top'
  })
  scrollTriggers.add(key)
}

gsap.utils.toArray('.section__variant-3__item').forEach(item => {
  const itemIndex = item.getAttribute('data-index')
  const span = section3BulletIndicator.querySelector(`[data-index="${itemIndex}"]`)

  gsap.to(span, {
    backgroundColor: COLOR_SECONDARY,
    ease: 'none',
    scrollTrigger: {
      trigger: item,
      start: 'top center',
      end: 'bottom center',
      scrub: true
    }
  })
})

gsap.set('.section__variant-3__item', {
  paddingTop: '32rem'
})

const section4Container = document.querySelector('#work')
const section4Title = section4Container.querySelector('.section__title')
const section4Item = section4Container.querySelector('.section__variant-4__item')

gsap.set(section4Title, {
  marginBottom: '16rem'
})

gsap.to(section4Title, {
  autoAlpha: 0.4,
  filter: 'blur(0.5rem)',
  ease: 'none',
  scrollTrigger: {
    trigger: section4Container,
    start: '10rem center',
    end: () => `+=${section4Container.getBoundingClientRect().height - section4Item.getBoundingClientRect().height / 2} bottom`,
    scrub: true,
    pin: section4Title
  }
})

gsap.utils.toArray('.section__variant-4__item').forEach((item, index) => {
  const image = item.querySelector('.section__variant-4__image')
  const title = item.querySelector('.section__variant-4__title')
  const subtitle = item.querySelector('.section__variant-4__description')

  gsap.set(item, {
    perspective: 300
  })

  gsap.from(image, {
    scale: 0.7,
    ease: 'none',
    scrollTrigger: {
      start: 'top bottom',
      end: '70% bottom',
      trigger: item,
      scrub: 2
    }
  })

  gsap.to(title, {
    y: () => image.getBoundingClientRect().height * -1.5,
    ease: 'none',
    scrollTrigger: {
      start: 'center bottom',
      end: 'center top',
      trigger: item,
      scrub: true
    }
  })

  gsap.set(subtitle, {
    marginTop: '2rem'
  })
  gsap.to(subtitle, {
    y: () => image.getBoundingClientRect().height * -0.75,
    ease: 'none',
    scrollTrigger: {
      start: 'center bottom',
      end: 'center top',
      trigger: item,
      scrub: 2
    }
  })

  const onMouseMove = (event) => {
    const xPos = event.clientX / window.innerWidth - 0.5
    const yPos = event.clientY / window.innerHeight - 0.5

    const offset = 4

    gsap.to(image, {
      ease: 'none',
      rotationX: () => yPos * -offset,
      rotationY: () => xPos * offset
    })
  }

  const onMouseLeave = () => {
    gsap.to(image, {
      ease: 'power4.out',
      duration: 1.5,
      rotationX: 0,
      rotationY: 0
    })
  }

  item.addEventListener('mousemove', onMouseMove)
  item.addEventListener('mouseleave', onMouseLeave)
})

const section6Container = document.querySelector('.section__variant-6__container')
const section6Arrows = Array.from(section6Container.querySelectorAll('.section__variant-6__arrow'))

const section6ItemHeight = '7.725rem'

const closeSection6Item = (index) => {
  gsap.to(`[data-variant-6-arrow-index="${index}"]`, {
    rotate: '0'
  })
  gsap.to(`[data-variant-6-item-index="${index}"]`, {
    height: section6ItemHeight,
    duration: 1,
    ease: 'power4.inOut'
  })
}
const openSection6Item = (index) => {
  gsap.to(`[data-variant-6-arrow-index="${index}"]`, {
    rotate: 180
  })
  gsap.to(`[data-variant-6-item-index="${index}"]`, {
    height: 'auto',
    duration: 1,
    ease: 'power4.inOut'
  })
}

const onChangeSection6State = ({ index, value }) => {
  value
    ? openSection6Item(index)
    : closeSection6Item(index)
}

const section6StateMap = new Proxy(
  section6Arrows.reduce((map, arrow) => {
    const index = arrow.getAttribute('data-variant-6-arrow-index')
    return {
      ...map,
      [index]: false
    }
  }),
  {
    set (target, property, value) {
      onChangeSection6State({ index: property, value })
      target[property] = value
      return true
    }
  })

const onSection6ItemClick = (e) => {
  const index = e.currentTarget.getAttribute('data-variant-6-item-index')
  section6StateMap[index] = !section6StateMap[index]
}

const section6Items = gsap.utils.toArray(section6Container.querySelectorAll('.section__variant-6__item'))
section6Items.forEach(item => {
  item.addEventListener('click', onSection6ItemClick)
  eventListenersDesktop.set(item, [onSection6ItemClick])
})

gsap.from(section6Items, {
  scrollTrigger: {
    trigger: section6Container,
    start: 'top center'
  },
  autoAlpha: 0,
  yPercent: 50,
  stagger: 0.1
})

// https://codepen.io/GreenSock/pen/ExKNEXY
function getSamePageAnchor (link) {
  if (
    link.protocol !== window.location.protocol ||
    link.host !== window.location.host ||
    link.pathname !== window.location.pathname ||
    link.search !== window.location.search
  ) {
    return false
  }

  return link.hash
}

function scrollToHash (hash, e) {
  const elem = hash ? document.querySelector(hash) : false
  if (elem) {
    if (e) e.preventDefault()
    gsap.to(window, {
      scrollTo: elem,
      duration: 1.5
    })
  }
}

document.querySelectorAll('a[href]').forEach(a => {
  a.addEventListener('click', e => {
    scrollToHash(getSamePageAnchor(a), e)
  })
})

scrollToHash(window.location.hash)

gsap.utils.toArray('[data-src]').forEach(async img => {
  const src = img.getAttribute('data-src')
  img.src = src
})

const isMobile = () => {
  return !(window.innerWidth > 768)
}

let resizeTimeout
const handleResize = () => {
  clearTimeout(resizeTimeout)

  resizeTimeout = setTimeout(() => {
    state.mobile = isMobile()
  }, 200)
}

window.addEventListener('resize', handleResize)

if (state.mobile === undefined) {
  state.mobile = isMobile()
}

console.log('I got you: https://github.com/rkessal/portfolio-v3')
