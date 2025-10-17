document.getElementById("reviewBtn").addEventListener("click", function() {
  const form = document.querySelector("form");
  const table = document.getElementById("reviewTable");
  table.innerHTML = "";

  const fields = [
    ["First Name", form.first_name.value],
    ["Middle Initial", form.middle_intial.value],
    ["Last Name", form.last_name.value],
    ["User ID", form.user_id.value],
    ["Email", form.email.value],
    ["Phone", form.phone_number.value],
    ["Address", form.address.value],
    ["City", form.city.value],
    ["State", form.state.value],
    ["Zip", form.zip.value.substring(0,5)],
    ["DOB", form.dob.value],
    ["Health Rating", form.health_rating.value],
    ["Symptoms", form.symptoms.value]
  ];

  fields.forEach(([label, val]) => {
    const row = table.insertRow();
    const c1 = row.insertCell(0);
    const c2 = row.insertCell(1);
    c1.textContent = label;
    c2.textContent = val ? val : "Missing!";
    if (!val) c2.style.color = "red";
  });

  document.getElementById("reviewSection").style.display = "block";
});

const pass = document.getElementById("password");
const confirm = document.getElementById("password_confirm");

function validatePassword() {
  if (pass.value !== confirm.value) {
    confirm.setCustomValidity("Passwords do not match");
  } else {
    confirm.setCustomValidity("");
  }
}

pass.oninput = validatePassword;
confirm.oninput = validatePassword;
