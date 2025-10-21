/* 
 Name: Diego Sierra
 File: hw2script.js
 Date Created: 10/18/2025
 Date Updated: 10/20/2025
 Purpose: Redisplay/validate data from a form
*/

document.getElementById("reviewBtn").addEventListener("click", function () {
  const form = document.querySelector("form");
  const table = document.getElementById("reviewTable");
  table.innerHTML = `
    <tr>
      <th>Field</th>
      <th>Value / Status</th>
    </tr>`;
  
 // array of fields for review section 
  const fields = [
    ["First Name", form.first_name.value],
    ["Last Name", form.last_name.value],
    ["User ID", form.user_id.value],
    ["Email", form.email.value],
    ["Phone", form.phone_number.value],
    ["Address", form.address.value],
    ["City", form.city.value],
    ["State", form.state.value],
    ["Zip", form.zip.value ? form.zip.value.substring(0,5) : ""],
    ["DOB", form.dob.value],
    ["Health Rating", form.health_rating.value],
  ];

  const selectedSex = form.querySelector('input[name="sex"]:checked');
  fields.push(["Sex", selectedSex ? selectedSex.value : ""]);

  const selectedInsurance = form.querySelector('input[name="insurance"]:checked');
  fields.push(["Insurance", selectedInsurance ? selectedInsurance.value : ""]);

  const selectedVaccinated = form.querySelector('input[name="vaccinated"]:checked');
  fields.push(["Vaccinated", selectedVaccinated ? selectedVaccinated.value : ""]);
  
  // parse medical history
  const checkedHistory = Array.from(
    form.querySelectorAll('input[name="medical_history"]:checked')
  )
    .map(cb => cb.nextElementSibling.textContent.trim())
    .join(", ");
  fields.push(["Medical History", checkedHistory ? checkedHistory : "No conditions reported"]);


  fields.forEach(([label, val]) => {
    const row = table.insertRow();
    const c1 = row.insertCell(0);
    const c2 = row.insertCell(1);
    c1.textContent = label;
    if (val && val.trim() !== "") {
      c2.textContent = val;
      c2.classList.add("pass");
    } else {
      c2.textContent = "Missing!";
      c2.classList.add("error");
    }
  });

  document.getElementById("reviewSection").style.display = "block";
});

// validate passwords
const pass = document.getElementById("password");
const confirm = document.getElementById("password_confirm");

function validatePassword() {
  const uid = (document.getElementById("user_id").value || "").toLowerCase();
  const first = (document.getElementById("first_name").value || "").toLowerCase();
  const last  = (document.getElementById("last_name").value  || "").toLowerCase();
  const p1 = pass.value;
  const p2 = confirm.value;

  confirm.setCustomValidity("");
  pass.setCustomValidity("");

  if (p1 !== p2) {
    confirm.setCustomValidity("Passwords do not match");
  }

  const badParts = [uid, first, last].filter(s => s && s.length >= 3);
  if (p1.toLowerCase() === uid) {
    pass.setCustomValidity("Password cannot equal your User ID");
  } else if (badParts.some(s => p1.toLowerCase().includes(s))) {
    pass.setCustomValidity("Password cannot contain your name or User ID");
  }
}

pass.oninput = validatePassword;
confirm.oninput = validatePassword;
userIdInput.oninput = validatePassword;
document.getElementById("first_name").oninput = validatePassword;
document.getElementById("last_name").oninput  = validatePassword;

const errPass = document.getElementById("err_password");
["input", "blur"].forEach(evt => {
  pass.addEventListener(evt, () => {
    errPass.textContent = pass.validationMessage;
  });
  confirm.addEventListener(evt, () => {
    errPass.textContent = confirm.validationMessage || pass.validationMessage;
  });
});


// DOB checks
const dob = document.getElementById("dob");
const today = new Date();
const maxBirth = today.toISOString().split("T")[0];
const minBirth = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate())
  .toISOString().split("T")[0];
dob.max = maxBirth;
dob.min = minBirth;

//dob format helper
dob.addEventListener("change", () => {
  const err = document.getElementById("err_dob");
  err.textContent = "";
  if (dob.value < dob.min || dob.value > dob.max) {
    err.textContent = `DOB must be between ${dob.min} and ${dob.max}`;
  }
});

// phone number format helper
const phone = document.getElementById("phone_number");
phone.addEventListener("input", () => {
  const err = document.getElementById("err_phone");
  err.textContent = phone.validity.patternMismatch ? "Use 000-000-0000" : "";
});




