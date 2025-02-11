document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username === 'methni' && password === '1234') {
            Swal.fire({
                title: 'Login successful!',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = 'home.html';
                }
            });
        } else {
            Swal.fire({
                title: 'Invalid username or password.',
                icon: 'error',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    document.getElementById('username').value = '';
                    document.getElementById('password').value = '';
                }
            });
        }
    });
});

