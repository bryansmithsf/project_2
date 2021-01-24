// Wait for the DOM to completely load before we run our JS
document.addEventListener('DOMContentLoaded', (e) => {
    console.log('DOM loaded! 🚀');
  
    // Check for query string and set flag, "updating", to false initially
    const url = window.location.search;
    let artworkId;
    let updating = false;
  
    // Get a specific post
    const getArtworkData = (id) => {
      fetch(`/artwork/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            console.log(`Success in grabbing artwork ${id}`, data);
  
            // Populate the form with the existing post
            titleInput.value = data.title;
            postedByInput.value = data.postedBy;
            yearInput.value = data.year;
            bodyInput.value = data.body;
            categoryInput.value = data.category;
            conditionInput.value = data.condition;
            imageInput.value = data.image;
  
            updating = true;
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    };
  
    // Extract the post ID from the URL
    if (url.indexOf('?artwork_id=') !== -1) {
      artworkId = url.split('=')[1];
      getArtworkData(artworkId);
    }
  
    // Get elements from the page
    const createArt = document.getElementById('create-art');
    const titleInput = document.getElementById('title');
    const postedByInput = document.getElementById('posted-by');
    const yearInput = document.getElementById('year');
    const bodyInput = document.getElementById('body');
    const categoryInput = document.getElementById('category');
    const conditionInput = document.getElementById('condition');
    const imageInput = document.getElementById('image')
   
  
    // Set default value for the category
    categoryInput.value = 'Painting';
  
    const handleFormSubmit = (e) => {
      e.preventDefault();
      if (!titleInput.value || !bodyInput.value || !postedByInput.value || !yearInput.value || !categoryInput.value || !conditionInput.value || !imageInput.value) {
        alert('Your post is missing some content');
      }
  
      // Create a newArtwork object to send off to the backend
      const newArtwork = {
        title: titleInput.value.trim(),
        postedBy: postedByInput.value,
        year: yearInput.value.trim(),
        body: bodyInput.value.trim(),
        category: categoryInput.value,
        condtion: conditionInput.value,
        image: imageInput.value,

      };
      console.log('handleFormSubmit -> newArtwork', newArtwork);
  
      // Check if the user is updating or creating and perform said function
      if (updating) {
        newArtwork.id = artworkId;
        updateArtwork(newArtwork);
      } else {
        submitArtwork(newArtwork);
      }
    };
  
    // Event listener for when the artwork is submitted
    createArt.addEventListener('submit', handleFormSubmit);
  
    // Event handler for when a user submits an artwork
    const submitArtwork = (post) => {
      fetch('/api/artworks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success in submitting post:', data);
          window.location.href = './artwork.html';
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    };
  
    // Update a post and bring user to /artwork
    const updateArtwork = (post) => {
      fetch('/api/artworks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      })
        .then(() => {
          console.log('Attempting update to artwork');
          window.location.href = './artwork.html';
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    };
  });