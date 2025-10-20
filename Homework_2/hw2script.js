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

const pass = document.getElementById("password");
const confirm = document.getElementById("password_confirm");

function validatePassword() {
  if (pass.value !== confirm.value) {
    confirm.setCustomValidity("Passwords do not match");
    confirm.reportValidity();
  } else {
    confirm.setCustomValidity("");
  }
}

pass.oninput = validatePassword;
confirm.oninput = validatePassword;

const dob = document.getElementById("dob");
const today = new Date();
const maxBirth = today.toISOString().split("T")[0];
const minBirth = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate())
  .toISOString().split("T")[0];
dob.max = maxBirth;
dob.min = minBirth;

