// UI Enhancements: tilt card (3D effect) and lazy-inject templates

function initTiltCards() {
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach((card) => {
        const rect = () => card.getBoundingClientRect();
        const onMove = (e) => {
            const r = rect();
            const x = e.clientX - r.left;
            const y = e.clientY - r.top;
            const cx = r.width / 2;
            const cy = r.height / 2;
            const dx = (x - cx) / cx; // -1 .. 1
            const dy = (y - cy) / cy; // -1 .. 1
            const rotY = dx * 8; // degrees
            const rotX = -dy * 8; // degrees
            card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(6px)`;
        };
        const onLeave = () => {
            card.style.transform = '';
        };
        card.addEventListener('pointermove', onMove);
        card.addEventListener('pointerleave', onLeave);
    });
}

function lazyInjectTemplates() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const templateId = el.dataset.template;
            if (templateId) {
                const tpl = document.getElementById(templateId);
                if (tpl && tpl.content && tpl.content.firstElementChild) {
                    // clone content
                    const clone = tpl.content.cloneNode(true);
                    el.appendChild(clone);
                    // mark as loaded
                    el.classList.add('lazy-loaded');
                }
            }
            observer.unobserve(el);
        });
    }, { rootMargin: '200px' });

    document.querySelectorAll('[data-template]').forEach((el) => observer.observe(el));
}

function lazyReveal() {
    const els = document.querySelectorAll('.lazy-reveal');
    if (!els.length) return;
    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('lazy-loaded');
                obs.unobserve(entry.target);
            }
        });
    }, { rootMargin: '200px' });
    els.forEach((el) => io.observe(el));
}

function initLazyImages() {
    const imgs = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.addEventListener('load', () => img.classList.add('loaded'));
                obs.unobserve(img);
            });
        }, { rootMargin: '200px' });
        imgs.forEach((i) => io.observe(i));
    } else {
        imgs.forEach((i) => {
            i.src = i.dataset.src;
            i.classList.add('loaded');
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    try {
        initTiltCards();
        lazyInjectTemplates();
        initLazyImages();
        lazyReveal();
    } catch (e) {
        // fail silently
        // console.error('ui-enhancements error', e);
    }
});
