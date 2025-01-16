document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('infoModal');
    const infoTextarea = document.getElementById('additionalInfo');
    const saveBtn = document.getElementById('saveInfoBtn');
    let currentTenant = '';

    document.querySelectorAll('.additional-info-btn').forEach(btn => {
        btn.onclick = function() {
            currentTenant = this.getAttribute('data-tenant');
            infoTextarea.value = localStorage.getItem(currentTenant) || '';
            modal.style.display = 'block';
        };
    });

    saveBtn.onclick = function() {
        localStorage.setItem(currentTenant, infoTextarea.value);
        let infoElement = document.getElementById(`info-${currentTenant}`);
        if (!infoElement) {
            infoElement = document.createElement('p');
            infoElement.id = `info-${currentTenant}`;
            const tenantElement = document.querySelector(`[data-tenant="${currentTenant}"]`).closest('li');
            tenantElement.appendChild(infoElement);
        }
        infoElement.textContent = infoTextarea.value;
        modal.style.display = 'none';
    };

    document.querySelector('.close').onclick = function() {
        modal.style.display = 'none';
    };

    document.querySelectorAll('.additional-info-btn').forEach(btn => {
        const tenant = btn.getAttribute('data-tenant');
        const savedInfo = localStorage.getItem(tenant);
        if (savedInfo) {
            let infoElement = document.getElementById(`info-${tenant}`);
            if (!infoElement) {
                infoElement = document.createElement('p');
                infoElement.id = `info-${tenant}`;
                btn.closest('li').appendChild(infoElement);
            }
            infoElement.textContent = savedInfo;
        }
    });
});

