let accord_btn = document.getElementsByClassName('accordion');

for (i = 0; i < accord_btn.length; i++) {
    accord_btn[i].addEventListener('click', function () {
        this.classList.toggle('active');
    })
}


document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.card-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    const dotToSlideMap = [0, 1, 2, 3, 4];
    let currentIndex = 2; 
    let isTransitioning = false;
    const slidesCount = slides.length;
    const GAP = 50;
    const createInfiniteSlides = () => {
        // Сохраняем оригинальные слайды
        const originalSlides = Array.from(slides);
        
        // Очищаем слайдер
        slider.innerHTML = '';
        
        // Добавляем клоны последних 2 слайдов в начало
        for (let i = slidesCount - 2; i < slidesCount; i++) {
            const clone = originalSlides[i].cloneNode(true);
            clone.setAttribute('data-clone', 'true');
            slider.appendChild(clone);
        }
        
        // Добавляем оригинальные слайды
        originalSlides.forEach((slide, idx) => {
            slide.setAttribute('data-original', 'true');
            slide.setAttribute('data-index', idx);
            slider.appendChild(slide);
        });
        
        // Добавляем клоны первых 2 слайдов в конец
        for (let i = 0; i < 2; i++) {
            const clone = originalSlides[i].cloneNode(true);
            clone.setAttribute('data-clone', 'true');
            slider.appendChild(clone);
        }
    };
    
    createInfiniteSlides();
    
    // Обновляем список всех слайдов
    const allSlides = document.querySelectorAll('.card-slide');
    const totalSlides = allSlides.length;
    const realStartIndex = 2; // Индекс первого реального слайда (после клонов)
    
    // Утилиты
    const getSlideWidth = () => {
        const realSlide = document.querySelector('.card-slide[data-original="true"]');
        return realSlide?.offsetWidth || 600;
    };
    
    const getStep = () => getSlideWidth() + GAP;
    
    // Получить реальный индекс слайда
    function getRealIndex(pos) {
        const slide = allSlides[pos];
        if (slide && slide.hasAttribute('data-original')) {
            return parseInt(slide.getAttribute('data-index'));
        }
        return -1;
    }
    
    // Позиционирование слайдера
    function updateSlider(instant = false) {
        if (instant) {
            slider.style.transition = 'none';
        } else {
            slider.style.transition = 'transform 0.5s ease-in-out';
        }
        
        const slideWidth = getSlideWidth();
        const step = getStep();
        const translateX = -(currentIndex * step + slideWidth / 2);
        
        slider.style.transform = `translateX(${translateX}px)`;
        
        if (instant) {
            void slider.offsetHeight;
            slider.style.transition = 'transform 0.5s ease-in-out';
        }
        
        // Обновляем активные точки
        const realIndex = getRealIndex(currentIndex);
        dots.forEach((dot, dotIndex) => {
            if (dotToSlideMap[dotIndex] === realIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Обработка зацикливания
    function handleTransitionEnd() {
        if (!isTransitioning) return;
        
        let jumped = false;
        let newIndex = currentIndex;
        
        // Если дошли до клонов в конце - перепрыгиваем на начало реальных
        if (currentIndex >= realStartIndex + slidesCount) {
            newIndex = realStartIndex;
            jumped = true;
        }
        // Если дошли до клонов в начале - перепрыгиваем на конец реальных
        else if (currentIndex < realStartIndex) {
            newIndex = realStartIndex + slidesCount - 1;
            jumped = true;
        }
        
        if (jumped) {
            slider.style.transition = 'none';
            currentIndex = newIndex;
            
            const slideWidth = getSlideWidth();
            const step = getStep();
            const translateX = -(currentIndex * step + slideWidth / 2);
            slider.style.transform = `translateX(${translateX}px)`;
            
            void slider.offsetHeight;
            slider.style.transition = 'transform 0.5s ease-in-out';
            
            // Обновляем точки после прыжка
            const realIndex = getRealIndex(currentIndex);
            dots.forEach((dot, dotIndex) => {
                if (dotToSlideMap[dotIndex] === realIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        isTransitioning = false;
    }
    
    // Переключение на следующий слайд (вправо)
    function nextSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex++;
        updateSlider();
    }
    
    // Переключение на предыдущий слайд (влево)
    function prevSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex--;
        updateSlider();
    }
    
    // Переход на конкретный слайд
    function goToSlideByDot(dotIndex) {
        if (isTransitioning) return;
        const targetReal = dotToSlideMap[dotIndex];
        
        // Находим позицию целевого реального слайда в allSlides
        let targetPos = -1;
        for (let i = 0; i < allSlides.length; i++) {
            const slide = allSlides[i];
            if (slide.hasAttribute('data-original') && 
                parseInt(slide.getAttribute('data-index')) === targetReal) {
                targetPos = i;
                break;
            }
        }
        
        if (targetPos === -1 || targetPos === currentIndex) return;
        
        isTransitioning = true;
        currentIndex = targetPos;
        updateSlider();
        
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    }
    
    // Обработчик окончания анимации
    slider.addEventListener('transitionend', handleTransitionEnd);
    
    // Обработчики кнопок
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Обработчики точек
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            goToSlideByDot(idx);
        });
    });
    
    // Инициализация
    setTimeout(() => {
        currentIndex = realStartIndex + 2; // Центрируем третий реальный слайд
        updateSlider(true);
    }, 100);
    
    // Ресайз
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateSlider(true);
        }, 150);
    });
    
    // Клавиатура
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Touch-свайпы
    let touchStartX = 0;
    const swiper = document.querySelector('.swiper');
    
    if (swiper) {
        swiper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        swiper.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const diff = touchEndX - touchStartX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    prevSlide();
                } else {
                    nextSlide();
                }
            }
        });
    }
});