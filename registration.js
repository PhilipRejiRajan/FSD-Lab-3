const fullnameInput = document.getElementById("fullname");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const passwordInput = document.getElementById("password");
const dobInput = document.getElementById("dob");
const roleInput = document.getElementById("role");
const profilepicInput = document.getElementById("profilepic");

const submitBtn = document.getElementById("submit-btn");
const clearBtn = document.getElementById("clear-btn");
const cardContainer = document.getElementById("card-container");
const emptyMsg = document.getElementById("empty-msg");

const STORAGE_KEY = "goattend-registrations";

function loadRegistrations() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    return [];
  }
  return JSON.parse(raw);
}

function saveRegistrations(registrations) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
}

function validateForm() {
  let isValid = true;

  if (fullnameInput.value.trim() === "") {
    document.getElementById("err-fullname").textContent = "Full name is required";
    isValid = false;
  } else {
    document.getElementById("err-fullname").textContent = "";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailInput.value.trim())) {
    document.getElementById("err-email").textContent = "Enter a valid email";
    isValid = false;
  } else {
    document.getElementById("err-email").textContent = "";
  }

  const phonePattern = /^[0-9]{10}$/;
  if (!phonePattern.test(phoneInput.value.trim())) {
    document.getElementById("err-phone").textContent = "Enter a valid 10 digit phone number";
    isValid = false;
  } else {
    document.getElementById("err-phone").textContent = "";
  }

  if (passwordInput.value.length < 6) {
    document.getElementById("err-password").textContent = "Password must be at least 6 characters";
    isValid = false;
  } else {
    document.getElementById("err-password").textContent = "";
  }

  if (dobInput.value === "") {
    document.getElementById("err-dob").textContent = "Please select your date of birth";
    isValid = false;
  } else {
    document.getElementById("err-dob").textContent = "";
  }

  if (roleInput.value === "") {
    document.getElementById("err-role").textContent = "Please select a role";
    isValid = false;
  } else {
    document.getElementById("err-role").textContent = "";
  }

  if (profilepicInput.files.length === 0) {
    document.getElementById("err-profilepic").textContent = "Please upload a profile picture";
    isValid = false;
  } else {
    document.getElementById("err-profilepic").textContent = "";
  }

  return isValid;
}

function showCard(data) {
  if (emptyMsg) {
    emptyMsg.style.display = "none";
  }

  const card = document.createElement("div");
  card.className = "result-card";

  card.innerHTML = `
    <img src="${data.image}" alt="profile picture">
    <div class="result-row"><span>Name</span><span>${data.name}</span></div>
    <div class="result-row"><span>Email</span><span>${data.email}</span></div>
    <div class="result-row"><span>Phone</span><span>${data.phone}</span></div>
    <div class="result-row"><span>Date of Birth</span><span>${data.dob}</span></div>
    <div class="result-row"><span>Role</span><span>${data.role}</span></div>
  `;

  cardContainer.prepend(card);
}

function renderSavedRegistrations() {
  const registrations = loadRegistrations();
  registrations.forEach((data) => {
    showCard(data);
  });
}

submitBtn.addEventListener("click", () => {
  if (validateForm() === false) {
    return;
  }

  const file = profilepicInput.files[0];
  const reader = new FileReader();

  reader.onload = () => {

    const newRegistration = {
      name: fullnameInput.value,
      email: emailInput.value,
      phone: phoneInput.value,
      dob: dobInput.value,
      role: roleInput.value,
      image: reader.result,
    };

    const registrations = loadRegistrations();
    registrations.push(newRegistration);
    saveRegistrations(registrations);

    showCard(newRegistration);
    document.getElementById("reg-form").reset();
  };

  reader.readAsDataURL(file);
});

clearBtn.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  cardContainer.innerHTML = "";
  if (emptyMsg) {
    cardContainer.appendChild(emptyMsg);
    emptyMsg.style.display = "block";
  }
});

renderSavedRegistrations();