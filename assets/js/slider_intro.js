let desktopSwiper;
let mobileSwiper;
let videoInterval;
const videoChangeTime = 5000;

function initSwipers() {
    if (window.innerWidth > 768) {
        if (window.typingAnimation.elementId === 'typing-word-mobile') {
            window.typingAnimation.stop();
        }
        initDesktopSwiper();
        window.typingAnimation.init('typing-word');
    } else {
        if (window.typingAnimation.elementId === 'typing-word') {
            window.typingAnimation.stop();
        }
        initMobileSwiper();
        initMobileVideoBackground();
        window.typingAnimation.init('typing-word-mobile');
    }
}

function initDesktopSwiper() {
    if (desktopSwiper) desktopSwiper.destroy();

    const baseRatio = 650 / 1512;
    const sliderLeftVw = (baseRatio * 100).toFixed(2);

    const sliderWrapper = document.querySelector('.intro_slider_wrapper');
    if (sliderWrapper) {
        sliderWrapper.style.left = `${sliderLeftVw}vw`;
        sliderWrapper.style.width = `calc(100vw - ${sliderLeftVw}vw)`;
        sliderWrapper.style.right = 'auto';
    }

    desktopSwiper = new Swiper('.desktop_slider .swiper-container', {
        slidesPerView: 'auto',
        centeredSlides: false,
        resistanceRatio: 0.5,
        freeMode: false,
        slideToClickedSlide: false,
        watchSlidesProgress: true,
        speed: 800,
        touchRatio: 0.8,
        followFinger: true,
        allowTouchMove: true,

        on: {
            init() {
                updateSlideClasses(this);
                handleVideoPlayback(this);
            },
            slideChangeTransitionStart() {
                this.slides.forEach(slide => {
                    slide.style.transition = 'all 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)';
                });
                updateSlideClasses(this);
            },
            transitionEnd() {
                handleVideoPlayback(this);
            }
        }
    });
}

function initMobileSwiper() {
    if (mobileSwiper) mobileSwiper.destroy();

    mobileSwiper = new Swiper('.mobile-slider', {
        slidesPerView: 1,
        speed: 500,
        allowTouchMove: true,
        pagination: {
            el: '.mobile-pagination',
            clickable: true,
            renderBullet: function (index, className) {
                return `<span class="${className}"></span>`;
            },
        },
        on: {
            init: function () {
                document.querySelector('.mobile_promo_slide').style.opacity = '1';
                document.querySelector('.mobile_advantages_slide').style.opacity = '0';
                document.querySelector('.mobile_advantages_slide').style.display = 'none';

                if (window.innerWidth <= 768) {
                    window.typingAnimation.init('typing-word-mobile');
                }
            },
            slideChangeTransitionStart: function () {
                if (this.previousIndex === 0) {
                    document.querySelector('.mobile_promo_slide').style.opacity = '0';
                    document.querySelector('.mobile_video_background').style.opacity = '0';
                } else {
                    document.querySelector('.mobile_advantages_slide').style.opacity = '0';
                }
            },
            slideChangeTransitionEnd: function () {
                if (this.activeIndex === 0) {
                    document.querySelector('.mobile_promo_slide').style.opacity = '1';
                    document.querySelector('.mobile_promo_slide').style.display = 'block';
                    document.querySelector('.mobile_advantages_slide').style.display = 'none';
                    document.querySelector('.mobile_video_background').style.opacity = '1';
                    initMobileVideoBackground();
                } else {
                    document.querySelector('.mobile_promo_slide').style.display = 'none';
                    document.querySelector('.mobile_advantages_slide').style.display = 'block';
                    document.querySelector('.mobile_advantages_slide').style.opacity = '1';
                    document.querySelector('.mobile_video_background').style.opacity = '0';
                }
            }
        }
    });
}

function initMobileVideoBackground() {
    const videos = document.querySelectorAll('.mobile_background_video');
    let currentVideoIndex = 0;

    if (videoInterval) clearInterval(videoInterval);

    videos.forEach(video => {
        video.classList.remove('active');
        video.style.opacity = '0';
    });

    videos[currentVideoIndex].classList.add('active');
    videos[currentVideoIndex].style.opacity = '1';

    videos.forEach(video => {
        video.play().catch(e => console.warn('Autoplay prevented:', e));
    });

    videoInterval = setInterval(() => {
        videos[currentVideoIndex].classList.remove('active');
        videos[currentVideoIndex].style.opacity = '0';

        currentVideoIndex = (currentVideoIndex + 1) % videos.length;

        videos[currentVideoIndex].classList.add('active');
        videos[currentVideoIndex].style.opacity = '1';
    }, videoChangeTime);
}

function updateSlideClasses(swiper) {
    if (window.innerWidth > 768) {
        const { slides, activeIndex, previousIndex } = swiper;
        const wasNext = activeIndex > previousIndex;
        const newActiveSlide = slides[activeIndex];

        slides.forEach((slide) => {
            slide.classList.remove('is-prev', 'is-next', 'is-moving-to-center', 'is-active');
            slide.style.transition = 'all 0.6s cubic-bezier(0.33, 1, 0.68, 1)';
            slide.style.transitionDelay = '0s';
        });

        slides.forEach((slide, index) => {
            if (index < activeIndex) {
                slide.classList.add('is-prev');
                slide.style.transform = 'translateX(-20%) scale(0.85)';
            } else if (index > activeIndex) {
                slide.classList.add('is-next');
                slide.style.transform = 'translateX(0) scale(0.85)';
            }
        });

        if (wasNext) {
            newActiveSlide.classList.add('is-moving-to-center');
            setTimeout(() => {
                newActiveSlide.classList.remove('is-moving-to-center');
                newActiveSlide.classList.add('is-active');
                newActiveSlide.style.transform = 'translateX(0) scale(1)';
            }, 400);
        } else {
            newActiveSlide.classList.add('is-active');
            newActiveSlide.style.transform = 'translateX(0) scale(1)';
        }
    }
}

function handleVideoPlayback(swiper) {
    if (window.innerWidth > 768) {
        swiper.slides.forEach((slide) => {
            const video = slide.querySelector('.slider_video');
            if (video) {
                video.pause();
                video.currentTime = 0;
                video.onended = null;
            }
        });

        const activeSlide = swiper.slides[swiper.activeIndex];
        const activeVideo = activeSlide.querySelector('.slider_video');

        if (activeVideo) {
            activeVideo.muted = true;
            activeVideo.play().catch(e => {
                console.warn('[Video] Autoplay prevented:', e);
            });

            activeVideo.onended = () => {
                swiper.slideNext(800);
            };
        }
    }
}

function handleResize() {
    initSwipers();

    if (window.innerWidth > 768) {
        const firstVideo = document.querySelector('.swiper-slide.is-active .slider_video');
        if (firstVideo) {
            firstVideo.muted = true;
            firstVideo.play().catch(e => {
                console.warn('[FirstVideo] Autoplay error:', e);
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initSwipers();

    if (window.innerWidth > 768) {
        const firstVideo = document.querySelector('.swiper-slide.is-active .slider_video');
        if (firstVideo) {
            firstVideo.muted = true;
            firstVideo.play().catch(e => {
                console.warn('[FirstVideo] Autoplay error:', e);
            });
        }
    }
});

window.addEventListener('resize', function () {
    const wasRunning = window.typingAnimation.isRunning;
    const currentElement = window.typingAnimation.elementId;

    window.typingAnimation.stop();

    initSwipers();

    if (wasRunning && currentElement) {
        window.typingAnimation.init(currentElement);
    }
});