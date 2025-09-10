<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="portfolio.aspx.cs" Inherits="admin_panel.portfolio" %>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sarwad Hasan Siddiqui</title>

    <!-- Inter Font -->
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
      rel="stylesheet"
    />

    <link href="Content/styles.css" rel="stylesheet" />
  </head>

  <body class="body-base">
    <!-- Form wrapper for server-side controls -->
    <form runat="server">
    
    <!-- VANTA Background -->
    <div id="vanta-background" class="vanta-bg"></div>

    <!-- NAVBAR -->
    <nav class="navbar-container" id="main-navbar">
      <!-- Main Navbar Container -->
      <div class="navbar-content">
        <!-- Main Flex Container -->
        <div class="navbar-flex">
          <!-- LEFT SIDE: Brand/Logo -->
          <div class="navbar-brand">
            <a href="#home" class="brand-link">
              <!-- Brand Text -->
              <span class="brand-text">Sarwad Hasan Siddiqui</span>
            </a>
          </div>

          <!-- CENTER: Desktop Navigation Links -->
          <div class="desktop-nav">
            <!-- Home link removed, brand acts as Home -->
            <a href="#about" class="nav-link">
              About Me
              <span class="nav-underline"></span>
            </a>
            <a href="#timeline" class="nav-link">
              Timeline
              <span class="nav-underline"></span>
            </a>
            <a href="#skills" class="nav-link">
              Skills
              <span class="nav-underline"></span>
            </a>
            <a href="#projects" class="nav-link">
              Projects
              <span class="nav-underline"></span>
            </a>
            <a href="#experience" class="nav-link">
              Experience
              <span class="nav-underline"></span>
            </a>
            <a href="#blog" class="nav-link">
              Blog
              <span class="nav-underline"></span>
            </a>
            <a href="#contact" class="nav-link">
              Contact
              <span class="nav-underline"></span>
            </a>
          </div>

          <!-- RIGHT SIDE: Theme Toggle & Mobile Menu -->
          <div class="nav-actions">
            <!-- Theme Toggle Button -->
            <button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme">
              <!-- Sun Icon (visible in dark mode) -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="theme-icon sun-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <!-- Moon Icon (visible in light mode) -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="theme-icon moon-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </button>

            <!-- Mobile Menu Button (Hamburger) -->
            <button id="mobile-menu-toggle" class="mobile-menu-toggle" aria-label="Toggle mobile menu">
              <!-- Hamburger Icon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="hamburger-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Navigation Menu (Hidden by default) -->
      <div id="mobile-menu" class="mobile-menu hidden">
        <div class="mobile-menu-content">
          <!-- Mobile Navigation Links -->
          <nav class="mobile-nav-container">

            <a href="#about" class="mobile-nav-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mobile-nav-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              About Me
            </a>

            <a href="#timeline" class="mobile-nav-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mobile-nav-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Timeline
            </a>

            <a href="#skills" class="mobile-nav-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mobile-nav-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              Skills
            </a>

            <a href="#projects" class="mobile-nav-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mobile-nav-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v2M7 7h10"
                />
              </svg>
              Projects
            </a>

            <a href="#experience" class="mobile-nav-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mobile-nav-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v2M7 7h10"
                />
              </svg>
              Experience
            </a>

            <a href="#blog" class="mobile-nav-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mobile-nav-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              Blog
            </a>

            <a href="#contact" class="mobile-nav-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mobile-nav-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Contact
            </a>
          </nav>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Home Section -->
      <section id="home" class="home-section">
        <!-- Main Content Grid -->
        <div class="container content-grid">
          <div class="home-grid">
            <!-- Left Side: Text Content -->
            <div class="home-text-content">
              <!-- Status Badge -->
              <div class="status-badge">
                <div class="status-dot"></div>
                <span class="status-text"><%: GetSetting("status_text", "Available for Projects") %></span>
              </div>

              <!-- Name with Optimized Typography -->
              <div class="name-section">
                <h1 class="main-heading">
                  <div class="name-line">
                    <span class="slide-up text-gradient-primary" style="--delay: 0ms"><%: GetSetting("first_name", "SARWAD") %></span>
                  </div>
                  <div class="name-line">
                    <span class="slide-up name-middle" style="--delay: 100ms"><%: GetSetting("middle_name", "HASAN") %></span>
                  </div>
                  <div class="name-line">
                    <span class="slide-up text-gradient-secondary" style="--delay: 200ms"><%: GetSetting("last_name", "SIDDIQUI") %></span>
                  </div>
                </h1>
              </div>

              <!-- Role Description -->
              <div class="role-section">
                <!-- Main Tagline -->
                <div class="slide-up" style="--delay: 300ms">
                  <h2 class="tagline">
                    <%: GetSetting("hero_tagline", "Crafting Digital Experiences with") %>
                    <span class="text-accent-red"><%: GetSetting("hero_accent_1", "Innovation") %></span>
                    &
                    <span class="text-accent-orange"><%: GetSetting("hero_accent_2", "Precision") %></span>
                  </h2>
                </div>

                <!-- Description -->
                <div class="slide-up" style="--delay: 400ms">
                  <p class="description">
                    <%: HeroSection != null ? HeroSection.Content : "Full-stack developer transforming ideas into scalable, user-focused applications." %>
                  </p>
                </div>

                <!-- Specialization Tags -->
                <div class="skill-tags slide-up" style="--delay: 500ms">
                  <span class="skill-tag"><%: GetSetting("skill_tag_1", "Full Stack") %></span>
                  <span class="skill-tag"><%: GetSetting("skill_tag_2", "Python Enthusiast") %></span>
                  <span class="skill-tag"><%: GetSetting("skill_tag_3", "React Dev") %></span>
                  <span class="skill-tag"><%: GetSetting("skill_tag_4", "UI/UX") %></span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="action-buttons">
                <a href="#projects" class="btn-primary slide-up" style="--delay: 700ms" data-magnetic>
                  <span class="btn-content">
                    <span>Explore My Work</span>
                    <svg class="btn-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </a>

                <a href="#contact" class="btn-secondary slide-up" style="--delay: 750ms" data-magnetic>
                  <span class="btn-content">
                    <svg class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Let's Talk</span>
                  </span>
                </a>
              </div>
            </div>

            <!-- Right Side: Profile Display -->
            <div class="profile-display">
              <div class="profile-section-wrapper">
                <!-- Main Profile Container -->
                <div class="profile-container">
                  <!-- Optimized Rotating Ring -->
                  <div class="profile-ring"></div>
                  <div class="profile-ring-inner"></div>

                  <!-- Profile Image -->
                  <div class="profile-image-container">
                    <img
                      src="<%: GetSetting("profile_image", "./Content/assets/Sarwad.jpeg") %>"
                      alt="<%: GetSetting("full_name", "Sarwad Hasan Siddiqui") %>"
                      class="profile-image"
                      loading="lazy"
                      decoding="async"
                      data-magnetic
                    />
                  </div>

                </div>

                <!-- Social Links -->
                <div class="social-links">
                  <% if (SocialLinks != null && SocialLinks.Any()) { %>
                    <% foreach (var link in SocialLinks.Take(4)) { %>
                  <a
                    href="<%: link.URL %>"
                    target="_blank"
                    class="social-link"
                    data-magnetic
                    aria-label="<%: EncodeAttribute(link.Platform) %> Profile"
                  >
                    <% if (!string.IsNullOrEmpty(link.IconClass)) { %>
                    <i class="<%: link.IconClass %> social-icon"></i>
                    <% } else { %>
                    <svg class="social-icon" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0z"/>
                    </svg>
                    <% } %>
                  </a>
                    <% } %>
                  <% } else { %>
                  <!-- Fallback social links -->
                  <a
                    href="https://github.com/Rockstatata"
                    target="_blank"
                    class="social-link"
                    data-magnetic
                    aria-label="GitHub Profile"
                  >
                    <svg
                      class="social-icon"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                      />
                    </svg>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/sarwad-hasan-siddiqui/"
                    target="_blank"
                    class="social-link"
                    data-magnetic
                    aria-label="LinkedIn Profile"
                  >
                    <svg
                      class="social-icon"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                      />
                    </svg>
                  </a>

                  <a
                    href="mailto:sarwad015@gmail.com"
                    class="social-link"
                    data-magnetic
                    aria-label="Email Contact"
                  >
                    <svg
                      class="social-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </a>
                  <% } %>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Optimized Scroll Indicator -->
        <div class="scroll-indicator" data-magnetic>
          <span class="scroll-text">Scroll</span>
          <div class="scroll-mouse">
            <div class="scroll-wheel"></div>
          </div>
        </div>
      </section>

      <!-- About Section - Bento Grid Layout -->
      <section id="about" class="about-section">
        <div class="about-container">
          <!-- Section Header -->
          <div class="about-header">
            <h2 class="about-title">
              About Me
            </h2>
            <p class="about-description">
              Discover my journey, passions, and the technologies that drive my
              creative vision
            </p>
          </div>

          <!-- Bento Grid Layout -->
          <div class="bento-grid">
            <!-- 1. About Me - Education & Passion (Large Card) -->
            <div class="bento-card bento-card-large group">
              <div class="card-content">
                <div class="card-header">
                  <div>
                    <h3 class="card-title">
                      CSE Undergraduate
                    </h3>
                    <p class="card-subtitle">
                      3rd Year Student at KUET
                    </p>
                  </div>
                </div>

                <p class="card-text card-mb-8">
                  I'm a dedicated third-year
                  <span class="text-blue-600 text-semibold">Computer Science & Engineering student at KUET</span>
                  , currently working as a
                  <span class="text-purple-600 text-semibold">Software Developer Intern at Algosoft Technologies Ltd</span>.
                </p>

                <p class="text-large card-mb-8 text-relaxed text-gray-700">
                  My passion lies in
                  <span class="text-blue-700 text-semibold">building innovative solutions</span>
                  that solve real-world problems. I specialize in
                  <span class="text-cyan-700 text-semibold">full-stack development</span>
                  using the MERN stack, React Native, Python FastAPI, and
                  Laravel, combined with my growing expertise in
                  <span class="text-green-700 text-semibold">machine learning</span>
                  across Computer Vision, NLP, and Deep Learning.
                </p>

                <p class="text-large card-mb-8 text-relaxed text-gray-700">
                  I work with diverse databases including
                  <span class="text-orange-700 text-semibold">MongoDB, PostgreSQL, MySQL, and Redis</span>, creating performant data solutions. Despite occasional
                  challenges with CSS flexbox, I find immense satisfaction in
                  <span class="text-rose-700 text-semibold">building things from scratch and seeing them come to life</span>.
                </p>

                <p class="text-large card-mb-6 text-relaxed text-gray-700">
                  My ultimate dream is to work for
                  <span class="text-indigo-700 text-semibold">NASA</span>
                  and contribute to space exploration through technology. I
                  aspire to create solutions that make a meaningful impact,
                  especially in
                  <span class="text-violet-700 text-semibold">space exploration and scientific discoveries</span>.
                  <span class="text-amber-700 text-semibold text-italic">One day, I want my code to reach the stars.</span>
                </p>
              </div>

              <!-- Floating Elements -->
              <div class="floating-element floating-element-1"></div>
              <div class="floating-element floating-element-2"></div>
            </div>

            <!-- 2. What I Do - Tech Stack -->
            <div class="bento-card bento-card-wide group">
              <div class="card-header-mb-6">
                <span class="text-small text-gray-500 text-medium text-uppercase text-tracking-wider">What I Do</span>
                <h3 class="card-title card-mt-1">
                  Development Arsenal
                </h3>
              </div>

              <!-- Skills Grid -->
              <div class="skills-grid skills-mb-4">
                <div class="skill-item skill-item-wide">
                  <div class="skill-name text-blue-700">
                    React Native
                  </div>
                </div>
                <div class="skill-item">
                  <div class="skill-name text-cyan-700">
                    React/Next.js
                  </div>
                </div>
                <div class="skill-item">
                  <div class="skill-name text-pink-700">
                    UI/UX Design
                  </div>
                </div>
                <div class="skill-item skill-item-wide">
                  <div class="skill-name text-green-700">
                    FastAPI
                  </div>
                </div>

                <div class="skill-item skill-item-wide">
                  <div class="skill-name text-purple-700">
                    Machine Learning
                  </div>
                </div>
                <div class="skill-item">
                  <div class="skill-name text-orange-700">
                    Databases
                  </div>
                </div>
              </div>

              <p class="text-small text-gray-600">
                Building cross-platform applications with clean, modular, and
                maintainable code
              </p>
            </div>

            <!-- 3. Research Interest -->
            <div class="bento-card bento-card-wide group">
              <h3 class="card-title card-mb-4">
                Research Focus
              </h3>
              <div class="research-grid text-small">
                <div class="research-item research-item-wide">
                  <span class="research-name text-purple-700">Astronomical Data</span>
                </div>
                <div class="research-item">
                  <span class="research-name text-indigo-700">ML Algorithms</span>
                </div>
                <div class="research-item">
                  <span class="research-name text-teal-700">Deep Learning</span>
                </div>
                <div class="research-item research-item-wide">
                  <span class="research-name text-blue-700">Natural Language Processing</span>
                </div>
              </div>
              <p class="text-extra-small text-gray-500 research-mt-4">
                Exploring the intersection of space science and AI
              </p>
            </div>

            <!-- 4. Future Goals -->
            <div class="bento-card group">
              <div>
                <h3 class="card-title card-mb-4">
                  Future Goals
                </h3>
                <div class="goals-list">
                  <div class="goal-item">
                    <span class="goal-dot"></span>
                    <span class="goal-text">Master AI/ML</span>
                  </div>
                  <div class="goal-item">
                    <span class="goal-dot goal-dot-teal"></span>
                    <span class="goal-text goal-text-teal">Open Source</span>
                  </div>
                  <div class="goal-item">
                    <span class="goal-dot goal-dot-purple"></span>
                    <span class="goal-text goal-text-purple">Problem Solving</span>
                  </div>
                  <div class="goal-item">
                    <span class="goal-dot goal-dot-blue"></span>
                    <span class="goal-text goal-text-blue">Code in Space</span>
                  </div>
                </div>
                <p class="text-extra-small text-gray-500 goals-mt-4">
                  Creating impactful solutions for humanity
                </p>
              </div>
            </div>

            <!-- 7. Learning Journey -->
            <div class="bento-card bento-card-wider group">
              <div class="flex-items-start-justify-between learning-mb-6">
                <div>
                  <h3 class="card-title learning-mt-1">
                    Current Focus Areas
                  </h3>
                </div>
              </div>
              <div class="learning-grid">
                <div class="learning-item">
                  <div class="learning-title text-blue-700">
                    Advanced AI/ML
                  </div>
                  <div class="learning-desc">
                    Deep Learning & Neural Networks
                  </div>
                </div>
                <div class="learning-item">
                  <div class="learning-title text-green-700">
                    Cloud Architecture
                  </div>
                  <div class="learning-desc">
                    AWS, Docker, Kubernetes
                  </div>
                </div>
                <div class="learning-item">
                  <div class="learning-title text-orange-700">
                    Data Science
                  </div>
                  <div class="learning-desc">
                    Analytics & Visualization
                  </div>
                </div>
                <div class="learning-item">
                  <div class="learning-title text-purple-700">
                    Web3 & Blockchain
                  </div>
                  <div class="learning-desc">
                    Decentralized Applications
                  </div>
                </div>
                <div class="learning-item">
                  <div class="learning-title text-gray-700">
                    Cybersecurity
                  </div>
                  <div class="learning-desc">
                    Network Security & Penetration Testing
                  </div>
                </div>
                <div class="learning-item">
                  <div class="learning-title text-yellow-700">
                    IoT Development
                  </div>
                  <div class="learning-desc">
                    Smart Devices & Automation
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Timeline Section -->
      <section id="timeline" class="section">
        <div class="timeline-container">
          <div class="timeline-header">
            <h1 class="section-title">Timeline</h1>
            <p class="section-subtitle">
              My educational and professional journey
            </p>
          </div>
          
          <!-- Timeline Content -->
          <div class="timeline-content">
            <div class="timeline-line"></div>
            
            <% 
            if (AllTimeline != null && AllTimeline.Any()) 
            {
                bool isTop = true; // Alternate position
                foreach (var item in AllTimeline) 
                { 
            %>
            <!-- Timeline Item - <%: item.Title %> -->
            <div class="timeline-item" data-position="<%: isTop ? "top" : "bottom" %>">
              <div class="timeline-dot <%: item.Type.ToLower() == "current" || item.YearRange.Contains("Current") ? "timeline-dot-current" : "" %>"></div>
              <div class="timeline-card">
                <div class="timeline-year"><%: item.YearRange %></div>
                <div class="timeline-title"><%: item.Title %></div>
                <div class="timeline-location"><%: item.Location %></div>
                <div class="timeline-degree"><%: item.Description %></div>
              </div>
            </div>
            <% 
                isTop = !isTop; // Toggle position
                } 
            } 
            else 
            { 
                // Fallback content when no timeline data is available
            %>
            <!-- Timeline Item 1 -->
            <div class="timeline-item" data-position="top">
              <div class="timeline-dot"></div>
              <div class="timeline-card">
                <div class="timeline-year">2009-2015</div>
                <div class="timeline-title">BN College</div>
                <div class="timeline-location">Dhaka, Bangladesh</div>
                <div class="timeline-degree">Primary Education</div>
              </div>
            </div>
            
            <!-- Timeline Item 2 -->
            <div class="timeline-item" data-position="bottom">
              <div class="timeline-dot"></div>
              <div class="timeline-card">
                <div class="timeline-year">2015-2019</div>
                <div class="timeline-title">Adamjee Cantonment Public School</div>
                <div class="timeline-location">Dhaka, Bangladesh</div>
                <div class="timeline-degree">Secondary Education (SSC)</div>
              </div>
            </div>
            
            <!-- Timeline Item 3 -->
            <div class="timeline-item" data-position="top">
              <div class="timeline-dot"></div>
              <div class="timeline-card">
                <div class="timeline-year">2019-2022</div>
                <div class="timeline-title">Notre Dame College</div>
                <div class="timeline-location">Dhaka, Bangladesh</div>
                <div class="timeline-degree">Higher Secondary Certificate (HSC) - Science</div>
              </div>
            </div>
            
            <!-- Timeline Item 4 -->
            <div class="timeline-item" data-position="bottom">
              <div class="timeline-dot"></div>
              <div class="timeline-card">
                <div class="timeline-year">2023-Current</div>
                <div class="timeline-title">Khulna University of Engineering & Technology</div>
                <div class="timeline-location">Khulna, Bangladesh</div>
                <div class="timeline-degree">B.Sc. in Computer Science & Engineering</div>
              </div>
            </div>
            
            <!-- Timeline Item 5 -->
            <div class="timeline-item" data-position="top">
              <div class="timeline-dot timeline-dot-current"></div>
              <div class="timeline-card">
                <div class="timeline-year">2025-Current</div>
                <div class="timeline-title">Algosoft Technologies Ltd.</div>
                <div class="timeline-location">Dhaka, Bangladesh</div>
                <div class="timeline-degree">Software Developer Intern</div>
              </div>
            </div>
            <% } %>
          </div>
        </div>
      </section>

      <!-- Skills Section -->
      <section id="skills" class="section">
        <div class="skills-container">
          <div class="skills-header">
            <h1 class="section-title">Skills</h1>
            <p class="section-subtitle">
              Technologies and tools I work with
            </p>
          </div>
          
          <!-- Skills Grid -->
          <div class="skills-categories-grid">
            <% 
            if (SkillsByCategory != null && SkillsByCategory.Any()) 
            {
                var colorAccents = new[] { "text-accent-red", "text-accent-orange", "text-accent-red", "text-accent-orange" };
                int categoryIndex = 0;
                
                foreach (var category in SkillsByCategory) 
                { 
                    var accentColor = colorAccents[categoryIndex % colorAccents.Length];
            %>
            <!-- <%: category.Key %> Category -->
            <div class="glass-card skills-category">
              <div class="card-content">
                <div class="card-header">
                  <h3 class="card-title <%: accentColor %>"><%: category.Key %></h3>
                  <div class="category-icon">
                    <svg class="skill-category-icon" fill="currentColor" viewBox="0 0 24 24">
                      <% if (category.Key.ToLower().Contains("frontend") || category.Key.ToLower().Contains("ui")) { %>
                      <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 7.996c0-1.107.896-2.004 2.004-2.004s2.004.897 2.004 2.004S11.111 10 10.004 10 8 9.103 8 7.996zM14 18H6v-1.5l2-2 1.5 1.5L12 13l2 2v3z"/>
                      <% } else if (category.Key.ToLower().Contains("backend") || category.Key.ToLower().Contains("server")) { %>
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                      <% } else if (category.Key.ToLower().Contains("tool") || category.Key.ToLower().Contains("devops")) { %>
                      <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
                      <% } else { %>
                      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 6.5V7.5C15 8.1 14.6 8.5 14 8.5S13 8.1 13 7.5V6.5L12 6.5L11 6.5V7.5C11 8.1 10.6 8.5 10 8.5S9 8.1 9 7.5V6.5L3 7V9C3 10.1 3.9 11 5 11V17C5 18.1 5.9 19 7 19H9C10.1 19 11 18.1 11 17V11C11.4 11 11.7 10.8 11.9 10.4L12 10.5L12.1 10.4C12.3 10.8 12.6 11 13 11V17C13 18.1 13.9 19 15 19H17C18.1 19 19 18.1 19 17V11C20.1 11 21 10.1 21 9Z"/>
                      <% } %>
                    </svg>
                  </div>
                </div>
                <div class="skills-grid">
                  <% foreach (var skill in category.Value.Take(12)) { %>
                  <div class="skill-tag">
                    <% if (!string.IsNullOrEmpty(skill.SkillIcon)) { %>
                      <% if (skill.SkillIcon.StartsWith("http") || skill.SkillIcon.StartsWith("https")) { %>
                    <img src="<%: skill.SkillIcon %>" alt="<%: EncodeAttribute(skill.SkillName) %>" class="skill-icon">
                      <% } else if (skill.SkillIcon.StartsWith("devicon-")) { %>
                    <i class="<%: skill.SkillIcon %> skill-icon"></i>
                      <% } else { %>
                    <svg class="skill-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                      <% } %>
                    <% } else { %>
                    <svg class="skill-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    <% } %>
                    <span><%: skill.SkillName %></span>
                  </div>
                  <% } %>
                </div>
              </div>
            </div>
            <% 
                categoryIndex++;
                } 
            } 
            else 
            { 
                // Fallback content when no skills are available
            %>
            <!-- Frontend Category -->
            <div class="glass-card skills-category">
              <div class="card-content">
                <div class="card-header">
                  <h3 class="card-title text-accent-red">Frontend</h3>
                  <div class="category-icon">
                    <svg class="skill-category-icon" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 7.996c0-1.107.896-2.004 2.004-2.004s2.004.897 2.004 2.004S11.111 10 10.004 10 8 9.103 8 7.996zM14 18H6v-1.5l2-2 1.5 1.5L12 13l2 2v3z"/>
                    </svg>
                  </div>
                </div>
                <div class="skills-grid">
                  <div class="skill-tag">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="HTML" class="skill-icon">
                    <span>HTML</span>
                  </div>
                  <div class="skill-tag">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt="CSS" class="skill-icon">
                    <span>CSS</span>
                  </div>
                  <div class="skill-tag">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" class="skill-icon">
                    <span>JavaScript</span>
                  </div>
                  <div class="skill-tag">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" class="skill-icon">
                    <span>React</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Backend Category -->
            <div class="glass-card skills-category">
              <div class="card-content">
                <div class="card-header">
                  <h3 class="card-title text-accent-orange">Backend</h3>
                  <div class="category-icon">
                    <svg class="skill-category-icon" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                </div>
                <div class="skills-grid">
                  <div class="skill-tag">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" class="skill-icon">
                    <span>Node.js</span>
                  </div>
                  <div class="skill-tag">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" class="skill-icon">
                    <span>Python</span>
                  </div>
                  <div class="skill-tag">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" alt="MongoDB" class="skill-icon">
                    <span>MongoDB</span>
                  </div>
                  <div class="skill-tag">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" alt="MySQL" class="skill-icon">
                    <span>MySQL</span>
                  </div>
                </div>
              </div>
            </div>
            <% } %>
          </div>
        </div>
      </section>

      <!-- Projects Section -->
      <section id="projects" class="section projects-section">
        <div class="projects-container">
          <div class="projects-header">
            <h1 class="section-title">Projects</h1>
            <p class="section-subtitle">
              A collection of my most significant projects, showcasing my expertise in full-stack
              development, cloud architecture, and innovative problem-solving.
            </p>
          </div>

          <div class="projects-grid">
            <% 
                // Use FeaturedProjects if available, otherwise fall back to AllProjects
                var projectsToShow = FeaturedProjects;

                if (projectsToShow != null && projectsToShow.Any())
                {
                    foreach (var project in projectsToShow)
                    {
            %>
            <!-- Project Card - <%: project.Title %> -->
            <article class="glass-card project-card">
              <div class="project-image">
                <img src="<%: !string.IsNullOrEmpty(project.ImagePath) ? project.ImagePath : "https://picsum.photos/600/300?random=" + project.Id %>" 
                     alt="<%: EncodeAttribute(project.Title) %>" 
                     class="project-img" />
                <% if (!string.IsNullOrEmpty(project.Status) && project.Status.ToLower() != "completed") { %>
                <div class="project-badge"><%: project.Status %></div>
                <% } %>
              </div>
              <div class="project-content">
                <h3 class="project-title"><%: project.Title %></h3>
                <div class="project-meta">
                  <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <span class="project-year"><%: project.ProjectYear.HasValue ? project.ProjectYear.Value.ToString() : DateTime.Now.Year.ToString() %></span>
                </div>
                <p class="project-desc"><%: TruncateText(project.Description, 120) %></p>

                <% if (!string.IsNullOrEmpty(project.Technologies)) { %>
                <div class="project-tags">
                  <% 
                  var technologies = GetTechnologies(project.Technologies);
                  var colorClasses = new[] { "tag-blue", "tag-orange", "tag-teal", "tag-red", "tag-purple", "tag-gray", "tag-cyan", "tag-green" };
                  

                  for (int i = 0; i < technologies.Length && i < 8; i++) 
                  { 
                      var colorClass = colorClasses[i % colorClasses.Length];
                  %>
                  <span class="tag <%: colorClass %>"><%: technologies[i] %></span>
                  <% } %>
                </div>
                <% } %>

                <div class="project-actions">
                  <% if (!string.IsNullOrEmpty(project.SourceLink) && project.SourceLink != "#") { %>
                  <a class="btn btn-outline" href="<%: project.SourceLink %>" target="_blank" rel="noopener noreferrer">
                    <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                    </svg>
                    Source
                  </a>
                  <% } %>
                  
                  <% if (!string.IsNullOrEmpty(project.DemoLink) && project.DemoLink != "#") { %>
                  <a class="btn btn-outline" href="<%: project.DemoLink %>" target="_blank" rel="noopener noreferrer">
                    <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15,3 21,3 21,9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    Demo
                  </a>
                  <% } %>
                  
                  <% // If no links available, show a placeholder %>
                  <% if ((string.IsNullOrEmpty(project.SourceLink) || project.SourceLink == "#") && 
                         (string.IsNullOrEmpty(project.DemoLink) || project.DemoLink == "#")) { %>
                  <a class="btn btn-outline" href="#" onclick="return false;" style="opacity: 0.6; cursor: not-allowed;">
                    <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15,3 21,3 21,9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    Coming Soon
                  </a>
                  <% } %>
                </div>
              </div>
            </article>
            <% 
                } 
            } 
            else 
            { 
                // Fallback content when no projects are available
            %>
            <% } %>
          </div>
        </div>
      </section>

      <!-- Experience Section -->
      <section id="experience" class="section projects-section">
        <div class="projects-container">
          <div class="projects-header">
            <h1 class="section-title">Experience</h1>
            <p class="section-subtitle">
              My professional journey and work experience in software development and technology.
            </p>
          </div>

          <div class="projects-grid">
            <% 
                if (Experiences != null && Experiences.Any())
                {
                    foreach (var experience in Experiences)
                    {
            %>
            <!-- Experience Card - <%: experience.Company %> -->
            <article class="glass-card project-card">
              <div class="project-content">
                <h3 class="project-title"><%: experience.Company %></h3>
                <div class="project-meta">
                  <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <span class="project-year"><%: experience.Position %></span>
                </div>
                <p class="project-desc"><%: !string.IsNullOrEmpty(experience.Duration) ? experience.Duration : "Duration not specified" %></p>

                <% if (!string.IsNullOrEmpty(experience.Description)) { %>
                <p class="project-desc"><%: experience.Description %></p>
                <% } %>

                <% if (!string.IsNullOrEmpty(experience.Responsibilities)) { %>
                <div class="project-tags">
                  <% 
                  var responsibilities = experience.Responsibilities.Split(new[] { '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries);
                  var colorClasses = new[] { "tag-blue", "tag-orange", "tag-teal", "tag-red", "tag-purple", "tag-gray", "tag-cyan", "tag-green" };
                  
                  for (int i = 0; i < responsibilities.Length && i < 8; i++) 
                  { 
                      var colorClass = colorClasses[i % colorClasses.Length];
                      var responsibility = responsibilities[i].Trim();
                      // Take only first few words of each responsibility for tags
                      var shortResponsibility = responsibility.Length > 25 ? responsibility.Substring(0, 25) + "..." : responsibility;
                  %>
                  <span class="tag <%: colorClass %>"><%: shortResponsibility %></span>
                  <% } %>
                </div>
                <% } %>
              </div>
            </article>
            <% 
                } 
            } 
            else 
            { 
                // Fallback content when no experiences are available
            %>
            <!-- Fallback Experience Card 1 -->
            <article class="glass-card project-card">
              <div class="project-content">
                <h3 class="project-title">Algosoft Technologies Ltd.</h3>
                <div class="project-meta">
                  <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <span class="project-year">Software Developer Intern</span>
                </div>
                <p class="project-desc">2025 - Current</p>
                <p class="project-desc">Working as a Software Developer Intern, focusing on web development and application architecture.</p>
                
                <div class="project-tags">
                  <span class="tag tag-blue">Web Development</span>
                  <span class="tag tag-orange">ASP.NET</span>
                  <span class="tag tag-teal">Team Collaboration</span>
                  <span class="tag tag-red">Best Practices</span>
                </div>
              </div>
            </article>

            <!-- Fallback Experience Card 2 -->
            <article class="glass-card project-card">
              <div class="project-content">
                <h3 class="project-title">Freelance Work</h3>
                <div class="project-meta">
                  <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <span class="project-year">Full Stack Developer</span>
                </div>
                <p class="project-desc">2023 - Present</p>
                <p class="project-desc">Working on various freelance projects, developing websites and applications for clients.</p>
                
                <div class="project-tags">
                  <span class="tag tag-purple">Responsive Design</span>
                  <span class="tag tag-gray">Client Management</span>
                  <span class="tag tag-cyan">Database Design</span>
                  <span class="tag tag-green">API Development</span>
                </div>
              </div>
            </article>
            <% } %>
          </div>
        </div>
      </section>

      <!-- Blog Section -->
      <section id="blog" class="section blog-section">
        <div class="container">
          <div class="blog-container">
            <div class="blog-header">
              <div class="blog-title-container">
                <h1 class="section-title">Blogs</h1>
              </div>
              <p class="section-subtitle">
                Insights and stories from my journey as a developer.
              </p>
            </div>
          </div>

          <!-- Horizontal Scroll Container -->
          <div class="blog-scroll-container">
            <!-- Scroll Controls -->
            <div class="scroll-controls">
              <button class="scroll-btn scroll-btn-left" id="scrollLeft">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <button class="scroll-btn scroll-btn-right" id="scrollRight">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>

            <!-- Scrollable Blog Grid -->
            <div class="blog-grid-scroll" id="blogGrid">
              <% 
              if (RecentBlogPosts != null && RecentBlogPosts.Any()) 
              {
                  foreach (var post in RecentBlogPosts) 
                  { 
              %>
              <!-- Blog Post - <%: post.Title %> -->
              <article class="blog-card glass-card">
                <div class="blog-content">
                  <% if (!string.IsNullOrEmpty(post.Categories)) { %>
                  <div class="blog-categories">
                    <% 
                    var categories = post.Categories.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries);
                    var categoryClasses = new[] { "programming", "frontend", "development", "cloud" };
                    
                    for (int i = 0; i < categories.Length && i < 2; i++) 
                    { 
                        var categoryClass = categoryClasses[i % categoryClasses.Length];
                    %>
                    <span class="blog-category <%: categoryClass %>"><%: categories[i].Trim() %></span>
                    <% } %>
                  </div>
                  <% } %>
                  
                  <% if (!string.IsNullOrEmpty(post.Tags)) { %>
                  <div class="blog-tags">
                    <% 
                    var tags = post.Tags.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries);
                    
                    for (int i = 0; i < tags.Length && i < 4; i++) 
                    { 
                    %>
                    <span class="blog-tag"><%: tags[i].Trim() %></span>
                    <% } %>
                  </div>
                  <% } %>

                  <h3 class="blog-post-title"><%: TruncateText(post.Title, 80) %></h3>
                  <p class="blog-excerpt"><%: TruncateText(!string.IsNullOrEmpty(post.Excerpt) ? post.Excerpt : post.Content, 100) %></p>

                  <div class="blog-meta">
                    <span class="blog-date"><%: FormatDate(post.PublishDate, "MMM d, yyyy") %></span>
                    <span class="blog-separator">•</span>
                    <span class="blog-read-time"><%: post.ReadTime.HasValue ? post.ReadTime.Value.ToString() : "3" %> min read</span>
                    <div class="blog-arrow">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M7 17l9.2-9.2M17 17V7H7"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </article>
              <% 
                  } 
              } 
              else 
              { 
                  // Fallback content when no blog posts are available
              %>
              <!-- Fallback Blog Post 1 -->
              <article class="blog-card glass-card">
                <div class="blog-content">
                  <div class="blog-categories">
                    <span class="blog-category programming">Programming</span>
                    <span class="blog-category frontend">Frontend</span>
                  </div>
                  
                  <div class="blog-tags">
                    <span class="blog-tag">development</span>
                    <span class="blog-tag">website</span>
                    <span class="blog-tag">Css</span>
                  </div>

                  <h3 class="blog-post-title">Building Modern Web Applications with ASP.NET</h3>
                  <p class="blog-excerpt">Exploring the latest features and best practices for developing scalable web applications using ASP.NET Web Forms and modern techniques.</p>

                  <div class="blog-meta">
                    <span class="blog-date"><%: FormatDate(DateTime.Now, "MMM d, yyyy") %></span>
                    <span class="blog-separator">•</span>
                    <span class="blog-read-time">4 min read</span>
                    <div class="blog-arrow">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M7 17l9.2-9.2M17 17V7H7"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </article>

              <!-- Fallback Blog Post 2 -->
              <article class="blog-card glass-card">
                <div class="blog-content">
                  <div class="blog-categories">
                    <span class="blog-category development">Development</span>
                    <span class="blog-category cloud">Cloud and Database</span>
                  </div>
                  
                  <div class="blog-tags">
                    <span class="blog-tag">Database</span>
                    <span class="blog-tag">SQL Server</span>
                    <span class="blog-tag">Architecture</span>
                  </div>

                  <h3 class="blog-post-title">Database Design Patterns for Portfolio Applications</h3>
                  <p class="blog-excerpt">Best practices for designing and implementing database schemas for portfolio and content management systems.</p>

                  <div class="blog-meta">
                    <span class="blog-date"><%: FormatDate(DateTime.Now.AddDays(-7), "MMM d, yyyy") %></span>
                    <span class="blog-separator">•</span>
                    <span class="blog-read-time">6 min read</span>
                    <div class="blog-arrow">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M7 17l9.2-9.2M17 17V7H7"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </article>

              <!-- Fallback Blog Post 3 -->
              <article class="blog-card glass-card">
                <div class="blog-content">
                  <div class="blog-categories">
                    <span class="blog-category programming">Programming</span>
                  </div>
                  
                  <div class="blog-tags">
                    <span class="blog-tag">C#</span>
                    <span class="blog-tag">Web Development</span>
                    <span class="blog-tag">Best Practices</span>
                  </div>

                  <h3 class="blog-post-title">C# Development Tips for Aspiring Developers</h3>
                  <p class="blog-excerpt">Essential tips and tricks for writing clean, efficient C# code and building robust applications.</p>

                  <div class="blog-meta">
                    <span class="blog-date"><%: FormatDate(DateTime.Now.AddDays(-14), "MMM d, yyyy") %></span>
                    <span class="blog-separator">•</span>
                    <span class="blog-read-time">5 min read</span>
                    <div class="blog-arrow">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M7 17l9.2-9.2M17 17V7H7"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </article>
              <% } %>
            </div>

            <!-- Scroll Indicator -->
            <div class="scroll-indicator-dots">
              <% 
              var totalPosts = (RecentBlogPosts != null && RecentBlogPosts.Any()) ? RecentBlogPosts.Count : 3;
              for (int i = 0; i < totalPosts; i++) 
              { 
              %>
              <div class="scroll-dot <%: i == 0 ? "active" : "" %>" data-index="<%: i %>"></div>
              <% } %>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section id="contact" class="section contact-section">
        <div class="container">
          <div class="contact-container">
            <!-- Contact Header -->
            <div class="contact-header">
              <span class="contact-subtitle">REACH OUT TO ME</span>
              <h1 class="section-title contact-title">CONTACT</h1>
            </div>

            <!-- Contact Content Grid -->
            <div class="contact-content-grid">
              <!-- Left Side: Map and Contact Info -->
              <div class="contact-left">
                <!-- Google Map -->
                <div class="contact-map-section">
                  <h3 class="contact-section-title">My Location</h3>
                  <div class="contact-map-container">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.41658088928!2d89.49616848665764!3d22.898000667506604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ff9b795e158f77%3A0x74faf2f9bc27ba7f!2sAmar%20Ekushey%20Hall!5e0!3m2!1sen!2sin!4v1756143304401!5m2!1sen!2sin"
                      width="100%"
                      height="300"
                      style="border:0;"
                      allowfullscreen=""
                      loading="lazy"
                      referrerpolicy="no-referrer-when-downgrade"
                      title="My Location - Khulna, Bangladesh">f
                    </iframe>
                  </div>
                </div>

              </div>

              <!-- Right Side: Contact Form -->
              <div class="contact-right">
                <div class="contact-form-section">
                  <h3 class="contact-section-title">Contact Form</h3>
                  <div class="contact-form" id="contactFormDiv">
                    <!-- Name and Email Row -->
                    <div class="form-row">
                      <div class="form-group">
                        <asp:TextBox 
                          ID="txtName" 
                          runat="server" 
                          placeholder="Your Name *" 
                          CssClass="form-input"
                          ClientIDMode="Static"
                        />
                      </div>
                      <div class="form-group">
                        <asp:TextBox 
                          ID="txtEmail" 
                          runat="server" 
                          TextMode="Email"
                          placeholder="Your Email *" 
                          CssClass="form-input"
                          ClientIDMode="Static"
                        />
                      </div>
                    </div>

                    <!-- Subject -->
                    <div class="form-group">
                      <asp:TextBox 
                        ID="txtSubject" 
                        runat="server" 
                        placeholder="Your Subject..." 
                        CssClass="form-input"
                        ClientIDMode="Static"
                      />
                    </div>

                    <!-- Message -->
                    <div class="form-group">
                      <asp:TextBox 
                        ID="txtMessage" 
                        runat="server" 
                        TextMode="MultiLine"
                        Rows="6"
                        placeholder="Your message..." 
                        CssClass="form-textarea"
                        ClientIDMode="Static"
                      />
                    </div>

                    <!-- Submit Button -->
                    <asp:Button 
                      ID="btnSubmitContact" 
                      runat="server" 
                      Text="SEND" 
                      CssClass="contact-submit-btn" 
                      OnClick="SubmitContact_Click"
                      ClientIDMode="Static"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Social Media Links -->
            <div class="contact-social-section">
              <div class="social-links-contact">
                <!-- GitHub -->
                <a href="https://github.com/Rockstatata" target="_blank" rel="noopener noreferrer" class="social-link-contact" aria-label="GitHub">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>

                <!-- LinkedIn -->
                <a href="https://linkedin.com/in/sarwad-hasan-siddiqui/" target="_blank" rel="noopener noreferrer" class="social-link-contact" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>

                <!-- Twitter -->
                <a href="https://x.com/Shspianto" target="_blank" rel="noopener noreferrer" class="social-link-contact" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </a>

                <!-- Instagram -->
                <a href="https://instagram.com/pianto._" target="_blank" rel="noopener noreferrer" class="social-link-contact" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                <!-- Facebook -->
                <a href="https://facebook.com/Hasa.Sarwad07" target="_blank" rel="noopener noreferrer" class="social-link-contact" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer Section -->
      <footer class="footer">
        <div class="container">
          <div class="footer-content">
            <p class="footer-text">
              © <%: CurrentYear %> | All rights reserved | This website is developed by 
              <a href="https://github.com/Rockstatata" target="_blank" rel="noopener noreferrer" class="footer-link">
                Sarwad Hasan Siddiqui
              </a>
            </p>
          </div>
        </div>
      </footer>
    </main>
    
    </form><!-- End of server form -->

    <!-- Load JavaScript -->
    <script src="./Scripts/script.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js"></script>
  </body>
</html>
