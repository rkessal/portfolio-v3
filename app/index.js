import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import { SplitText } from 'gsap/SplitText'
import * as THREE from 'three'

gsap.registerPlugin(Draggable, InertiaPlugin, MorphSVGPlugin, SplitText, ScrollTrigger)

const canvas = document.getElementById('bg-particles')
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
camera.position.z = 150
// Create a circle texture
const createCircleTexture = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const context = canvas.getContext('2d')
  // Draw a white circle
  context.beginPath()
  context.arc(32, 32, 30, 0, Math.PI * 2, false)
  context.fillStyle = 'white'
  context.fill()
  return new THREE.CanvasTexture(canvas)
}
const circleTexture = createCircleTexture()
const particleCount = 2000 // Increased from 800 to 1500
const particles = new THREE.BufferGeometry()
const positions = []
for (let i = 0; i < particleCount; i++) {
  positions.push((Math.random() - 0.5) * 700) // Wider spread: 300 -> 500
  positions.push((Math.random() - 0.5) * 700) // Wider spread: 300 -> 500
  positions.push((Math.random() - 0.5) * 700) // Wider spread: 300 -> 500
}
particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
const material = new THREE.PointsMaterial({
  color: 0x161616, // Dark color
  size: 0.5, // Adjusted size for circles
  map: circleTexture,
  transparent: true,
  opacity: 0.8, // Added reduced opacity
  alphaTest: 0.05 // Lower alphaTest value
})
const pointCloud = new THREE.Points(particles, material)
scene.add(pointCloud)
const mouse = { x: 0, y: 0 }
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
  mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2
})
function animate () {
  window.requestAnimationFrame(animate)
  pointCloud.rotation.y += 0.0002 // Slower rotation
  pointCloud.rotation.x += 0.0002 // Slower rotation
  // Slower reaction to mouse movement
  pointCloud.position.x += (mouse.x * 3 - pointCloud.position.x) * 0.05
  pointCloud.position.y += (mouse.y * 3 - pointCloud.position.y) * 0.05
  renderer.render(scene, camera)
}
animate()
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

const text = document.querySelectorAll('[data-text-split]')
let splits = []
let animations = []
function setup () {
  // Clean up existing
  splits.forEach(split => split.revert())
  animations.forEach(anim => anim.revert())
  splits = []
  animations = []
  ScrollTrigger.refresh()
  text.forEach(container => {
    const split = SplitText.create(container.querySelectorAll('h1, p'), {
      type: 'words,lines',
      mask: 'lines',
      linesClass: 'line',
      autoSplit: true,
      onSplit: (instance) => {
        const animation = gsap.from(instance.lines, {
          yPercent: 120,
          stagger: 0.1,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: container,
            start: 'clamp(top 80%)'
          }
        })
        animations.push(animation)
        return animation
      }
    })
    splits.push(split)
  })
}
setup()
window.addEventListener('resize', () => {
  setup()
})
document.querySelectorAll('.question-icon').forEach((icon, idx) => {
  icon.innerHTML = `
    <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      id='plus-${idx}' 
      d="M0.75 8H16.25M8.5 0.25L8.5 15.75" 
      stroke="#161616" stroke-width="2" 
      stroke-linecap="round"
    />
    <path 
      id='minus-${idx}' 
      style="visibility: hidden" 
      d="M0.75 8H16.25M8.5 8L8.5 8" 
      stroke="#161616" stroke-width="2" 
      stroke-linecap="round"
    />
  </svg>
`
  const anim = gsap.timeline({ ease: 'none', paused: true })
  anim.to(`#plus-${idx}`, {
    duration: 0.5,
    morphSVG: `#minus-${idx}`
  })
  gsap.set(icon.nextSibling, { yPercent: 10 })
  function onClick () {
    const open = icon.dataset.active === '1'
    gsap.to(icon, { scale: 0.9, yoyo: true, duration: 0.1, repeat: 1 })
    if (!open) {
      const tl = gsap.timeline()
      tl.to(anim, { time: anim.duration(), ease: 'power4.out' })
      tl.to(icon.nextSibling, { height: 'auto', ease: 'power4.out' }, '<')
      tl.to(icon.nextSibling, { autoAlpha: 1, yPercent: 0, duration: 0.2 }, '-=0.25')
      icon.dataset.active = '1'
    } else {
      const tl = gsap.timeline()
      tl.to(anim, { time: 0, ease: 'power4.out' })
      tl.to(icon.nextSibling, { autoAlpha: 0, yPercent: 10, duration: 0.2 }, '<')
      tl.to(icon.nextSibling, { height: 0, ease: 'power4.inOut', duration: 1 }, '<')
      icon.dataset.active = '0'
    }
  }
  function onMouseIn () {
    gsap.to(icon, {
      rotate: '180deg'
    })
    gsap.to(icon, {
      scale: 1.1
    })
  }
  function onMouseOut () {
    gsap.to(icon, {
      rotate: '0deg'
    })
    gsap.to(icon, {
      scale: 1
    })
  }
  icon.addEventListener('click', onClick)
  icon.addEventListener('mouseenter', onMouseIn)
  icon.addEventListener('mouseleave', onMouseOut)
})
function togglePlan () {
  document.querySelector('#plan-custom').classList.toggle('plan-active')
  document.querySelector('#plan-monthly').classList.toggle('plan-active')
}
document.querySelector('#btn-custom').addEventListener('click', togglePlan)
document.querySelector('#btn-monthly').addEventListener('click', togglePlan)
const workItems = gsap.utils.toArray('.work-item')
const marqueeItems = gsap.utils.toArray('.marquee .paragraph')
horizontalLoop(workItems, { paused: true, draggable: true })
horizontalLoop(marqueeItems, { paused: false, repeat: -1, speed: 0.5 })
/*
This helper function makes a group of elements animate along the x-axis in a seamless, responsive loop.
Features:
 - Uses xPercent so that even if the widths change (like if the window gets resized), it should still work in most cases.
 - When each item animates to the left or right enough, it will loop back to the other side
 - Optionally pass in a config object with values like draggable: true, speed (default: 1, which travels at roughly 100 pixels per second), paused (boolean), repeat, reversed, and paddingRight.
 - The returned timeline will have the following methods added to it:
   - next() - animates to the next element using a timeline.tweenTo() which it returns. You can pass in a vars object to control duration, easing, etc.
   - previous() - animates to the previous element using a timeline.tweenTo() which it returns. You can pass in a vars object to control duration, easing, etc.
   - toIndex() - pass in a zero-based index value of the element that it should animate to, and optionally pass in a vars object to control duration, easing, etc. Always goes in the shortest direction
   - current() - returns the current index (if an animation is in-progress, it reflects the final index)
   - times - an Array of the times on the timeline where each element hits the "starting" spot. There's also a label added accordingly, so "label1" is when the 2nd element reaches the start.
 */
function horizontalLoop (items, config) {
  items = gsap.utils.toArray(items)
  config = config || {}
  const tl = gsap.timeline({
    repeat: config.repeat,
    paused: config.paused,
    defaults: { ease: 'none' },
    onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)
  })
  const length = items.length
  const startX = items[0].offsetLeft
  const times = []
  const widths = []
  const xPercents = []
  let curIndex = 0
  const pixelsPerSecond = (config.speed || 1) * 100
  const snap = config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1) // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
  const populateWidths = () =>
    items.forEach((el, i) => {
      widths[i] = parseFloat(gsap.getProperty(el, 'width', 'px'))
      xPercents[i] = snap(
        (parseFloat(gsap.getProperty(el, 'x', 'px')) / widths[i]) * 100 +
        gsap.getProperty(el, 'xPercent')
      )
    })
  const getTotalWidth = () =>
    items[length - 1].offsetLeft +
        (xPercents[length - 1] / 100) * widths[length - 1] -
        startX +
        items[length - 1].offsetWidth *
        gsap.getProperty(items[length - 1], 'scaleX') +
        (parseFloat(config.paddingRight) || 0)
  let totalWidth
  let curX
  let distanceToStart
  let distanceToLoop
  let item
  let i
  populateWidths()
  gsap.set(items, {
    // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
    xPercent: (i) => xPercents[i]
  })
  gsap.set(items, { x: 0 })
  totalWidth = getTotalWidth()
  for (i = 0; i < length; i++) {
    item = items[i]
    curX = (xPercents[i] / 100) * widths[i]
    distanceToStart = item.offsetLeft + curX - startX
    distanceToLoop =
        distanceToStart + widths[i] * gsap.getProperty(item, 'scaleX')
    tl.to(
      item,
      {
        xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
        duration: distanceToLoop / pixelsPerSecond
      },
      0
    )
      .fromTo(
        item,
        {
          xPercent: snap(
            ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
          )
        },
        {
          xPercent: xPercents[i],
          duration:
          (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
          immediateRender: false
        },
        distanceToLoop / pixelsPerSecond
      )
      .add('label' + i, distanceToStart / pixelsPerSecond)
    times[i] = distanceToStart / pixelsPerSecond
  }
  function toIndex (index, vars) {
    vars = vars || {}
    Math.abs(index - curIndex) > length / 2 &&
        (index += index > curIndex ? -length : length) // always go in the shortest direction
    const newIndex = gsap.utils.wrap(0, length, index)
    let time = times[newIndex]
    if ((time > tl.time()) !== (index > curIndex)) {
      // if we're wrapping the timeline's playhead, make the proper adjustments
      vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) }
      time += tl.duration() * (index > curIndex ? 1 : -1)
    }
    curIndex = newIndex
    vars.overwrite = true
    return tl.tweenTo(time, vars)
  }
  tl.next = (vars) => {
    toIndex(curIndex + 1, vars)
  }
  tl.previous = (vars) => {
    toIndex(curIndex - 1, vars)
  }
  tl.current = () => curIndex
  tl.toIndex = (index, vars) => toIndex(index, vars)
  tl.updateIndex = () => (curIndex = Math.round(tl.progress() * items.length))
  tl.times = times
  tl.progress(1, true).progress(0, true) // pre-render for performance
  if (config.reversed) {
    tl.vars.onReverseComplete()
    tl.reverse()
  }
  if (config.draggable && typeof Draggable === 'function') {
    const proxy = document.createElement('div')
    const wrap = gsap.utils.wrap(0, 1)
    let ratio
    let startProgress
    // eslint-disable-next-line
    let draggable
    let dragSnap
    let roundFactor
    const align = () =>
      tl.progress(
        wrap(startProgress + (draggable.startX - draggable.x) * ratio)
      )
    const syncIndex = () => tl.updateIndex()
    typeof InertiaPlugin === 'undefined' &&
        console.warn(
          'InertiaPlugin required for momentum-based scrolling and snapping. https://greensock.com/club'
        )
    draggable = Draggable.create(proxy, {
      trigger: items[0].parentNode,
      type: 'x',
      onPress () {
        startProgress = tl.progress()
        tl.progress(0)
        populateWidths()
        totalWidth = getTotalWidth()
        ratio = 1 / totalWidth
        dragSnap = totalWidth / items.length
        roundFactor = Math.pow(
          10,
          ((dragSnap + '').split('.')[1] || '').length
        )
        tl.progress(startProgress)
      },
      onDrag: align,
      onThrowUpdate: align,
      inertia: true,
      snap: (value) => {
        const n =
              Math.round(parseFloat(value) / dragSnap) * dragSnap * roundFactor
        return (n - (n % 1)) / roundFactor
      },
      onRelease: syncIndex,
      onThrowComplete: () =>
        gsap.set(proxy, { x: 0 }) && syncIndex() // Find the middle item and toggle Class
    })[0]
    tl.draggable = draggable
  }
  return tl
}
