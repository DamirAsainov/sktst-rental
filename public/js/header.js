document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const icons = document.querySelectorAll('.nav-item');
  
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
  
    icons.forEach(icon => {
      icon.addEventListener('mouseover', function () {
        icon.children[0].children[0].style.color = '#005B41';
        icon.children[0].children[0].classList.add('fa-beat-fade');
        icon.children[0].children[1].style.color = "#005B41";
      })
      icon.addEventListener('mouseout', function () {
        icon.children[0].children[0].style.color = 'white';
        icon.children[0].children[0].classList.remove('fa-beat-fade');
        icon.children[0].children[1].style.color = "white";
      })
    })
  });
  
  