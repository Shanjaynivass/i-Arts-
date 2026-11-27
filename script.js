document.addEventListener("DOMContentLoaded", () => {
    const scrollContainer = document.getElementById("scrollContainer");
    const scrollProgress = document.getElementById("scrollProgress");
    const navToggle = document.getElementById("navToggle");
    const navMenu = document.getElementById("a3");
    const navLinks = Array.from(document.querySelectorAll("#a3 .nav-link"));
    const backToTopBtn = document.getElementById("backToTop");
    const toast = document.getElementById("toast");
    let toastTimer = null;

    const showToast = (message) => {
        if (!toast) return;
        toast.textContent = message;
        toast.hidden = false;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.hidden = true;
        }, 2800);
    };

    // Mobile navbar toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            const isOpen = navMenu.classList.toggle("open");
            navToggle.setAttribute("aria-expanded", String(isOpen));
        });

        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("open");
                navToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    // Active navigation highlight + scroll progress bar
    const trackedSections = ["b", "c", "d", "f", "g1"]
        .map((id) => document.getElementById(id))
        .filter(Boolean);

    const updateScrollState = () => {
        if (!scrollContainer) return;
        const containerTop = scrollContainer.getBoundingClientRect().top;
        let currentId = "b";

        for (const section of trackedSections) {
            const rect = section.getBoundingClientRect();
            if (rect.top - containerTop <= 140) {
                currentId = section.id;
            }
        }

        navLinks.forEach((link) => {
            const target = link.getAttribute("href")?.slice(1);
            link.classList.toggle("active", target === currentId);
        });

        if (backToTopBtn) {
            backToTopBtn.classList.toggle("visible", scrollContainer.scrollTop > 320);
        }

        if (scrollProgress) {
            const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
            const pct = maxScroll > 0 ? (scrollContainer.scrollTop / maxScroll) * 100 : 0;
            scrollProgress.style.width = `${Math.min(100, Math.max(0, pct))}%`;
        }
    };

    if (scrollContainer) {
        scrollContainer.addEventListener("scroll", updateScrollState, { passive: true });
        updateScrollState();
    }

    if (backToTopBtn && scrollContainer) {
        backToTopBtn.addEventListener("click", () => {
            scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Scroll reveal animation
    const revealEls = Array.from(document.querySelectorAll(".reveal"));
    if ("IntersectionObserver" in window && scrollContainer) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("revealed");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { root: scrollContainer, threshold: 0.08 }
        );
        revealEls.forEach((el) => observer.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add("revealed"));
    }

    // Gallery counts & category filter tabs
    const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
    const gallerySections = Array.from(document.querySelectorAll(".gallery-section"));
    const galleryImages = Array.from(document.querySelectorAll(".gallery-grid img"));
    const artworkTotalStat = document.getElementById("artworkTotalStat");

    if (artworkTotalStat) {
        artworkTotalStat.textContent = String(galleryImages.length);
    }

    filterButtons.forEach((btn) => {
        const key = btn.dataset.filter;
        const count =
            key === "all"
                ? galleryImages.length
                : document.querySelectorAll(`#${key} .gallery-grid img`).length;
        btn.textContent = `${btn.textContent.trim()} (${count})`;

        btn.addEventListener("click", () => {
            const selected = btn.dataset.filter;
            filterButtons.forEach((b) => {
                const isActive = b === btn;
                b.classList.toggle("active", isActive);
                b.setAttribute("aria-selected", String(isActive));
            });

            gallerySections.forEach((sec) => {
                sec.hidden = selected !== "all" && sec.id !== selected;
            });
        });
    });

    // Ensure featured collection links reveal target gallery section if filtered out
    document.querySelectorAll('a[href^="#c"]').forEach((link) => {
        link.addEventListener("click", () => {
            const targetId = link.getAttribute("href")?.slice(1);
            if (!targetId || targetId === "c") return;
            const matchingBtn = filterButtons.find((b) => b.dataset.filter === targetId);
            if (matchingBtn) {
                matchingBtn.click();
            } else {
                filterButtons.find((b) => b.dataset.filter === "all")?.click();
            }
        });
    });

    // Gallery Lightbox with zoom & swipe
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const lightboxClose = document.getElementById("lightboxClose");
    const lightboxPrev = document.getElementById("lightboxPrev");
    const lightboxNext = document.getElementById("lightboxNext");
    let currentIndex = 0;
    let touchStartX = 0;

    const getVisibleImages = () =>
        galleryImages.filter((img) => !img.closest(".gallery-section")?.hidden);

    const showLightboxImage = (index) => {
        const visible = getVisibleImages();
        if (!visible.length || !lightbox || !lightboxImg || !lightboxCaption) return;

        currentIndex = (index + visible.length) % visible.length;
        const img = visible[currentIndex];
        const category = img.closest(".gallery-section")?.dataset.category || "Artwork";

        lightboxImg.classList.remove("zoomed");
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = `${category} (${currentIndex + 1} / ${visible.length}) — Click image to zoom`;
    };

    const openLightbox = (img) => {
        const visible = getVisibleImages();
        const idx = visible.indexOf(img);
        if (idx === -1 || !lightbox) return;

        showLightboxImage(idx);
        lightbox.hidden = false;
        lightboxClose?.focus();
    };

    const closeLightbox = () => {
        if (lightbox) lightbox.hidden = true;
        lightboxImg?.classList.remove("zoomed");
    };

    galleryImages.forEach((img) => {
        img.addEventListener("click", () => openLightbox(img));
    });

    lightboxImg?.addEventListener("click", () => {
        lightboxImg.classList.toggle("zoomed");
    });

    lightboxClose?.addEventListener("click", closeLightbox);
    lightboxPrev?.addEventListener("click", () => showLightboxImage(currentIndex - 1));
    lightboxNext?.addEventListener("click", () => showLightboxImage(currentIndex + 1));

    lightbox?.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    lightbox?.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    lightbox?.addEventListener("touchend", (e) => {
        const diff = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(diff) > 50) {
            showLightboxImage(diff > 0 ? currentIndex - 1 : currentIndex + 1);
        }
    }, { passive: true });

    document.addEventListener("keydown", (e) => {
        if (!lightbox || lightbox.hidden) return;
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") showLightboxImage(currentIndex - 1);
        if (e.key === "ArrowRight") showLightboxImage(currentIndex + 1);
    });

    // Interactive Commission Planner
    const planStyle = document.getElementById("planStyle");
    const planFormat = document.getElementById("planFormat");
    const planSubjects = document.getElementById("planSubjects");
    const sumStyle = document.getElementById("sumStyle");
    const sumFormat = document.getElementById("sumFormat");
    const sumDelivery = document.getElementById("sumDelivery");
    const sumTimeline = document.getElementById("sumTimeline");
    const applyPlanBtn = document.getElementById("applyPlanBtn");

    const updatePlannerSummary = () => {
        if (!planStyle || !planFormat || !planSubjects) return;
        const styleVal = planStyle.value;
        const formatVal = planFormat.value;
        const isDigital = formatVal.includes("Digital") || styleVal === "Digital Portrait";

        if (sumStyle) sumStyle.textContent = `${styleVal} (${planSubjects.value})`;
        if (sumFormat) sumFormat.textContent = formatVal;
        if (sumDelivery) {
            sumDelivery.textContent = isDigital
                ? "Online via Email / Google Drive (JPEG/PNG)"
                : "Physical flat no-fold shipping (Tamil Nadu)";
        }
        if (sumTimeline) {
            sumTimeline.textContent = isDigital ? "2–5 days" : "5–7 days after completion";
        }
    };

    [planStyle, planFormat, planSubjects].forEach((sel) => {
        sel?.addEventListener("change", updatePlannerSummary);
    });
    updatePlannerSummary();

    if (applyPlanBtn) {
        applyPlanBtn.addEventListener("click", () => {
            const artTypeSelect = document.getElementById("artType");
            const messageBox = document.getElementById("message");
            const contactSection = document.getElementById("g2");

            if (artTypeSelect && planStyle) {
                artTypeSelect.value = planStyle.value;
            }
            if (messageBox && planStyle && planFormat && planSubjects) {
                messageBox.value =
                    `Hi Shanjay, I'd like to commission a ${planSubjects.value} in ${planStyle.value} (${planFormat.value}).`;
            }

            contactSection?.scrollIntoView({ behavior: "smooth" });
            showToast("Commission details pre-filled in Contact Form!");
        });
    }

    // Contact form mailto composition + copy email helper
    const contactForm = document.getElementById("contactForm");
    const copyEmailBtn = document.getElementById("copyEmailBtn");
    const formStatus = document.getElementById("formStatus");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("name")?.value.trim() || "";
            const email = document.getElementById("email")?.value.trim() || "";
            const artType = document.getElementById("artType")?.value || "";
            const message = document.getElementById("message")?.value.trim() || "";

            const subject = encodeURIComponent(`Portrait Inquiry (${artType}) - ${name}`);
            const body = encodeURIComponent(
                `Name: ${name}\nEmail: ${email}\nArt Style: ${artType}\n\nMessage:\n${message}`
            );

            window.location.href = `mailto:shanjayvj@gmail.com?subject=${subject}&body=${body}`;
            if (formStatus) {
                formStatus.textContent = "Opening your email app with your portrait request...";
            }
            showToast("Launching email client with your inquiry...");
        });
    }

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText("shanjayvj@gmail.com");
                if (formStatus) {
                    formStatus.textContent = "Email copied: shanjayvj@gmail.com";
                }
                showToast("Copied shanjayvj@gmail.com to clipboard!");
            } catch {
                if (formStatus) {
                    formStatus.textContent = "Email: shanjayvj@gmail.com";
                }
            }
        });
    }
});

