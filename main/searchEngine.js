document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
  
    searchButton.addEventListener('click', performSearch);
  
    searchInput.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        performSearch();
      }
    });
  
    function performSearch() {
      const searchTerm = searchInput.value.trim().toLowerCase();
  
      if (searchTerm === 'pizza') {
        window.location.href = '/pizza-page.html';
      } else {
        alert('No pizza left)'); 
      }
    }
});