// Load videos from local storage when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const videos = JSON.parse(localStorage.getItem('videos')) || [];
  renderVideos(videos);

  // Show admin panel only if the URL contains "/admin"
  if (window.location.href.includes('/admin')) {
    document.getElementById('admin-panel').style.display = 'block';
  }
});

// Function to render videos
function renderVideos(videos) {
  const videoContainer = document.getElementById('video-container');
  videoContainer.innerHTML = ''; // Clear existing videos

  videos.forEach((video, index) => {
    const videoCard = document.createElement('div');
    videoCard.className = 'video-card';

    videoCard.innerHTML = `
      <img src="${video.thumbnail}" alt="Video Thumbnail" class="thumbnail">
      <h2>${video.title}</h2>
      <a href="${video.link}" target="_blank" class="watch-button">Watch Now</a>
      <button class="share-button">Share</button>
      <button class="delete-button" data-index="${index}">Delete</button>
    `;

    videoContainer.appendChild(videoCard);
  });

  // Add event listeners for share buttons
  document.querySelectorAll('.share-button').forEach(button => {
    button.addEventListener('click', () => {
      const videoTitle = button.closest('.video-card').querySelector('h2').innerText;
      const videoUrl = button.closest('.video-card').querySelector('a').href;
      if (navigator.share) {
        navigator.share({
          title: videoTitle,
          url: videoUrl
        }).then(() => {
          console.log('Thanks for sharing!');
        }).catch(console.error);
      } else {
        alert('Sharing is not supported in your browser.');
      }
    });
  });

  // Add event listeners for delete buttons
  document.querySelectorAll('.delete-button').forEach(button => {
    button.addEventListener('click', () => {
      const index = button.getAttribute('data-index');
      deleteVideo(index);
    });
  });
}

// Function to add a video
document.getElementById('video-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const videoTitle = document.getElementById('video-title').value;
  const videoThumbnail = document.getElementById('video-thumbnail').value;
  const videoLink = document.getElementById('video-link').value;

  const newVideo = {
    title: videoTitle,
    thumbnail: videoThumbnail,
    link: videoLink
  };

  const videos = JSON.parse(localStorage.getItem('videos')) || [];
  videos.push(newVideo);
  localStorage.setItem('videos', JSON.stringify(videos));

  renderVideos(videos);

  // Clear the form
  document.getElementById('video-form').reset();
});

// Function to delete a video
function deleteVideo(index) {
  const videos = JSON.parse(localStorage.getItem('videos'));
  videos.splice(index, 1);
  localStorage.setItem('videos', JSON.stringify(videos));
  renderVideos(videos);
}