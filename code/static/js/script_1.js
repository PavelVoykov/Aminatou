const validCredentials = [
    { username: 'john_doe', password: 'jane_smith' },
    { username: 'password_1234', password: '1234_password' }
];

let loginAttempts = 0;

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('message');

    const isValidLogin = validCredentials.some(cred => 
        cred.username === username && cred.password === password
    );

    if (isValidLogin) {
        messageElement.textContent = 'Login successful! Redirecting...';
        messageElement.style.color = 'green';
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        loginAttempts++;
        if (loginAttempts >= 3) {
            messageElement.textContent = 'Too many failed attempts. You are being redirected.';
            messageElement.style.color = 'red';
            setTimeout(() => {
                window.location.href = 'access_denied.html';
            }, 2000);
        } else {
            messageElement.textContent = `Incorrect username or password. Attempts left: ${3 - loginAttempts}`;
            messageElement.style.color = 'red';
        }
    }
});
