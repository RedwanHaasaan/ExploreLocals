// Animation and Interaction Controller
class AnimationController {
  constructor() {
    this.init()
  }

  init() {
    this.setupScrollAnimations()
    this.setupNavigationToggle()
    this.setupFormHandling()
    this.setupSmoothScrolling()
    this.setupParallaxEffects()
    this.setupHoverEffects()
    this.setupLoadingAnimations()
  }

  // Scroll-triggered animations
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate")

          // Add stagger effect for child elements
          if (entry.target.classList.contains("stagger-parent")) {
            const children = entry.target.children
            Array.from(children).forEach((child, index) => {
              setTimeout(() => {
                child.classList.add("animate")
              }, index * 100)
            })
          }
        }
      })
    }, observerOptions)

    // Observe all elements with scroll animation classes
    const animatedElements = document.querySelectorAll(
      ".fade-in-scroll, .slide-in-left, .slide-in-right, .scale-in-scroll",
    )

    animatedElements.forEach((el) => observer.observe(el))
  }

  // Mobile navigation toggle
  setupNavigationToggle() {
    const hamburger = document.getElementById("hamburger")
    const navMenu = document.getElementById("nav-menu")

    if (hamburger && navMenu) {
      hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active")
        navMenu.classList.toggle("active")
      })

      // Close menu when clicking on a link
      const navLinks = navMenu.querySelectorAll(".nav-link")
      navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          hamburger.classList.remove("active")
          navMenu.classList.remove("active")
        })
      })

      // Close menu when clicking outside
      document.addEventListener("click", (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
          hamburger.classList.remove("active")
          navMenu.classList.remove("active")
        }
      })
    }
  }

  // Form handling and validation
  setupFormHandling() {
    const contactForm = document.getElementById("contactForm")

    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.handleFormSubmission(contactForm)
      })

      // Add real-time validation
      const inputs = contactForm.querySelectorAll("input, textarea, select")
      inputs.forEach((input) => {
        input.addEventListener("blur", () => this.validateField(input))
        input.addEventListener("input", () => this.clearFieldError(input))
      })
    }
  }

  validateField(field) {
    const value = field.value.trim()
    const isRequired = field.hasAttribute("required")
    let isValid = true
    let errorMessage = ""

    // Remove existing error styling
    this.clearFieldError(field)

    if (isRequired && !value) {
      isValid = false
      errorMessage = "This field is required"
    } else if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        isValid = false
        errorMessage = "Please enter a valid email address"
      }
    } else if (field.type === "tel" && value) {
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
      if (!phoneRegex.test(value.replace(/\s/g, ""))) {
        isValid = false
        errorMessage = "Please enter a valid phone number"
      }
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage)
    }

    return isValid
  }

  showFieldError(field, message) {
    field.classList.add("error")
    field.style.borderColor = "#ef4444"

    // Create or update error message
    let errorElement = field.parentNode.querySelector(".error-message")
    if (!errorElement) {
      errorElement = document.createElement("span")
      errorElement.className = "error-message"
      errorElement.style.color = "#ef4444"
      errorElement.style.fontSize = "0.875rem"
      errorElement.style.marginTop = "0.25rem"
      field.parentNode.appendChild(errorElement)
    }
    errorElement.textContent = message
  }

  clearFieldError(field) {
    field.classList.remove("error")
    field.style.borderColor = ""

    const errorElement = field.parentNode.querySelector(".error-message")
    if (errorElement) {
      errorElement.remove()
    }
  }

  handleFormSubmission(form) {
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())

    // Validate all fields
    const inputs = form.querySelectorAll("input[required], textarea[required]")
    let isFormValid = true

    inputs.forEach((input) => {
      if (!this.validateField(input)) {
        isFormValid = false
      }
    })

    if (!isFormValid) {
      this.showFormError("Please correct the errors above")
      return
    }

    // Show loading state
    const submitButton = form.querySelector(".form-submit")
    const originalText = submitButton.textContent
    submitButton.textContent = "Sending..."
    submitButton.disabled = true
    submitButton.classList.add("loading")

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      // Store form data in localStorage for thank you page
      localStorage.setItem(
        "formSubmission",
        JSON.stringify({
          ...data,
          submittedAt: new Date().toISOString(),
        }),
      )

      // Redirect to thank you page
      window.location.href = "thank-you.html"
    }, 2000)
  }

  showFormError(message) {
    const form = document.getElementById("contactForm")
    let errorElement = form.querySelector(".form-error")

    if (!errorElement) {
      errorElement = document.createElement("div")
      errorElement.className = "form-error"
      errorElement.style.cssText = `
                background-color: #fef2f2;
                border: 1px solid #fecaca;
                color: #dc2626;
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 1rem;
                animation: shake 0.5s ease-in-out;
            `
      form.insertBefore(errorElement, form.firstChild)
    }

    errorElement.textContent = message
    errorElement.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  // Smooth scrolling for anchor links
  setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]')

    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const targetId = link.getAttribute("href").substring(1)
        const targetElement = document.getElementById(targetId)

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      })
    })
  }

  // Parallax effects for hero sections
  setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll(".parallax")

    if (parallaxElements.length > 0) {
      window.addEventListener("scroll", () => {
        const scrolled = window.pageYOffset
        const rate = scrolled * -0.5

        parallaxElements.forEach((element) => {
          element.style.transform = `translateY(${rate}px)`
        })
      })
    }
  }

  // Enhanced hover effects
  setupHoverEffects() {
    // Add hover effects to cards
    const cards = document.querySelectorAll(".feature-card, .value-card, .destination-card")

    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-10px)"
        card.style.boxShadow = "0 20px 40px rgba(0,0,0,0.1)"
      })

      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0)"
        card.style.boxShadow = ""
      })
    })

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll(".btn")

    buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const ripple = document.createElement("span")
        const rect = button.getBoundingClientRect()
        const size = Math.max(rect.width, rect.height)
        const x = e.clientX - rect.left - size / 2
        const y = e.clientY - rect.top - size / 2

        ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255,255,255,0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `

        button.style.position = "relative"
        button.style.overflow = "hidden"
        button.appendChild(ripple)

        setTimeout(() => ripple.remove(), 600)
      })
    })
  }

  // Loading animations
  setupLoadingAnimations() {
    // Animate elements on page load
    window.addEventListener("load", () => {
      document.body.classList.add("loaded")

      // Animate navigation
      const nav = document.querySelector(".navbar")
      if (nav) {
        nav.style.transform = "translateY(-100%)"
        setTimeout(() => {
          nav.style.transition = "transform 0.5s ease"
          nav.style.transform = "translateY(0)"
        }, 100)
      }

      // Animate hero content
      const heroElements = document.querySelectorAll(".hero-title, .hero-subtitle, .hero-buttons")
      heroElements.forEach((element, index) => {
        element.style.opacity = "0"
        element.style.transform = "translateY(30px)"
        setTimeout(
          () => {
            element.style.transition = "all 0.8s ease"
            element.style.opacity = "1"
            element.style.transform = "translateY(0)"
          },
          200 + index * 200,
        )
      })
    })
  }

  // Utility methods
  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  throttle(func, limit) {
    let inThrottle
    return function () {
      const args = arguments
      
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  }
}

// Thank you page specific functionality
class ThankYouPage {
  constructor() {
    if (window.location.pathname.includes("thank-you.html")) {
      this.init()
    }
  }

  init() {
    this.displayConfirmationDetails()
    this.setupAnimations()
  }

  displayConfirmationDetails() {
    const confirmationInfo = document.getElementById("confirmationInfo")
    const submissionData = localStorage.getItem("formSubmission")

    if (confirmationInfo && submissionData) {
      const data = JSON.parse(submissionData)
      const submittedDate = new Date(data.submittedAt).toLocaleDateString()

      confirmationInfo.innerHTML = `
                <div class="confirmation-item">
                    <span class="confirmation-label">Contact:</span>
                    <span class="confirmation-value">${data.firstName} ${data.lastName}</span>
                </div>
                <div class="confirmation-item">
                    <span class="confirmation-label">Email:</span>
                    <span class="confirmation-value">${data.email}</span>
                </div>
                ${
                  data.phone
                    ? `
                <div class="confirmation-item">
                    <span class="confirmation-label">Phone:</span>
                    <span class="confirmation-value">${data.phone}</span>
                </div>
                `
                    : ""
                }
                ${
                  data.travelDates
                    ? `
                <div class="confirmation-item">
                    <span class="confirmation-label">Travel Dates:</span>
                    <span class="confirmation-value">${data.travelDates}</span>
                </div>
                `
                    : ""
                }
                ${
                  data.groupSize
                    ? `
                <div class="confirmation-item">
                    <span class="confirmation-label">Group Size:</span>
                    <span class="confirmation-value">${data.groupSize}</span>
                </div>
                `
                    : ""
                }
                <div class="confirmation-item">
                    <span class="confirmation-label">Subject:</span>
                    <span class="confirmation-value">${data.subject}</span>
                </div>
                ${
                  data.interests
                    ? `
                <div class="confirmation-item">
                    <span class="confirmation-label">Interests:</span>
                    <span class="confirmation-value">${data.interests}</span>
                </div>
                `
                    : ""
                }
                <div class="confirmation-item">
                    <span class="confirmation-label">Submitted:</span>
                    <span class="confirmation-value">${submittedDate}</span>
                </div>
            `

      // Clear the stored data
      localStorage.removeItem("formSubmission")
    }
  }

  setupAnimations() {
    // Animate success icon
    const successIcon = document.querySelector(".success-icon")
    if (successIcon) {
      setTimeout(() => {
        successIcon.classList.add("bounce-in")
      }, 500)
    }

    // Animate steps list
    const stepItems = document.querySelectorAll(".step-item")
    stepItems.forEach((item, index) => {
      item.style.opacity = "0"
      item.style.transform = "translateX(-20px)"
      setTimeout(
        () => {
          item.style.transition = "all 0.5s ease"
          item.style.opacity = "1"
          item.style.transform = "translateX(0)"
        },
        1000 + index * 200,
      )
    })
  }
}

// Add ripple animation keyframes to CSS
const rippleKeyframes = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`

// Inject keyframes into the document
const style = document.createElement("style")
style.textContent = rippleKeyframes
document.head.appendChild(style)

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new AnimationController()
  new ThankYouPage()
})

// Performance optimization: Reduce animations on slower devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
  document.documentElement.style.setProperty("--animation-duration", "0.3s")
}

// Add scroll progress indicator
const scrollProgress = document.createElement("div")
scrollProgress.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #6b8e23, #d2b48c);
    z-index: 9999;
    transition: width 0.1s ease;
`
document.body.appendChild(scrollProgress)

window.addEventListener("scroll", () => {
  const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
  scrollProgress.style.width = scrolled + "%"
})
