// Fade sections
const faders = document.querySelectorAll('.fade-up, .fade-left, .fade-right');
const appearOptions = { threshold: 0.2 };

const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('show');
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach(fader => appearOnScroll.observe(fader));


// Animate project cards
const projects = document.querySelectorAll('.project');
projects.forEach(project => appearOnScroll.observe(project));

// Project Filtering Functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));
    // Add active class to clicked button
    button.classList.add('active');
    
    const filterValue = button.getAttribute('data-filter');
    
    projectCards.forEach(project => {
      const categories = project.getAttribute('data-category');
      
      if (filterValue === 'all' || categories.includes(filterValue)) {
        project.classList.remove('hide');
        project.classList.add('show-filter');
      } else {
        project.classList.add('hide');
        project.classList.remove('show-filter');
      }
    });
  });
});



// Back-to-Top Button
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('show');
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('show')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
}

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('show');
    document.body.style.overflow = '';
  });
});

// Close menu when clicking outside or on overlay
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
    hamburger.classList.remove('active');
    navMenu.classList.remove('show');
    document.body.style.overflow = '';
  }
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu.classList.contains('show')) {
    hamburger.classList.remove('active');
    navMenu.classList.remove('show');
    document.body.style.overflow = '';
  }
});

// Close menu on window resize (mobile to desktop)
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    hamburger.classList.remove('active');
    navMenu.classList.remove('show');
    document.body.style.overflow = '';
  }
});



const darkModeToggle = document.getElementById('darkModeToggle');

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  
  // Change icon
  if (document.body.classList.contains('dark-mode')) {
    darkModeToggle.textContent = '☀️'; // Sun icon
  } else {
    darkModeToggle.textContent = '🌙'; // Moon icon
  }
});


const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
  button.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    this.appendChild(ripple);

    const rect = this.getBoundingClientRect();
    ripple.style.left = e.clientX - rect.left + 'px';
    ripple.style.top = e.clientY - rect.top + 'px';

    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  });
});



// Hide preloader when page fully loads
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  preloader.style.opacity = '0';
  preloader.style.transition = 'opacity 0.5s ease';

  setTimeout(() => {
    preloader.style.display = 'none';
  }, 500);
});

// Contact Form Functionality
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject') || 'New message from portfolio';
    const message = formData.get('message');
    
    // Basic validation
    if (!name || !email || !message) {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification('Please enter a valid email address.', 'error');
      return;
    }
    
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<span class="btn-text">Sending...</span><span class="btn-icon">⏳</span>';
    submitBtn.disabled = true;
    
    try {
      // Send SMS using multiple methods
      await sendSMSNotification(name, email, subject, message);
      
      showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
      contactForm.reset();
    } catch (err) {
      showNotification(err.message || 'Network error. Please try again later.', 'error');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

// SMS Notification Function
async function sendSMSNotification(name, email, subject, message) {
  // Your phone number (replace with your actual number)
  const phoneNumber = '+212694778840'; // Your number from the contact info
  
  // Method 1: Using EmailJS (Free and easy to set up)
  try {
    await sendViaEmailJS(name, email, subject, message, phoneNumber);
    return;
  } catch (error) {
    console.log('EmailJS method failed, trying alternative...');
  }
  
  // Method 2: Using Web3Forms (Free alternative)
  try {
    await sendViaWeb3Forms(name, email, subject, message, phoneNumber);
    return;
  } catch (error) {
    console.log('Web3Forms method failed, trying alternative...');
  }
  
  // Method 3: Using Twilio (Requires setup but most reliable)
  try {
    await sendViaTwilio(name, email, subject, message, phoneNumber);
    return;
  } catch (error) {
    console.log('Twilio method failed, trying alternative...');
  }
  
  // Method 4: Fallback - Open WhatsApp
  openWhatsApp(name, email, subject, message);
}

// Method 1: EmailJS (Free, easy setup)
async function sendViaEmailJS(name, email, subject, message, phoneNumber) {
  // You'll need to set up EmailJS and replace these IDs
  const serviceID = 'YOUR_EMAILJS_SERVICE_ID';
  const templateID = 'YOUR_EMAILJS_TEMPLATE_ID';
  const userID = 'YOUR_EMAILJS_USER_ID';
  
  if (serviceID === 'YOUR_EMAILJS_SERVICE_ID') {
    throw new Error('EmailJS not configured');
  }
  
  const templateParams = {
    to_name: 'Oussama',
    from_name: name,
    from_email: email,
    subject: subject,
    message: message,
    phone: phoneNumber
  };
  
  // Load EmailJS if not already loaded
  if (typeof emailjs === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    document.head.appendChild(script);
    await new Promise((resolve) => script.onload = resolve);
  }
  
  emailjs.init(userID);
  await emailjs.send(serviceID, templateID, templateParams);
}

// Method 2: Web3Forms (Free alternative)
async function sendViaWeb3Forms(name, email, subject, message, phoneNumber) {
  const accessKey = 'YOUR_WEB3FORMS_ACCESS_KEY';
  
  if (accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
    throw new Error('Web3Forms not configured');
  }
  
  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access_key: accessKey,
      name: name,
      email: email,
      subject: subject,
      message: `${message}\n\nFrom: ${name} (${email})`,
      to: 'oussamabenaddi64@gmail.com',
      phone: phoneNumber
    })
  });
  
  if (!response.ok) {
    throw new Error('Web3Forms submission failed');
  }
}

// Method 3: Twilio (Most reliable, requires setup)
async function sendViaTwilio(name, email, subject, message, phoneNumber) {
  const twilioAccountSid = 'YOUR_TWILIO_ACCOUNT_SID';
  const twilioAuthToken = 'YOUR_TWILIO_AUTH_TOKEN';
  const twilioPhoneNumber = 'YOUR_TWILIO_PHONE_NUMBER';
  
  if (twilioAccountSid === 'YOUR_TWILIO_ACCOUNT_SID') {
    throw new Error('Twilio not configured');
  }
  
  const smsMessage = `New message from ${name} (${email}):\nSubject: ${subject}\nMessage: ${message}`;
  
  const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/' + twilioAccountSid + '/Messages.json', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(twilioAccountSid + ':' + twilioAuthToken),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'To': phoneNumber,
      'From': twilioPhoneNumber,
      'Body': smsMessage
    })
  });
  
  if (!response.ok) {
    throw new Error('Twilio SMS failed');
  }
}

// Method 4: Fallback - Open WhatsApp
function openWhatsApp(name, email, subject, message) {
  const phoneNumber = '212694778840'; // Your number without + for WhatsApp
  const whatsappMessage = `New message from portfolio:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`;
  const encodedMessage = encodeURIComponent(whatsappMessage);
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  // Open WhatsApp in a new tab
  window.open(whatsappURL, '_blank');
  
  // Show notification
  showNotification('Opening WhatsApp to send your message...', 'info');
}

// Notification System
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
      <span class="notification-message">${message}</span>
    </div>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 400px;
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
}



const projectImages = document.querySelectorAll('.project img');

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset;

  projectImages.forEach((img, index) => {
    const speed = 0.2 + index * 0.05; // different speed for each image
    img.style.transform = `translateY(${scrollTop * speed}px)`;
  });
});
