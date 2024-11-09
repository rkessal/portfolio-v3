import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { gsapElements, observeClassChange, scrollTriggers } from './utils'

const SECTION_1_TITLE_OPACITY = 0.4
const SECTION_1_TITLE_DEFAULT_STATE = {
  opacity: SECTION_1_TITLE_OPACITY,
  xPercent: 0,
  ease: 'power4.out',
  rotationY: 0
}

export const desktop = () => {
  gsap.utils.toArray('.section__variant-1__container').forEach((container, sectionIndex) => {
    const leftPart = container.querySelector('.section__variant-1__left')
    gsap.set(leftPart, {
      position: 'sticky',
      top: '8rem',
      perspective: 30
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
        gsap.to(target, SECTION_1_TITLE_DEFAULT_STATE)
      }
    })

    leftPartTitles.forEach((el, index) => {
      onCurrentTitleChange.observe(el, { attributes: true })
      gsapElements.set(`left-part-title-${index}-${sectionIndex}`, { element: '.section__variant-1__title' })
    })

    rightPartParagraphs.forEach((paragraph, index) => {
      const key = `section-1_${sectionIndex}-right-p-${index}`
      if (scrollTriggers.has(key)) {
        return
      }

      scrollTriggers.add(key)
      ScrollTrigger.create({
        trigger: paragraph,
        start: 'start center',
        onToggle: ({ isActive }) => {
          if (isActive) {
            leftPartTitles.forEach(t => {
              if (t.dataset['variant-1TitleIdx'] === paragraph.dataset['variant-1DescIdx']) {
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

  gsapElements.set('section-2-title-subtitle', {
    element: [
      '.section__variant-2__substitle__number',
      '.section__variant-2__title',
      '.section__variant-2__description'
    ]
  })

  const leftPartItems = gsap.utils
    .toArray('.section__variant-2__left__items')

  const rightPartParagraphs = gsap.utils
    .toArray('.section__variant-2__description')

  rightPartParagraphs.forEach((paragraph, index) => {
    const key = `section-2-right-p-${index}`
    if (scrollTriggers.has(key)) {
      return
    }

    scrollTriggers.add(key)
    ScrollTrigger.create({
      trigger: paragraph,
      start: 'start center',
      onToggle: ({ isActive }) => {
        if (isActive) {
          leftPartItems.forEach(t => {
            if (t.dataset['variant-2ItemIdx'] === paragraph.dataset['variant-2DescIdx']) {
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

  const section5Wrapper = document.querySelector('.section__variant-5__wrapper')
  const section5Container = document.querySelector('#testimonials')
  const section5WrapperBounds = section5Wrapper.getBoundingClientRect()
  const section5ItemBounds = document.querySelector('.section__variant-5__item').getBoundingClientRect()

  const keySection5Wrapper = 'section-5-wrapper'
  const tweenSection5Wrapper = gsap.to(section5Wrapper, {
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

  gsapElements.set(keySection5Wrapper, { tween: tweenSection5Wrapper, element: section5Wrapper })
}
