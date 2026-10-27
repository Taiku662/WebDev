const form = document.getElementById("regform");

const fields = {
  name:     document.getElementById("name"),
  email:    document.getElementById("email"),
  password: document.getElementById("password"),
  confirm:  document.getElementById("confirm-password"),
  gender:   document.getElementById("gender"),
  dob:      document.getElementById("dob"),
  country:  document.getElementById("country"),
  phone:    document.getElementById("phone"),
  bio:      document.getElementById("bio"),
};

const errors = {
  name:     document.getElementById("nameError"),
  email:    document.getElementById("emailError"),
  password: document.getElementById("passwordError"),
  confirm:  document.getElementById("confirmError"),
  gender:   document.getElementById("genderError"),
  dob:      document.getElementById("dobError"),
  country:  document.getElementById("countryError"),
  phone:    document.getElementById("phoneError"),
  bio:      document.getElementById("bioError"),
};

const successMsg = document.getElementById("successMsg");
const memberList = document.getElementById("memberList");
const emptyNote  = document.getElementById("emptyNote");
const countEl    = document.getElementById("count");
const themeBtn   = document.getElementById("theme");

console.log(form, fields, errors, successMsg, memberList, countEl, themeBtn);



const validators = {
  name: v => v.trim().length < 3 ? "Name must be at least 3 letters." : "",

  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
    ? "" : "Enter a real email.",

  password: v => {
    if (v.length < 8) return "Password needs 8 or more characters.";
    if (!/\d/.test(v)) return "Password needs a number.";
    return "";
  },

  confirm: v => v !== "" && v === fields.password.value
    ? "" : "Passwords do not match.",

  gender: v => v ? "" : "Please choose one.",

  dob: v => {
    if (!v) return "Pick your birthday.";
    if (new Date(v) > new Date()) return "Birthday can't be in the future!";
    return "";
  },

  country: v => /^[A-Za-z\s'-]{2,}$/.test(v.trim())
    ? "" : "Write a country name.",

  phone: v => /^\+?[0-9\s]{9,15}$/.test(v.trim())
    ? "" : "Write a real phone number.",

  bio: v => {
    if (v.trim().length < 10) return "Tell us a bit more (10+ letters).";
    if (v.length > 200) return "Too long! Max 200 letters.";
    return "";
  },
};

function showError(key, message) {
  errors[key].textContent = message;
  fields[key].classList.toggle("invalid", message !== "");
}

function validateField(key) {
  const message = validators[key](fields[key].value);
  showError(key, message);
  return message === "";
}

function validateForm() {
  let allGood = true;
  let firstBad = null;
  Object.keys(fields).forEach(key => {
    if (!validateField(key)) {
      allGood = false;
      if (!firstBad) firstBad = fields[key];
    }
  });
  if (firstBad) firstBad.focus();
  return allGood;
}

function clearError(key) {
  errors[key].textContent = "";
  fields[key].classList.remove("invalid");
}

Object.keys(fields).forEach(key => {
  const el = fields[key];
  const eventName = el.tagName === "SELECT" ? "change" : "input";
  el.addEventListener(eventName, () => clearError(key));
});

fields.password.addEventListener("input", () => clearError("confirm"));

function addMember(member) {
  const li = document.createElement("li");
  li.className = "member-item";

  const info = document.createElement("div");
  info.className = "member-info";

  const nameEl = document.createElement("strong");
  nameEl.textContent = member.name;

  const emailEl = document.createElement("span");
  emailEl.textContent = member.email;

  const meta = document.createElement("small");
  meta.textContent = member.country + " • " + member.phone;

  info.append(nameEl, emailEl, meta);

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "remove-btn";
  removeBtn.textContent = "Remove";

  li.append(info, removeBtn);
  memberList.appendChild(li);
}

function updateCounter() {
  const total = memberList.querySelectorAll(".member-item").length;
  countEl.textContent = total;
  emptyNote.classList.toggle("hidden", total > 0);
}

let successTimer;

form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!validateForm()) {
    successMsg.classList.add("hidden");
    return;
  }

  const member = {
    name:    fields.name.value.trim(),
    email:   fields.email.value.trim(),
    country: fields.country.value.trim(),
    phone:   fields.phone.value.trim(),
  };

  addMember(member);
  updateCounter();

  successMsg.textContent = "Welcome, " + member.name + "! You are registered.";
  successMsg.classList.remove("hidden");
  clearTimeout(successTimer);
  successTimer = setTimeout(() => successMsg.classList.add("hidden"), 4000);

  form.reset();
  Object.keys(fields).forEach(clearError);
});

memberList.addEventListener("click", function (event) {
  const btn = event.target.closest(".remove-btn");
  if (!btn) return;

  btn.closest(".member-item").remove();
  updateCounter();
});

themeBtn.addEventListener("click", function () {
  const isDark = document.body.classList.toggle("dark");
  themeBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
  try { localStorage.setItem("theme", isDark ? "dark" : "light"); } catch (e) {}
});

try {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "Light Mode";
  }
} catch (e) {}

