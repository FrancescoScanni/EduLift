export function activeSwiper(){
    const swiper = new Swiper(".mySwiper", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        coverflowEffect: {
            rotate: 30,
            stretch: 0,
            depth: 300,
            modifier: 1,
            slideShadows: true,
        },
        //autoplay: {
        //    delay: 2500, // 2.5 seconds per slide
        //    disableOnInteraction: false, // keeps autoplay even after manual swipe
        //},
        loop: true, // infinite loop
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });
}

    