document.addEventListener('DOMContentLoaded', function() {
    /* SIDE NAVIGATION */
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');
    const sidenav = document.getElementById('sidenav');
    const overlay = document.getElementById('overlay');
  
    menuBtn.addEventListener('click', function() {
      sidenav.classList.add('active');
      overlay.classList.add('active');
    });
    closeBtn.addEventListener('click', function() {
      sidenav.classList.remove('active');
      overlay.classList.remove('active');
    });
    overlay.addEventListener('click', function() {
      sidenav.classList.remove('active');
      overlay.classList.remove('active');
    });
  
    /* SMOOTH SCROLLING FOR SAME-PAGE LINKS */
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        if (this.getAttribute('href').charAt(0) === '#') {
          e.preventDefault();
          const targetId = this.getAttribute('href').substring(1);
          const targetSection = document.getElementById(targetId);
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
          }
          if (sidenav.classList.contains('active')) {
            sidenav.classList.remove('active');
            overlay.classList.remove('active');
          }
        }
      });
    });
  
    /* FEATURES CAROUSEL (3 Visible: Left, Center, Right) */
    const featureItems = document.querySelectorAll('.features-carousel .carousel-item');
    let totalItems = featureItems.length;
    let currentCenter = 0;
  
    function updateCarousel() {
      featureItems.forEach((item, index) => {
        item.classList.remove('left', 'center', 'right');
        let diff = index - currentCenter;
        if(diff < -Math.floor(totalItems / 2)) diff += totalItems;
        if(diff > Math.floor(totalItems / 2)) diff -= totalItems;
  
        if(diff === 0) {
          item.classList.add('center');
          item.style.display = 'block';
        } else if(diff === -1 || (currentCenter === 0 && index === totalItems - 1)) {
          item.classList.add('left');
          item.style.display = 'block';
        } else if(diff === 1 || (currentCenter === totalItems - 1 && index === 0)) {
          item.classList.add('right');
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    }
    updateCarousel();
  
    let carouselInterval = setInterval(() => {
      currentCenter = (currentCenter + 1) % totalItems;
      updateCarousel();
    }, 5000);
  
    featureItems.forEach(item => {
      item.addEventListener('mouseenter', function() {
        if(!this.classList.contains('center')) {
          clearInterval(carouselInterval);
          let newIndex = parseInt(this.getAttribute('data-index'));
          if(!isNaN(newIndex)) {
            currentCenter = newIndex;
            updateCarousel();
          }
        }
      });
      item.addEventListener('mouseleave', function() {
        carouselInterval = setInterval(() => {
          currentCenter = (currentCenter + 1) % totalItems;
          updateCarousel();
        }, 5000);
      });
      item.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const detailSection = document.getElementById(targetId);
        if(detailSection) {
          detailSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  
    /* TESTIMONIALS CAROUSEL */
    const testimonialItems = document.querySelectorAll('.testimonials-carousel .carousel-item');
    let testimonialIndex = 0;
    const prevTestimonialBtn = document.getElementById('prevTestimonialBtn');
    const nextTestimonialBtn = document.getElementById('nextTestimonialBtn');
  
    function showTestimonial(index) {
      testimonialItems.forEach((item, i) => {
        item.classList.toggle('active', i === index);
      });
    }
    nextTestimonialBtn.addEventListener('click', function() {
      testimonialIndex = (testimonialIndex + 1) % testimonialItems.length;
      showTestimonial(testimonialIndex);
    });
    prevTestimonialBtn.addEventListener('click', function() {
      testimonialIndex = (testimonialIndex - 1 + testimonialItems.length) % testimonialItems.length;
      showTestimonial(testimonialIndex);
    });
    setInterval(() => {
      testimonialIndex = (testimonialIndex + 1) % testimonialItems.length;
      showTestimonial(testimonialIndex);
    }, 5000);
  });
  
