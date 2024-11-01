import Lenis from 'lenis'
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import SplitType from 'split-type';

const COLOR_PRIMARY = '#94A684'
const COLOR_SECONDARY = '#EEF6E8'
const COLOR_DARK = '#536247'

gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis();

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

const SECTION_1_TITLE_OPACITY = 0.4
const SECTION_1_TITLE_DEFAULT_STATE = {
  opacity: SECTION_1_TITLE_OPACITY,
  xPercent: 0,
  ease: 'power4.out',
  rotationY: 0,
}

const observeClassChange = (callback) => new MutationObserver((mutations) => {
  mutations.forEach(mu => {
    if (mu.type !== "attributes" || mu.attributeName !== "class") return;
    callback(mu.target); 
  });
});


gsap.utils.toArray('.section__title').forEach(title => {
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
    rotationY: -0.2,
  })
})

gsap.utils.toArray('.section__variant-1__container').forEach(container => {
  const leftPart = container.querySelector('.section__variant-1__left')
  gsap.set(leftPart, {
    position: 'sticky',
    top: '8rem',
    perspective: 30,
  })

  gsap.set('.section__variant-1__title', {
    opacity: SECTION_1_TITLE_OPACITY
  })

  const rightPartParagraphs = gsap.utils
    .toArray(container.querySelectorAll('.section__variant-1__description'))
  gsap.set(rightPartParagraphs, {
    paddingTop: '32rem'
  })

  const leftPartTitles = gsap.utils
    .toArray(leftPart.querySelectorAll('.section__variant-1__title'))

  const onCurrentTitleChange = observeClassChange((target) => {
    if (target.classList.contains('active')) {
      gsap.to(target, {
        opacity: 1,
        xPercent: 3,
        ease: 'power4.out',
        rotationY: 0.2
      })
    } else {
      gsap.to(target, SECTION_1_TITLE_DEFAULT_STATE, )
    }
  })

  leftPartTitles.forEach(el => onCurrentTitleChange.observe(el, { attributes: true }))
  

  rightPartParagraphs.forEach(paragraph => {
    new ScrollTrigger({
      trigger: paragraph,
      start: 'start center',
      onToggle: ({isActive}) => {
        if (isActive) {
          leftPartTitles.forEach(t => {
            if (t.dataset[`variant-1TitleIdx`] == paragraph.dataset['variant-1DescIdx']) {
              t.classList.add('active')
            } else {
              t.classList.remove('active')
            }
          })
        }
      }
    })
  })
})

gsap.set('.section__variant-2__left', {
  position: 'sticky',
  top: '8rem',
  height: '28rem',
  overflowY: 'clip'
})

const onLeftPartItemChange = observeClassChange(target => {
  if (target.classList.contains('active')) {
    const number = document.querySelectorAll('.section__variant-2__substitle__number')
    const title = document.querySelectorAll('.section__variant-2__title')
    const { height } = target.getBoundingClientRect()
    const index = target.dataset['variant-2ItemIdx']
    gsap.to([title, number], {
      y: (index * height) * -1,
      duration: 1.5,
      ease: 'power4.out',
      stagger: 0.01
    })
  } 
})

const leftPartItems = gsap.utils
  .toArray('.section__variant-2__left__items')

const rightPartParagraphs = gsap.utils
  .toArray('.section__variant-2__description')

rightPartParagraphs.forEach(paragraph => {
  new ScrollTrigger({
    trigger: paragraph,
    start: 'start center',
    onToggle: ({isActive}) => {
      if (isActive) {
        leftPartItems.forEach(t => {
          if (t.dataset[`variant-2ItemIdx`] == paragraph.dataset['variant-2DescIdx']) {
            t.classList.add('active')
          } else {
            t.classList.remove('active')
          }
        })
      }
    }
  })
})

leftPartItems.forEach(item => onLeftPartItemChange.observe(item, { attributes: true }))

gsap.set('.section__variant-2__description', {
  paddingTop: '32rem'
})

const section3Container = document.querySelector('.section__variant-3__container')
const section3BulletIndicator = document.querySelector('.section__variant-3__bullet-indicator')
ScrollTrigger.create({
  trigger: section3Container,
  pin: section3BulletIndicator,
  start: () => `top top`
})
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
      scrub: true,
    }
  })

})

gsap.set('.section__variant-3__item', {
  paddingTop: '32rem'
})

const section4Container = document.querySelector('#work'),
  section4Title = section4Container.querySelector('.section__title'),
  section4Item = section4Container.querySelector('.section__variant-4__item')

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


gsap.utils.toArray('.section__variant-4__item').forEach(item => {
  const image = item.querySelector('.section__variant-4__image')
  const title = item.querySelector('.section__variant-4__title')
  const subtitle = item.querySelector('.section__variant-4__description')

  gsap.set(item, {
    perspective: 300,
  })

  gsap.from(image, {
    scale: 0.7,
    ease: 'none',
    scrollTrigger: {
      start: 'top bottom',
      end: '70% bottom',
      trigger: item,
      scrub: 2,
    }
  })

  gsap.to(title, {
    y: () => image.getBoundingClientRect().height * -1.5,
    ease: 'none',
    scrollTrigger: {
      start: 'center bottom',
      end: 'center top',
      trigger: item,
      scrub: true,
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
      scrub: 2,
    }
  })

  item.addEventListener('mousemove', event => {
    let xPos = event.clientX / window.innerWidth - 0.5,
      yPos =  event.clientY / window.innerHeight - 0.5

    const offset = 4

      gsap.to(image, {
        ease: 'none',
        rotationX: () => yPos * -offset,
        rotationY: () => xPos * offset,
      })
  })
  item.addEventListener('mouseleave', event => {
      gsap.to(image, {
        ease: 'power4.out',
        duration: 1.5,
        rotationX: 0,
        rotationY: 0,
      })
  })
})


const section5Wrapper = document.querySelector('.section__variant-5__wrapper'),
  section5Container = document.querySelector('#testimonials'),
  section5WrapperBounds = section5Wrapper.getBoundingClientRect(),
  section5ItemBounds = document.querySelector('.section__variant-5__item').getBoundingClientRect()
  
gsap.to(section5Wrapper, {
  x: -section5WrapperBounds.width + section5ItemBounds.width,
  ease: 'none',
  scrollTrigger: {
    pin: section5Container,
    trigger: section5Container,
    start: 'top 10%',
    end: () => `+=${section5WrapperBounds.width} bottom`,
    scrub: 1
  }
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
    ease: 'power4.out'
  })
}
const openSection6Item = (index) => {
  gsap.to(`[data-variant-6-arrow-index="${index}"]`, {
    rotate: 180
  })
  gsap.to(`[data-variant-6-item-index="${index}"]`, {
    height: 'auto',
    duration: 1,
    ease: 'power4.out'
  })
}

const onChangeSection6State = ({index, value}) => {
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
  set(target, property, value) {
    onChangeSection6State({index: property, value})
    target[property] = value;
    return true;
  }
})

const onArrowClick = (e) => {
  const index = e.target.getAttribute('data-variant-6-arrow-index')
  section6StateMap[index] = !section6StateMap[index]
}

section6Arrows.forEach(arrow => arrow.addEventListener('click', onArrowClick))

gsap.utils.toArray('[data-src]').forEach(async img => {
  const src = img.getAttribute('data-src')
  img.src = src
})

