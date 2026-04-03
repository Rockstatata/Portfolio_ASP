// Contact Management JavaScript Functions

// Auto-hide messages after 5 seconds
document.addEventListener('DOMContentLoaded', function () {
    const messagePanel = document.querySelector('.admin-message');
    if (messagePanel) {
        setTimeout(() => {
            messagePanel.style.opacity = '0';
            setTimeout(() => messagePanel.style.display = 'none', 300);
        }, 5000);
    }
});

// Modal functions
function showMessageModal(contactData) {
    // Create modal if it doesn't exist
    if (!document.getElementById('messageModal')) {
        createModal();
    }
    
    document.getElementById('modalContactName').textContent = contactData.name;
    document.getElementById('modalContactEmail').textContent = contactData.email;
    document.getElementById('modalSubject').textContent = contactData.subject || 'No Subject';
    document.getElementById('modalReceivedDate').textContent = contactData.receivedDate;
    document.getElementById('modalMessage').textContent = contactData.message;
    
    // Update status display
    const statusText = (contactData.isRead ? 'Read' : 'Unread') + 
                     (contactData.responded ? ', Responded' : '');
    document.getElementById('modalStatus').textContent = statusText;
    
    // Update reply link
    const replyLink = document.getElementById('modalReplyLink');
    replyLink.href = `mailto:${contactData.email}?subject=Re: ${encodeURIComponent(contactData.subject || '')}`;
    
    document.getElementById('messageModal').style.display = 'flex';
}

function closeMessageModal() {
    const modal = document.getElementById('messageModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function createModal() {
    const modalHtml = `
        <div id="messageModal" class="admin-modal" style="display: none;">
            <div class="admin-modal-content">
                <div class="admin-modal-header">
                    <h3>Message Details</h3>
                    <button type="button" class="admin-modal-close" onclick="closeMessageModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="admin-modal-body">
                    <div class="message-detail">
                        <div class="message-field">
                            <label>From:</label>
                            <span id="modalContactName"></span> &lt;<span id="modalContactEmail"></span>&gt;
                        </div>
                        <div class="message-field">
                            <label>Subject:</label>
                            <span id="modalSubject"></span>
                        </div>
                        <div class="message-field">
                            <label>Received:</label>
                            <span id="modalReceivedDate"></span>
                        </div>
                        <div class="message-field">
                            <label>Status:</label>
                            <span id="modalStatus"></span>
                        </div>
                        <div class="message-field">
                            <label>Message:</label>
                            <div class="message-body" id="modalMessage"></div>
                        </div>
                    </div>
                </div>
                <div class="admin-modal-footer">
                    <a id="modalReplyLink" href="#" class="admin-btn-primary">
                        <i class="fas fa-reply"></i> Reply via Email
                    </a>
                    <button type="button" class="admin-btn-secondary" onclick="closeMessageModal()">Close</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Add event listeners
    const modal = document.getElementById('messageModal');
    
    // Close modal on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeMessageModal();
        }
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMessageModal();
        }
    });
}

// Statistics animation
function animateContactStats() {
    const statElements = document.querySelectorAll('.admin-stat-value');
    
    statElements.forEach((element, index) => {
        const finalValue = parseInt(element.textContent) || 0;
        animateValue(element, 0, finalValue, 1000 + (index * 200));
    });
}

function animateValue(element, start, end, duration) {
    const range = end - start;
    const minTimer = 50;
    let stepTime = Math.abs(Math.floor(duration / range));
    stepTime = Math.max(stepTime, minTimer);
    
    const startTime = new Date().getTime();
    const endTime = startTime + duration;
    let timer;

    function run() {
        const now = new Date().getTime();
        const remaining = Math.max((endTime - now) / duration, 0);
        const value = Math.round(end - (remaining * range));
        element.textContent = value;
        
        if (value === end) {
            clearInterval(timer);
        }
    }

    timer = setInterval(run, stepTime);
    run();
}

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(animateContactStats, 500);
});