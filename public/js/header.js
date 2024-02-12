document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarToggler = document.querySelector('.navbar-toggler');
  
    // Function to toggle the visibility of the <p> and <i> elements
    function toggleVisibility() {
      navLinks.forEach(link => {
        const pElement = link.querySelector('p');
        const iElement = link.querySelector('i');
        if (pElement && iElement) {
          pElement.style.display = navbarToggler.getAttribute('aria-expanded') === 'true' ? 'inline' : 'none';
        }
      });
    }
  
    // Initially hide the <p> and <i> elements
    toggleVisibility();
  
    // Add an event listener to the navbar-toggler button
    navbarToggler.addEventListener('click', toggleVisibility);

  });
  
  