document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('infoModal');
    const btns = document.querySelectorAll('.additional-info-btn');
    const span = document.getElementsByClassName('close')[0];
    const saveBtn = document.getElementById('saveInfoBtn');
    const infoTextarea = document.getElementById('additionalInfo');
    let currentTenant = '';

    // Load saved info for each tenant on page load
    btns.forEach(btn => {
        const tenant = btn.getAttribute('data-tenant');
        const savedInfo = localStorage.getItem(`tenantInfo_${tenant}`);
        const infoElement = document.getElementById(`tenant-info-${tenant}`);
        
        if (savedInfo) {
            infoElement.textContent = savedInfo;
        }
    });

    btns.forEach(btn => {
        btn.onclick = function() {
            currentTenant = this.getAttribute('data-tenant');
            modal.style.display = 'block';
            infoTextarea.value = localStorage.getItem(`tenantInfo_${currentTenant}`) || '';
        }
    });

    span.onclick = function() {
        modal.style.display = 'none';
    }

    saveBtn.onclick = function() {
        localStorage.setItem(`tenantInfo_${currentTenant}`, infoTextarea.value);
        
        // Update the displayed info on the page
        const infoElement = document.getElementById(`tenant-info-${currentTenant}`);
        infoElement.textContent = infoTextarea.value;
        
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});