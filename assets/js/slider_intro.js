document.addEventListener('DOMContentLoaded', () => {
  const swiperTwo = new Swiper('.swiper-two', {
    slidesPerView: 5,
    spaceBetween: 16,
    loop: false,
    loopedSlides: 10,
    allowTouchMove: false,
    speed: 1000,
    watchSlidesProgress: true
  });

  const swiperOne = new Swiper('.swiper-one', {
    loop: true,
    speed: 1000,
    spaceBetween: 30,
    on: {
      slideChange() {
        const realIndex = this.realIndex;
        swiperTwo.slideTo(realIndex, 1000);
      },

      init() {
        swiperTwo.slideTo(0, 0);
      }
    }
  });

  if (swiperTwo.slides.length >= 6) {
    swiperTwo.params.loop = true;
    swiperTwo.update();
  }
});