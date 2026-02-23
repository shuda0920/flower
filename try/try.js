gsap.registerPlugin(ScrollTrigger);


const tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".show-animate",
        start: "top top",
        end: "+=3000",
        scrub: 1,
        pin: true,
        markers: true,
    }
})

tl.to(".a1", {
    x: -100,
    opacity: 0,
    duration: 0.3,
    ease: "power2.out"
})

tl.to(".a2", {
    x: -100,
    opacity: 1,
    duration: 1,
    ease: "power2.out"
},)
tl.to(".a2", {
    x: -200,
    opacity: 0,
    duration: 1,
    ease: "power2.out"
})
tl.to(".a3", {
    x: -100,
    opacity: 1,
    duration: 1,
    ease: "power2.out"
})

tl.addLabel("step1") // 建立一個名為 step1 的標記點
    .to(".a1", { x: 100, opacity: 1 }, "step1")
    .to(".a2", { y: 200, opacity: 1 }, "step1")
    .to(".a3", { opacity: 0 }, "step1");