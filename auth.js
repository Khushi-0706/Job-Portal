const BASE_URL = "https://foody-backend-tw5c.onrender.com";





async function fetchJobs(title) {
      const url = `https://remotive.com/api/remote-jobs?category=${encodeURIComponent(title)}`;
      const listingsDiv = document.getElementById('job-listings');
      listingsDiv.innerHTML = '<p>Loading jobs...</p>';

      try {
        const response = await fetch(url);
        const result = await response.json();
        displayJobs({ jobs: result.jobs });
        return result.jobs;
      } catch (error) {
        listingsDiv.innerHTML = '<p>Error fetching jobs.</p>';
        console.error('Error fetching jobs:', error);
      }
    }


async function handleSearchInputs() {
    const category = document.getElementById('job-title-input').value;

    if (!category) {
        alert("Please enter a job category.");
        return;
    }

    const url = `https://remotive.com/api/remote-jobs?category=${encodeURIComponent(category)}`;
    const listingsDiv = document.getElementById('job-listings');
    listingsDiv.innerHTML = '<p>Loading jobs...</p>';

    try {
        const response = await fetch(url);
        const result = await response.json();
        displayJobs(result);
    } catch (error) {
        listingsDiv.innerHTML = '<p>Error fetching jobs.</p>';
        console.error('Error fetching jobs:', error);
    }
}






    function displayJobs(apiResponse) {
      const listingsDiv = document.getElementById('job-listings');
      listingsDiv.innerHTML = '';

      const jobs = apiResponse.jobs;

      if (jobs && jobs.length > 0) {
        jobs.forEach(job => {
          const jobCard = document.createElement('div');
          jobCard.classList.add('job-card');
          jobCard.innerHTML = `

            <div class="job-details">
              <div class="job-title">${job.title}</div>
              <div class="company-name">${job.company_name}</div>
              <div class="meta">Location: ${job.candidate_required_location || 'Not specified'}</div>
              <div class="meta">Salary: ${job.salary || 'Not disclosed'}</div>
              <div class="meta">Type: ${job.job_type || 'Unknown'}</div>
              <a href="${job.url}" target="_blank" class="apply-btn">Apply Now</a>
            </div>
          `;
          listingsDiv.appendChild(jobCard);
        });
      } else {
        listingsDiv.innerHTML = '<p>No jobs found.</p>';
      }
    }

    function setupDropdownSearch() {
      document.querySelectorAll('.hello a').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          e.preventDefault();
          const title = anchor.dataset.title;
          if (title) fetchJobs(title);
        });
      });
    }

    window.onload = setupDropdownSearch;


function toggleAuthLinks() {
  const token = localStorage.getItem('token');
  const login = document.getElementById('login');
  const register = document.getElementById('register');
  const logout = document.getElementById('logout');

  if (token) {
    if (login) login.style.display = 'none';
    if (register) register.style.display = 'none';
    if (logout) logout.style.display = 'block';
  } else {
    if (login) login.style.display = 'block';
    if (register) register.style.display = 'block';
    if (logout) logout.style.display = 'none';
  }
}

window.addEventListener('DOMContentLoaded', toggleAuthLinks);

function loginUser(event) {
  event.preventDefault();
  const form = event.target;
  const email = form.email.value;
  const password = form.password.value;

  fetch(`${BASE_URL}/api/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => {
    console.log(data);
    if (data.success) {
      localStorage.setItem('token', data.token);
      alert(data.message);
      window.location.href = "index.html";
    } else {
      alert(data.message);
    }
  })
  .catch(() => alert("Login failed. Try again."));
}

function registerUser(event) {
  event.preventDefault();
  const form = event.target;
  const name = form.name.value;
  const email = form.email.value;
  const password = form.password.value;

  fetch(`${BASE_URL}/api/user/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  })
  .then(res => res.json())
  .then(data => {
    console.log(data);
    if (data.success) {
      localStorage.setItem('token', data.token);
      alert(data.message);
      window.location.href = "index.html";
    } else {
      alert(data.message);
    }
  })
  .catch(() => alert("Registration failed. Try again."));
}

function logoutUser() {
  localStorage.removeItem('token');
  alert("Logged out successfully.");
  window.location.href = "index.html";
}
