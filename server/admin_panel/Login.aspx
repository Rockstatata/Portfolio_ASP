<%@ Page Title="Admin Login" Language="C#" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="admin_panel.Login" %>

<!DOCTYPE html>
<html lang="en">
<head runat="server">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Admin Login - Portfolio Admin Panel</title>
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    
    <!-- FontAwesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Admin Styles -->
    <link href="~/Content/adminstyles.css" rel="stylesheet" type="text/css" />
    
    <!-- Three.js and Vanta.js for animated background -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/tengbao/vanta/dist/vanta.net.min.js"></script>
</head>
<body class="login-body">
    <!-- Vanta.js Background -->
    <div class="vanta-bg" id="vanta-bg"></div>
    
    <!-- Success Popup Overlay -->
    <div id="successPopupOverlay" class="success-popup-overlay hidden">
        <div class="success-popup">
            <div class="success-popup-icon">
                <i class="fas fa-check"></i>
            </div>
            <h2 class="success-popup-title">Login Successful!</h2>
            <p class="success-popup-message" id="successPopupMessage">Redirecting to dashboard...</p>
            <div class="success-popup-loading">
                <div class="loading-spinner"></div>
                <span>Please wait...</span>
            </div>
        </div>
    </div>
    
    <form id="form1" runat="server">
        <div class="login-container">
            <div class="login-card">
                <!-- Header -->
                <div class="login-header">
                    <div class="login-logo">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <h1 class="login-title">Admin Portal</h1>
                    <p class="login-subtitle">Sign in to manage your portfolio</p>
                </div>
                
                <!-- Error Message -->
                <div id="errorMessage" class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span id="errorText">Invalid credentials. Please try again.</span>
                </div>
                
                <!-- Success Message -->
                <div id="successMessage" class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <span id="successText">Login successful! Redirecting...</span>
                </div>
                
                <!-- Login Form -->
                <div class="login-form">
                    <div class="form-group">
                        <label for="txtUsername" class="form-label">Username</label>
                        <div class="input-wrapper">
                            <asp:TextBox ID="txtUsername" runat="server" 
                                        CssClass="form-input" 
                                        placeholder="Enter your username" 
                                        autocomplete="username" />
                            <i class="fas fa-user input-icon"></i>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="txtPassword" class="form-label">Password</label>
                        <div class="input-wrapper">
                            <asp:TextBox ID="txtPassword" runat="server" 
                                        TextMode="Password" 
                                        CssClass="form-input" 
                                        placeholder="Enter your password" 
                                        autocomplete="current-password" />
                            <i class="fas fa-lock input-icon"></i>
                        </div>
                    </div>
                    
                    <asp:Button ID="btnLogin" runat="server" 
                               Text="Sign In" 
                               CssClass="login-btn" 
                               OnClick="btnLogin_Click" 
                               OnClientClick="return handleLoginClick();" />
                </div>
                
                <!-- Footer -->
                <div class="login-footer">
                    <p class="login-footer-text">
                        <i class="fas fa-shield-alt"></i>
                        Secure admin access
                    </p>
                </div>
            </div>
        </div>
        
        <script type="text/javascript">
            // Initialize Vanta.js background with improved configuration
            function initVantaBackground() {
                if (typeof VANTA === 'undefined' || typeof THREE === 'undefined') {
                    setTimeout(initVantaBackground, 100);
                    return;
                }

                try {
                    // Destroy existing instance if any
                    if (window.vantaEffect) {
                        window.vantaEffect.destroy();
                    }

                    // Check device capabilities for optimal performance
                    const isMobile = window.innerWidth < 768;
                    const isLowPerformance = navigator.hardwareConcurrency < 4 || 
                                           navigator.deviceMemory < 4 ||
                                           window.matchMedia('(prefers-reduced-motion: reduce)').matches;

                    // Initialize with optimized settings
                    window.vantaEffect = VANTA.NET({
                        el: "#vanta-bg",
                        mouseControls: !isMobile,
                        touchControls: isMobile,
                        gyroControls: false,
                        minHeight: 200.00,
                        minWidth: 200.00,
                        scale: isMobile ? 0.7 : 1.0,
                        scaleMobile: 0.6,
                        color: 0xd14d72, // Portfolio primary color: rgb(209, 77, 114)
                        backgroundColor: 0x1a1625, // Portfolio background: #1a1625
                        points: isMobile || isLowPerformance ? 5 : 8,
                        maxDistance: isMobile ? 15 : 20,
                        spacing: isMobile ? 22 : 18,
                        showDots: !isMobile,
                        backgroundAlpha: 1.0
                    });

                    console.log('✅ Vanta.js initialized successfully');
                } catch (error) {
                    console.error('❌ Vanta.js initialization failed:', error);
                    // Fallback gradient background
                    const bgElement = document.getElementById('vanta-bg');
                    if (bgElement) {
                        bgElement.style.background = 
                            'linear-gradient(135deg, #1a1625 0%, #2d1b4e 40%, #d14d72 80%, #ffabab 100%)';
                        bgElement.style.backgroundSize = '400% 400%';
                        bgElement.style.animation = 'gradientShift 15s ease infinite';
                    }
                    
                    // Add keyframes for gradient animation
                    const style = document.createElement('style');
                    style.textContent = `
                        @keyframes gradientShift {
                            0%, 100% { background-position: 0% 50%; }
                            50% { background-position: 100% 50%; }
                        }
                    `;
                    document.head.appendChild(style);
                }
            }

            // Initialize on page load
            document.addEventListener('DOMContentLoaded', function() {
                initVantaBackground();
            });

            // Handle window resize
            window.addEventListener('resize', function() {
                if (window.vantaEffect && typeof window.vantaEffect.resize === 'function') {
                    window.vantaEffect.resize();
                }
            });

            // Cleanup on page unload
            window.addEventListener('beforeunload', function() {
                if (window.vantaEffect && typeof window.vantaEffect.destroy === 'function') {
                    window.vantaEffect.destroy();
                }
            });
            
            // Show/Hide error messages
            function showError(message) {
                const errorDiv = document.getElementById('errorMessage');
                const errorText = document.getElementById('errorText');
                const successDiv = document.getElementById('successMessage');
                
                // Hide success message and popup
                successDiv.classList.remove('show');
                hideSuccessPopup();
                
                // Show error message
                errorText.textContent = message;
                errorDiv.classList.add('show');
                
                // Auto-hide after 5 seconds
                setTimeout(function() {
                    errorDiv.classList.remove('show');
                }, 5000);
            }
            
            function showSuccess(message) {
                const successDiv = document.getElementById('successMessage');
                const successText = document.getElementById('successText');
                const errorDiv = document.getElementById('errorMessage');
                
                // Hide error message
                errorDiv.classList.remove('show');
                
                // Show success message
                successText.textContent = message;
                successDiv.classList.add('show');
            }
            
            // New function to show success popup
            function showSuccessPopup(message) {
                const popup = document.getElementById('successPopupOverlay');
                const messageEl = document.getElementById('successPopupMessage');
                const errorDiv = document.getElementById('errorMessage');
                const successDiv = document.getElementById('successMessage');
                
                // Hide other messages
                errorDiv.classList.remove('show');
                successDiv.classList.remove('show');
                
                // Update message and show popup
                messageEl.textContent = message;
                popup.classList.add('show');
                
                // Clear any field highlights
                clearFieldHighlights();
            }
            
            function hideSuccessPopup() {
                const popup = document.getElementById('successPopupOverlay');
                popup.classList.remove('show');
            }
            
            // Function to highlight password field in red
            function highlightPasswordField() {
                const passwordField = document.getElementById('<%= txtPassword.ClientID %>');
                if (passwordField) {
                    passwordField.classList.add('error');
                    passwordField.focus();
                    
                    // Remove error class after 3 seconds
                    setTimeout(function() {
                        passwordField.classList.remove('error');
                    }, 3000);
                }
            }
            
            // Function to clear all field highlights
            function clearFieldHighlights() {
                const usernameField = document.getElementById('<%= txtUsername.ClientID %>');
                const passwordField = document.getElementById('<%= txtPassword.ClientID %>');
                
                if (usernameField) usernameField.classList.remove('error');
                if (passwordField) passwordField.classList.remove('error');
            }
            
            function handleLoginClick() {
                const loginBtn = document.getElementById('<%= btnLogin.ClientID %>');
                const username = document.getElementById('<%= txtUsername.ClientID %>').value.trim();
                const password = document.getElementById('<%= txtPassword.ClientID %>').value.trim();
                
                // Clear any existing field highlights
                clearFieldHighlights();
                
                // Basic client-side validation
                if (!username || !password) {
                    showError('Please fill in all fields.');
                    return false;
                }
                
                // Show loading state
                loginBtn.classList.add('loading');
                loginBtn.innerHTML = '<div class="btn-loading"><div class="loading-spinner"></div><span>Signing in...</span></div>';
                
                // Hide any existing error messages
                document.getElementById('errorMessage').classList.remove('show');
                document.getElementById('successMessage').classList.remove('show');
                hideSuccessPopup();
                
                return true;
            }
            
            // Focus on username field when page loads
            window.addEventListener('load', function() {
                const usernameField = document.getElementById('<%= txtUsername.ClientID %>');
                if (usernameField) {
                    usernameField.focus();
                }
                
                // Hide error and success messages on load
                document.getElementById('errorMessage').classList.remove('show');
                document.getElementById('successMessage').classList.remove('show');
                hideSuccessPopup();
            });
            
            // Add Enter key support
            document.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    const activeElement = document.activeElement;
                    if (activeElement && (activeElement.id === '<%= txtUsername.ClientID %>' || 
                        activeElement.id === '<%= txtPassword.ClientID %>')) {
                        document.getElementById('<%= btnLogin.ClientID %>').click();
                    }
                }
            });
            
            // Reset button state if there's an error
            function resetLoginButton() {
                const loginBtn = document.getElementById('<%= btnLogin.ClientID %>');
                if (loginBtn) {
                    loginBtn.classList.remove('loading');
                    loginBtn.innerHTML = 'Sign In';
                }
            }
            
            // Close popup when clicking outside
            document.addEventListener('click', function(e) {
                const popup = document.getElementById('successPopupOverlay');
                if (e.target === popup) {
                    hideSuccessPopup();
                }
            });
        </script>
    </form>
</body>
</html>


