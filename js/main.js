// Constants
const NASA_API_KEY = 'DEMO_KEY'; // Using demo key for public access
const NASA_API_BASE_URL = 'https://api.nasa.gov/mars-photos/api/v1/rovers';

// DOM Elements
const roverSelect = document.getElementById('rover-select');
const cameraSelect = document.getElementById('camera-select');
const dateInput = document.getElementById('date-input');
const solInput = document.getElementById('sol-input');
const searchButton = document.getElementById('search-button');
const photosGrid = document.getElementById('photos-grid');
const loader = document.getElementById('loader');
const errorContainer = document.getElementById('error-container');
const noResults = document.getElementById('no-results');
const photoModal = document.getElementById('photo-modal');
const modalImage = document.getElementById('modal-image');
const modalInfo = document.getElementById('modal-info');
const closeModal = document.getElementById('close-modal');
const infoButton = document.getElementById('info-button');
const infoModal = document.getElementById('info-modal');
const closeInfoModal = document.getElementById('close-info-modal');
const themeToggle = document.getElementById('theme-toggle');

// Camera definitions by rover
const CAMERAS_BY_ROVER = {
  curiosity: [
    { id: 'FHAZ', name: 'Front Hazard Avoidance Camera' },
    { id: 'RHAZ', name: 'Rear Hazard Avoidance Camera' },
    { id: 'MAST', name: 'Mast Camera' },
    { id: 'CHEMCAM', name: 'Chemistry and Camera Complex' },
    { id: 'MAHLI', name: 'Mars Hand Lens Imager' },
    { id: 'MARDI', name: 'Mars Descent Imager' },
    { id: 'NAVCAM', name: 'Navigation Camera' },
  ],
  opportunity: [
    { id: 'FHAZ', name: 'Front Hazard Avoidance Camera' },
    { id: 'RHAZ', name: 'Rear Hazard Avoidance Camera' },
    { id: 'NAVCAM', name: 'Navigation Camera' },
    { id: 'PANCAM', name: 'Panoramic Camera' },
    { id: 'MINITES', name: 'Miniature Thermal Emission Spectrometer' },
  ],
  spirit: [
    { id: 'FHAZ', name: 'Front Hazard Avoidance Camera' },
    { id: 'RHAZ', name: 'Rear Hazard Avoidance Camera' },
    { id: 'NAVCAM', name: 'Navigation Camera' },
    { id: 'PANCAM', name: 'Panoramic Camera' },
    { id: 'MINITES', name: 'Miniature Thermal Emission Spectrometer' },
  ],
  perseverance: [
    { id: 'EDL_RUCAM', name: 'Rover Up-Look Camera' },
    { id: 'EDL_RDCAM', name: 'Rover Down-Look Camera' },
    { id: 'EDL_DDCAM', name: 'Descent Stage Down-Look Camera' },
    { id: 'EDL_PUCAM1', name: 'Parachute Up-Look Camera A' },
    { id: 'EDL_PUCAM2', name: 'Parachute Up-Look Camera B' },
    { id: 'NAVCAM_LEFT', name: 'Navigation Camera - Left' },
    { id: 'NAVCAM_RIGHT', name: 'Navigation Camera - Right' },
    { id: 'MCZ_RIGHT', name: 'Mastcam-Z Right' },
    { id: 'MCZ_LEFT', name: 'Mastcam-Z Left' },
    { id: 'FRONT_HAZCAM_LEFT_A', name: 'Front Hazard Avoidance Camera - Left' },
    { id: 'FRONT_HAZCAM_RIGHT_A', name: 'Front Hazard Avoidance Camera - Right' },
    { id: 'REAR_HAZCAM_LEFT', name: 'Rear Hazard Avoidance Camera - Left' },
    { id: 'REAR_HAZCAM_RIGHT', name: 'Rear Hazard Avoidance Camera - Right' },
    { id: 'SKYCAM', name: 'MEDA Skycam' },
    { id: 'SHERLOC_WATSON', name: 'SHERLOC WATSON Camera' },
  ],
};

// Default values
const DEFAULT_ROVER = 'curiosity';
const MAX_PHOTOS_PER_PAGE = 25;

// State
let currentTheme = 'dark';

// Initialize the app
function init() {
  // Set default values
  setDefaultValues();
  
  // Add event listeners
  setupEventListeners();
  
  // Check for saved theme preference
  loadThemePreference();
  
  // Update camera options when rover changes
  updateCameraOptions(DEFAULT_ROVER);
  
  // Initial search
  searchPhotos();
}

// Set default date/sol values
function setDefaultValues() {
  // Set date input to a week ago by default
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  const dateStr = formatDate(weekAgo);
  dateInput.value = dateStr;
  
  // Default sol value
  solInput.value = '1000';
}

// Format date to YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Setup event listeners
function setupEventListeners() {
  // Search button
  searchButton.addEventListener('click', searchPhotos);
  
  // Rover select change
  roverSelect.addEventListener('change', (e) => {
    updateCameraOptions(e.target.value);
  });
  
  // Date/Sol inputs
  dateInput.addEventListener('change', () => {
    solInput.value = ''; // Clear sol when date is set
  });
  
  solInput.addEventListener('change', () => {
    dateInput.value = ''; // Clear date when sol is set
  });
  
  // Modal close
  closeModal.addEventListener('click', () => {
    photoModal.classList.remove('visible');
    setTimeout(() => photoModal.hidden = true, 300);
  });
  
  // Info button
  infoButton.addEventListener('click', () => {
    infoModal.hidden = false;
    setTimeout(() => infoModal.classList.add('visible'), 10);
  });
  
  closeInfoModal.addEventListener('click', () => {
    infoModal.classList.remove('visible');
    setTimeout(() => infoModal.hidden = true, 300);
  });
  
  // Theme toggle
  themeToggle.addEventListener('click', toggleTheme);
  
  // Close modals when clicking outside content
  photoModal.addEventListener('click', (e) => {
    if (e.target === photoModal) {
      photoModal.classList.remove('visible');
      setTimeout(() => photoModal.hidden = true, 300);
    }
  });
  
  infoModal.addEventListener('click', (e) => {
    if (e.target === infoModal) {
      infoModal.classList.remove('visible');
      setTimeout(() => infoModal.hidden = true, 300);
    }
  });
  
  // Keyboard events
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close modals with ESC key
      photoModal.classList.remove('visible');
      infoModal.classList.remove('visible');
      setTimeout(() => {
        photoModal.hidden = true;
        infoModal.hidden = true;
      }, 300);
    }
  });
}

// Toggle between light and dark theme
function toggleTheme() {
  const body = document.body;
  
  if (currentTheme === 'dark') {
    body.classList.add('light-theme');
    currentTheme = 'light';
    themeToggle.innerText = '🌑';
  } else {
    body.classList.remove('light-theme');
    currentTheme = 'dark';
    themeToggle.innerText = '🌓';
  }
  
  // Save preference
  localStorage.setItem('theme', currentTheme);
}

// Load saved theme preference
function loadThemePreference() {
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme) {
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
      currentTheme = 'light';
      themeToggle.innerText = '🌑';
    } else {
      document.body.classList.remove('light-theme');
      currentTheme = 'dark';
      themeToggle.innerText = '🌓';
    }
  }
}

// Update camera select options based on selected rover
function updateCameraOptions(roverName) {
  // Clear current options
  cameraSelect.innerHTML = '';
  
  // Add "All Cameras" option
  const allOption = document.createElement('option');
  allOption.value = 'all';
  allOption.textContent = 'All Cameras';
  cameraSelect.appendChild(allOption);
  
  // Add rover-specific camera options
  const cameras = CAMERAS_BY_ROVER[roverName] || [];
  cameras.forEach(camera => {
    const option = document.createElement('option');
    option.value = camera.id;
    option.textContent = camera.name;
    cameraSelect.appendChild(option);
  });
}

// Search for photos
async function searchPhotos() {
  try {
    showLoader();
    hideError();
    hideNoResults();
    
    const rover = roverSelect.value;
    const camera = cameraSelect.value;
    const date = dateInput.value;
    const sol = solInput.value;
    
    // Validate inputs
    if (!rover) {
      throw new Error('Please select a rover');
    }
    
    if (!date && !sol) {
      throw new Error('Please enter either an Earth date or a Sol');
    }
    
    // Build API URL
    let apiUrl = `${NASA_API_BASE_URL}/${rover}/photos?api_key=${NASA_API_KEY}`;
    
    // Add date or sol parameter
    if (sol) {
      apiUrl += `&sol=${sol}`;
    } else if (date) {
      apiUrl += `&earth_date=${date}`;
    }
    
    // Add camera filter if not "all"
    if (camera !== 'all') {
      apiUrl += `&camera=${camera}`;
    }
    
    // Fetch data from API
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch Mars photos');
    }
    
    const photos = data.photos || [];
    
    // Display photos
    displayPhotos(photos);
    
  } catch (error) {
    console.error('Error fetching photos:', error);
    showError(error.message);
  } finally {
    hideLoader();
  }
}

// Display photos in the grid
function displayPhotos(photos) {
  // Clear current photos
  photosGrid.innerHTML = '';
  
  // Check if there are any photos
  if (photos.length === 0) {
    showNoResults();
    return;
  }
  
  // Only show a limited number of photos to improve performance
  const displayPhotos = photos.slice(0, MAX_PHOTOS_PER_PAGE);
  
  // Create photo cards
  displayPhotos.forEach(photo => {
    const photoCard = createPhotoCard(photo);
    photosGrid.appendChild(photoCard);
  });
  
  // Add a count message if there are more photos than we're displaying
  if (photos.length > MAX_PHOTOS_PER_PAGE) {
    const countMessage = document.createElement('div');
    countMessage.className = 'count-message';
    countMessage.textContent = `Showing ${MAX_PHOTOS_PER_PAGE} of ${photos.length} photos. Refine your search to see different results.`;
    photosGrid.appendChild(countMessage);
  }
}

// Create a photo card element
function createPhotoCard(photo) {
  const card = document.createElement('div');
  card.className = 'photo-card';
  
  // Create image
  const img = document.createElement('img');
  img.src = photo.img_src;
  img.alt = `Mars photo taken by ${photo.rover.name} rover's ${photo.camera.full_name}`;
  img.loading = 'lazy'; // Lazy load images
  
  // Simple image info
  const info = document.createElement('div');
  info.className = 'photo-info';
  info.textContent = `${photo.camera.name} - Sol ${photo.sol}`;
  
  // Add click event to open modal
  card.addEventListener('click', () => {
    showPhotoModal(photo);
  });
  
  // Append elements
  card.appendChild(img);
  card.appendChild(info);
  
  return card;
}

// Show photo in modal
function showPhotoModal(photo) {
  // Set modal image
  modalImage.src = photo.img_src;
  modalImage.alt = `Mars photo taken by ${photo.rover.name} rover's ${photo.camera.full_name}`;
  
  // Set photo info
  modalInfo.innerHTML = `
    <h3>Photo Details</h3>
    <p><strong>Rover:</strong> ${photo.rover.name}</p>
    <p><strong>Camera:</strong> ${photo.camera.full_name} (${photo.camera.name})</p>
    <p><strong>Sol:</strong> ${photo.sol}</p>
    <p><strong>Earth Date:</strong> ${photo.earth_date}</p>
    <p><strong>Rover Status:</strong> ${photo.rover.status}</p>
    <p><strong>Mission:</strong> Launched ${photo.rover.launch_date}, Landed ${photo.rover.landing_date}</p>
  `;
  
  // Show modal
  photoModal.hidden = false;
  setTimeout(() => photoModal.classList.add('visible'), 10);
}

// Show/hide UI elements
function showLoader() {
  loader.hidden = false;
}

function hideLoader() {
  loader.hidden = true;
}

function showError(message) {
  errorContainer.querySelector('p').textContent = message || 'Error loading photos. Please try again.';
  errorContainer.hidden = false;
}

function hideError() {
  errorContainer.hidden = true;
}

function showNoResults() {
  noResults.hidden = false;
}

function hideNoResults() {
  noResults.hidden = true;
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);