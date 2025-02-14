function revealSecret(id) {
    const panel = document.getElementById(`secret-${id}`);
    if (panel.style.display === 'block') {
      panel.style.display = 'none';
    } else {
      panel.style.display = 'block';
    }
  }

  // Side navigation highlight
  const sideNavItems = document.querySelectorAll('.side-nav-item');
  const sections = document.querySelectorAll('.timeline-item');

document.querySelectorAll('.side-nav-item').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  });
});
  
  function highlightNavItem() {
  const scrollPosition = window.scrollY;
  
  document.querySelectorAll('.timeline-item').forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    const sectionId = section.getAttribute('id');
    
    if (sectionId) {
      const navItem = document.querySelector(`.side-nav-item[href="#${sectionId}"]`);
      
      if (scrollPosition >= sectionTop - 200 && 
          scrollPosition < sectionTop + sectionHeight - 200) {
        navItem?.classList.add('active');
      } else {
        navItem?.classList.remove('active');
      }
    }
  });
}
   document.addEventListener('DOMContentLoaded', function() {
    const panels = document.querySelectorAll('.secret-panel');
    panels.forEach(panel => {
      panel.style.display = 'none';
    });
  });
  
  window.addEventListener('scroll', highlightNavItem);
highlightNavItem();