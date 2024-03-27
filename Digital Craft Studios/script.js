// Smooth Scrolling 
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


// Form validation
const form = document.querySelector('form');
form.addEventListener('submit', function(e) {
    const emailInput = document.getElementById('exampleInputEmail1');
    const passwordInput = document.getElementById('exampleInputPassword1');
    const confirmPasswordInput = document.getElementById('cexampleInputPassword1');

    if (!isValidEmail(emailInput.value)) {
        alert('Please enter a valid email address.');
        e.preventDefault();
    }

    if (passwordInput.value.length < 8) {
        alert('Password must be at least 8 characters long.');
        e.preventDefault();
    }

    if (passwordInput.value !== confirmPasswordInput.value) {
        alert('Passwords do not match.');
        e.preventDefault();
    }
});
function isValidEmail(email) {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
