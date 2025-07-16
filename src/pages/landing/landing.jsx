import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import herosection from '../../assets/herosect.jpg';
import styles from './landing.module.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Login from '../login/login.jsx';
import CompanyRegisterForm from '../register/Registrationform.jsx';





const Landing = () => {
  const features = [
    {
      title: "Employee Management",
      description: "Easily manage employee profiles, define roles, and track performance — all in one centralized dashboard.",
      icon: "bi bi-people-fill"
    },
    {
      title: "Task Management",
      description: "Streamline task assignment, progress tracking, and team collaboration with real-time updates.",
      icon: "bi bi-list-task"
    },
    {
      title: "Attendance Tracking",
      description: "Monitor employee attendance automatically with detailed time logs, trends, and reporting tools.",
      icon: "bi bi-clock-fill"
    },
    {
      title: "Leave Management",
      description: "Simplify leave requests, approvals, and balance tracking through a user-friendly interface.",
      icon: "bi bi-calendar-check"
    },
    {
      title: "Check-In & Check-Out",
      description: "Enable employees to log their daily check-ins and check-outs with timestamps for accurate work-hour tracking.",
      icon: "bi bi-box-arrow-in-right"
    },
    {
      title: "Secure Login & Roles",
      description: "Protect sensitive data using secure authentication and role-based access control.",
      icon: "bi bi-shield-lock-fill"
    }
  ];

  const testimonials = [
    {
      name: "John Doe",
      role: "HR Manager",
      quote: "WorkNest has transformed our team management. It's intuitive and saves us hours weekly!",

    },
    {
      name: "Sarah Lee",
      role: "Small Business Owner",
      quote: "A cost-effective HR solution that delivers everything we need for our small business.",
    },
    {
      name: "Michael Chen",
      role: "Team Lead",
      quote: "Task and attendance tracking keep our team aligned and productive. Highly recommend!",
    }
  ];

  const pricingPlans = [
    {
      plan: "Basic",
      price: "$29",
      features: ["Up to 10 Employees", "Employee Management", "Task Management", "Basic Support"],
      buttonText: "Choose Basic",
      isPopular: false
    },
    {
      plan: "Pro",
      price: "$79",
      features: ["Up to 50 Employees", "All Basic Features", "Attendance Tracking", "Leave Management", "Priority Support"],
      buttonText: "Choose Pro",
      isPopular: true
    },
    {
      plan: "Enterprise",
      price: "Custom",
      features: ["Unlimited Employees", "All Pro Features", "Custom Integrations", "Dedicated Support", "Advanced Analytics"],
      buttonText: "Contact Us",
      isPopular: false
    }
  ];
  // const navigate = useNavigate();

  return (
    <div>
      <nav>
        <div className={styles.navbar}>
          <div className={styles.navbarbrand}>
            <a href="/" className={styles.brand}>WorkNest</a>
          </div>
          <div className={styles.navlinks}>
            <a href="#about" className={styles.navlinks}>About</a>
            <a href="#features" className={styles.navlinks}>Features</a>
            <a href="#pricing" className={styles.navlinks}>Pricing</a>
            <a href="#testimonials" className={styles.navlinks}>Testimonials</a>
            <div className={styles.navbutton}>

              <Link to="./Login" className={styles.getstarted}>Login</Link>

            </div>
          </div>
        </div>
      </nav>



      {/* Hero Section */}
      <section className={styles.herosection}>
        <h1>Empower Your HR with WorkNest</h1>
        <p>Streamline employee management, boost productivity, and simplify HR tasks with our all-in-one solution.</p>
        <div className={styles.herobtnwrapper}>
          <Link to="/CompanyRegisterForm" className={styles.registorcompany}>
            <p>Register Your Company</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </Link>
        </div>

      </section>



      {/* About Us */}
      <section id='about' className={styles.about}>
        <h2 className="text-center mb-5 fw-bold">About WorkNest</h2>
        <div className={`container ${styles.aboutcontainer}`}>
          <div className={styles.aboutbg}>
            <img src={herosection} alt="" width={"100%"} height={"100%"} />
          </div>
          <div className={styles.aboutcontent} >
            <h3 className="fw-bold">Our Mission</h3>
            <p className="text-muted">
              WorkNest is a final-year project by student developers, designed to simplify HR for small and medium-sized businesses.
              We provide intuitive tools for employee onboarding, task management, and more, helping teams grow efficiently.
            </p>
            <Link to="/CompanyRegisterForm" className={`btn-outline-secondary btn mt-3 btn-lg ${styles.joinbtn}`}>Join Us Today</Link>
          </div>
        </div>
      </section>



      {/* Features */}
      <section id="features" className={styles.features}>
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Why Choose WorkNest?</h2>
          <div className="row g-4">
            {features.map((feature, index) => (
              <div className="col-md-4" key={index}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body text-center">
                    <i className={`${feature.icon} mb-3 ${styles['hrmpro-feature-icon']}`} />
                    <h5 className="card-title fw-bold">{feature.title}</h5>
                    <p className="card-text text-muted">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>




      {/* Testimonials */}
      <section id="testimonials" className={styles.testimonials}>
        <div className="container py-5">
          <h2 className="text-center mb-5 fw-bold">What Our Users Say</h2>

          <div id="testimonialCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">

              {testimonials.map((testimonial, index) => (
                <div className={`carousel-item text-center ${index === 0 ? 'active' : ''}`} key={index}>
                  <div className={`mx-auto p-4 shadow-sm ${styles.testimonialCard}`}>
                    <img
                      src={testimonial.img}
                      alt={testimonial.name}
                      className="rounded-circle mb-4"
                      style={{ width: '90px', height: '90px', objectFit: 'cover' }}
                    />
                    <p className="fst-italic text-muted">
                      <i className="bi bi-quote quote-icon fs-3 me-2 text-primary"></i>
                      {testimonial.quote}
                    </p>
                    <h5 className="fw-bold mt-4">{testimonial.name}</h5>
                    <p className="text-muted">{testimonial.role}</p>
                  </div>
                </div>
              ))}

            </div>

            <button
              className="carousel-control-prev dark-carousel-btn"
              type="button"
              data-bs-target="#testimonialCarousel"
              data-bs-slide="prev"
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <button
              className="carousel-control-next dark-carousel-btn"
              type="button"
              data-bs-target="#testimonialCarousel"
              data-bs-slide="next"
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </section>


      {/* Pricing */}
      <section id="pricing" className={styles.pricing}>
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Pricing Plans</h2>
          <div className="row g-4">
            {pricingPlans.map((pricing, index) => (
              <div className="col-md-4" key={index}>
                <div className={`card h-100 shadow-sm ${pricing.isPopular ? styles['hrmpro-popular-card'] : ''}`}>
                  {pricing.isPopular && (
                    <span className={styles['hrmpro-popular-badge']}>Most Popular</span>
                  )}
                  <div className="card-body text-center">
                    <h5 className="card-title fw-bold">{pricing.plan}</h5>
                    <h3 className="mb-4">{pricing.price}<small className="text-muted">/mo</small></h3>
                    <ul className="list-unstyled text-muted">
                      {pricing.features.map((feature, idx) => (
                        <li key={idx} className="mb-2"><i className="bi bi-check-circle-fill me-2" />{feature}</li>
                      ))}
                    </ul>
                    <Link to="/register-company" className={pricing.isPopular ? styles['hrmpro-popular-button'] : styles['hrmpro-outline-button']}>{pricing.buttonText}</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-3 ${styles['hrmpro-footer']}`}>
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h5 className="fw-bold">WorkNest</h5>
              <p>Simplifying HR management for businesses of all sizes.</p>
            </div>
            <div className="col-md-4">
              <h5 className="fw-bold">Links</h5>
              <ul className="list-unstyled gap-3 d-flex flex-wrap">
                <li><a href="#about" className="text-decoration-none">About</a></li>
                <li><a href="#features" className="text-decoration-none">Features</a></li>
                <li><a href="#pricing" className="text-decoration-none">Pricing</a></li>
                <li><a href="#testimonials" className="text-decoration-none">Testimonials</a></li>
              </ul>
            </div>
            <div className="col-md-4">
              <h5 className="fw-bold">Contact</h5>
              <p>Email: support@WorkNest.com</p>
              <p>Phone: (123) 456-7890</p>
            </div>
          </div>
          <div className="text-center mt-4">
            <p>© 2025 WorkNest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;