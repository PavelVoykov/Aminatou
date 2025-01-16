let loginAttempts = 0;

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value; 
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('message');

   
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password }) 
    })
    .then(response => {
        if (response.ok) {
            messageElement.textContent = 'Login successful! Redirecting...';
            messageElement.style.color = 'green';
            setTimeout(() => {
                window.location.href = '/'; 
            }, 1000);
        } else {
            loginAttempts++;
            if (loginAttempts >= 3) {
                messageElement.textContent = 'Too many failed attempts. You are being redirected.';
                messageElement.style.color = 'red';
                setTimeout(() => {
                    window.location.href = 'access_denied'; 
                }, 2000);
            } else {
                messageElement.textContent = `Incorrect username or password. Attempts left: ${3 - loginAttempts}`;
                messageElement.style.color = 'red';
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        messageElement.textContent = 'An error occurred. Please try again.';
        messageElement.style.color = 'red';
    });
});

