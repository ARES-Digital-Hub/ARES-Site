if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

function scrollToTop() {
    setTimeout(() => {
        gsap.to(window, { duration: 0, scrollTo: 0 });
    }, 50); 
}


window.addEventListener('load', scrollToTop);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Fade-in transition effect for info sections
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.fade-in');
    sections.forEach(section => {
        section.classList.add('visible');
    });
});

// Hover effect for buttons
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.classList.add('hovered');
    });
    button.addEventListener('mouseleave', () => {
        button.classList.remove('hovered');
    });
});

window.addEventListener('scroll', () => {
    const bubble = document.querySelector('.info-bubble');
    if (window.scrollY > 100) {
        bubble.style.maxHeight = '600px';
    } else {
        bubble.style.maxHeight = '200px';
    }
});

if (window.location.href.indexOf("add") > -1) {
    document.getElementById("page-header").classList.add("colored-text");
}