/* 
 Name: Diego Sierra
 File: hw3script.js
 Date Updated: 2025-10-27
 Purpose: Redisplay/validate data from a form
*/

ar error_flag = 0;

//review table
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

  const exercise = form.querySelector('input[name="exercise"]:checked');
  fields.push(["Exercise Frequency", exercise ? exercise.value : ""]);

  const checkedHistory = Array.from(
    form.querySelectorAll('input[name="medical_history"]:checked')
  )
    .map(cb => cb.nextElementSibling.textContent.trim())
    .join(", ");
  fields.push(["Medical History", checkedHistory || "No conditions reported"]);

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

//helpers
function togglesubmit(allow){
  var s = document.getElementById("btnSubmit");
  if (s) s.hidden = !allow;  
}
function formatSSN(value){
  var d = value.replace(/\D/g, "").slice(0, 9);
  if (d.length > 5) return d.slice(0,3) + "-" + d.slice(3,5) + "-" + d.slice(5);
  if (d.length > 3) return d.slice(0,3) + "-" + d.slice(3);
  return d;
}


//password validation
const pass = document.getElementById("password");
const confirm = document.getElementById("password_confirm");
const userIdInput = document.getElementById("user_id");

function validatePassword() {
  const uid = userIdInput.value.toLowerCase();
  const first = (document.getElementById("first_name").value || "").toLowerCase();
  const last = (document.getElementById("last_name").value || "").toLowerCase();
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

// run on input so it checks while typing
pass.oninput = validatePassword;
confirm.oninput = validatePassword;
userIdInput.oninput = validatePassword;
document.getElementById("first_name").oninput = validatePassword;
document.getElementById("last_name").oninput = validatePassword;

// live password message
const errPass = document.getElementById("err_password");
pass.addEventListener("input", function () {
  validatePassword();
  errPass.textContent = pass.validationMessage;
});
confirm.addEventListener("input", function () {
  validatePassword();
  errPass.textContent = confirm.validationMessage || pass.validationMessage;
});

// DOB bounds min= - 120 years and max = today + message
const dob = document.getElementById("dob");
const today = new Date();
const maxBirth = today.toISOString().split("T")[0];
const minBirth = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate())
  .toISOString().split("T")[0];
dob.max = maxBirth;
dob.min = minBirth;

dob.addEventListener("change", () => {
  const err = document.getElementById("err_dob");
  err.textContent = "";
  if (dob.value < dob.min || dob.value > dob.max) {
    err.textContent = `DOB must be between ${dob.min} and ${dob.max}`;
    error_flag = 1;
  }
});

// phone checker
const phone = document.getElementById("phone_number");
phone.addEventListener("input", () => {
  const err = document.getElementById("err_phone");
  err.textContent = phone.validity.patternMismatch ? "Use 000-000-0000" : "";
  if (err.textContent) error_flag = 1;
});

//first name checker
function checkfirstname(){
  var el = document.getElementById("first_name");
  var v = (el.value || "").trim();
  if (v.length < 1) {
    document.getElementById("err_first_name").innerHTML = "First name is required.";
    el.classList.add("is-invalid");
    error_flag = 1;
  } else if (!/^[A-Za-z'\-]{1,30}$/.test(v)) {
    document.getElementById("err_first_name").innerHTML = "Letters, apostrophes, and dashes only (1–30).";
    el.classList.add("is-invalid");
    error_flag = 1;
  } else {
    document.getElementById("err_first_name").innerHTML = "";
    el.classList.remove("is-invalid");
  }
}

//check middle initial
function checkmiddle(){
  var el = document.getElementById("middle_initial");
  if (!el) return;  // in case you haven't renamed yet
  var v = (el.value || "").trim();
  if (v.length === 0) {
    document.getElementById("err_middle_initial").innerHTML = "";
    el.classList.remove("is-invalid");
  } else if (!/^[A-Za-z]$/.test(v)) {
    document.getElementById("err_middle_initial").innerHTML = "Single letter only.";
    el.classList.add("is-invalid");
    error_flag = 1;
  } else {
    document.getElementById("err_middle_initial").innerHTML = "";
    el.classList.remove("is-invalid");
  }
}

//check last name
function checklastname(){
  var el = document.getElementById("last_name");
  var v = (el.value || "").trim();
  if (v.length < 1) {
    document.getElementById("err_last_name").innerHTML = "Last name is required.";
    el.classList.add("is-invalid");
    error_flag = 1;
  } else if (!/^[A-Za-z'\-]{1,30}$/.test(v)) {
    document.getElementById("err_last_name").innerHTML = "Letters, apostrophes, and dashes only (1–30).";
    el.classList.add("is-invalid");
    error_flag = 1;
  } else {
    document.getElementById("err_last_name").innerHTML = "";
    el.classList.remove("is-invalid");
  }
}

//check user id
function checkuserid(){
  var el = document.getElementById("user_id");
  var v = (el.value || "").trim();
  if (!/^(?!\d)[A-Za-z0-9_-]{5,30}$/.test(v)) {
    document.getElementById("err_user_id").innerHTML = "5–30, not starting with a digit; letters/digits/_/- only.";
    el.classList.add("is-invalid");
    error_flag = 1;
  } else {
    document.getElementById("err_user_id").innerHTML = "";
    el.classList.remove("is-invalid");
  }
}

//check email
function checkemail(){
  var el = document.getElementById("email");
  var v = (el.value || "").trim().toLowerCase();
  el.value = v; // force lowercase
  if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(v)) {
    document.getElementById("err_email").innerHTML = "Use name@domain.tld";
    el.classList.add("is-invalid");
    error_flag = 1;
  } else {
    document.getElementById("err_email").innerHTML = "";
    el.classList.remove("is-invalid");
  }
}

//check address
function checkaddr(){
  var el = document.getElementById("address");
  var v = (el.value || "").trim();
  if (v.length < 2 || v.length > 30) {
    document.getElementById("err_address").innerHTML = "2–30 characters.";
    el.classList.add("is-invalid");
    error_flag = 1;
  } else {
    document.getElementById("err_address").innerHTML = "";
    el.classList.remove("is-invalid");
  }
}

//check 2nd address
function checkaddr2(){
  var el = document.getElementById("2nd_address");
  if (!el) return;
  var v = (el.value || "").trim();
  if (v.length === 0) {
    document.getElementById("err_2nd_address").innerHTML = "";
    el.classList.remove("is-invalid");
  } else if (v.length > 30) {
    document.getElementById("err_2nd_address").innerHTML = "Up to 30 characters.";
    el.classList.add("is-invalid");
    error_flag = 1;
  } else {
    document.getElementById("err_2nd_address").innerHTML = "";
    el.classList.remove("is-invalid");
  }
}

//check city
function checkcity(){
  var el = document.getElementById("city");
  var v = (el.value || "").trim();
  if (v.length < 2) {
    document.getElementById("err_city").innerHTML = "City is required (2–30).";
    el.classList.add("is-invalid");
    error_flag = 1;
  } else if (!/^[A-Za-z' \-]{2,30}$/.test(v)) {
    document.getElementById("err_city").innerHTML = "Letters/apostrophes/dashes/spaces (2–30).";
    el.classList.add("is-invalid");
    error_flag = 1;
  } else {
    document.getElementById("err_city").innerHTML = "";
    el.classList.remove("is-invalid");
  }
}

//check state
function checkstate(){
  var el = document.getElementById("state");
  if (!el.value) {
    document.getElementById("err_state").innerHTML = "Please select a state.";
    el.classList.add("is-invalid");
    error_flag = 1;
  } else {
    document.getElementById("err_state").innerHTML = "";
    el.classList.remove("is-invalid");
  }
}

//check zip
function checkzip(){
  var el = document.getElementById("zip");
  var v = (el.value || "").trim();
  if (!/^\d{5}$/.test(v)) {
    document.getElementById("err_zip").innerHTML = "Zip must be 5 digits.";
    el.classList.add("is-invalid");
    error_flag = 1;
  } else {
    document.getElementById("err_zip").innerHTML = "";
    el.classList.remove("is-invalid");
  }
}

//check ssn
function checkssn(){
  var el = document.getElementById("SSN");
  var digits = el.value.replace(/\D/g, "");
  if (digits.length !== 9) {
    document.getElementById("err_SSN").innerHTML = "SSN must be 9 digits.";
    el.classList.add("is-invalid");
    error_flag = 1;
  } else {
    document.getElementById("err_SSN").innerHTML = "";
    el.classList.remove("is-invalid");
  }
}

//re-check dob and previous listener writes the message if needed
function checkdob(){
  var err = document.getElementById("err_dob");
  if (dob.value < dob.min || dob.value > dob.max) {
    err.textContent = `DOB must be between ${dob.min} and ${dob.max}`;
    error_flag = 1;
  }
}

//password check using prev validate pass and error msg 
function checkpasswords(){
  validatePassword();
  var msg = confirm.validationMessage || pass.validationMessage;
  if (msg) {
    error_flag = 1;
  }
}

//check health rating slider
function checkslider(){
  var s = document.getElementById("health_rating");
  var v = Number(s.value);
  if (Number.isNaN(v) || v < 1 || v > 10) {
    document.getElementById("err_health_rating").innerHTML = "Choose 1–10.";
    error_flag = 1;
  } else {
    document.getElementById("err_health_rating").innerHTML = "";
  }
}

//check groups for radio
function checkGroup(name, errId, msg){
  var any = document.querySelector('input[name="'+name+'"]:checked');
  if (!any) {
    document.getElementById(errId).innerHTML = msg;
    error_flag = 1;
  } else {
    document.getElementById(errId).innerHTML = "";
  }
}
function checksex(){ checkGroup("sex","err_sex","Please select sex."); }
function checkinsurance(){ checkGroup("insurance","err_insurance","Please select insurance."); }
function checkvaccinated(){ checkGroup("vaccinated","err_vaccinated","Please select vaccination status."); }
function checkexercise(){ checkGroup("exercise","err_exercise","Please select exercise frequency."); }


//live checks and validate then submit btn
document.addEventListener("DOMContentLoaded", function(){
  
 // current date for the title area/header
  var cd = document.getElementById("current_date");
  if (cd) cd.textContent = new Date().toLocaleDateString();

 
  var ssn = document.getElementById("SSN");
  ssn.addEventListener("input", function(){
    var caret = ssn.selectionStart;
    ssn.value = formatSSN(ssn.value);
    checkssn();
    try { ssn.setSelectionRange(caret, caret); } catch(e){}
  });

 //live slider 
  var slider = document.getElementById("health_rating");
  var output = document.getElementById("rangedisplay");
  output.innerHTML = slider.value;
  slider.oninput = function(){ output.innerHTML = this.value; checkslider(); };

 // check each field live
  document.getElementById("first_name").addEventListener("blur", checkfirstname);
  var mi = document.getElementById("middle_initial");
  if (mi) mi.addEventListener("input", checkmiddle);
  document.getElementById("last_name").addEventListener("blur", checklastname);

  document.getElementById("user_id").addEventListener("input", function(){ checkuserid(); checkpasswords(); });
  document.getElementById("email").addEventListener("blur", checkemail);

  document.getElementById("address").addEventListener("blur", checkaddr);
  var addr2 = document.getElementById("2nd_address");
  if (addr2) addr2.addEventListener("input", checkaddr2);
  document.getElementById("city").addEventListener("blur", checkcity);
  document.getElementById("state").addEventListener("change", checkstate);
  document.getElementById("zip").addEventListener("input", checkzip);

//radios check
  ["sex","insurance","vaccinated","exercise"].forEach(function(n){
    document.querySelectorAll('input[name="'+n+'"]').forEach(function(r){
      r.addEventListener("change", function(){
        if (n==="sex") checksex();
        if (n==="insurance") checkinsurance();
        if (n==="vaccinated") checkvaccinated();
        if (n==="exercise") checkexercise();
      });
    });
  });

//validate btn
  var btnValidate = document.getElementById("btnValidate");
  if (btnValidate) btnValidate.addEventListener("click", checkform);

// if form is cleared -> hide sbmt
  var btnClear = document.getElementById("btnClear");
  if (btnClear) btnClear.addEventListener("click", function(){ setTimeout(function(){ togglesubmit(false); }, 0); });
});


function checkform() {
  error_flag = 0;
  checkfirstname(); 
  checkmiddle(); 
  checklastname();
  checkuserid(); 
  checkemail(); 
  checkaddr(); 
  checkaddr2(); 
  checkcity(); 
  checkstate(); 
  checkzip();
  checkssn(); 
  checkdob(); 
  checkpasswords(); 
  checkslider();
  checksex(); 
  checkinsurance(); 
  checkvaccinated(); 
  checkexercise();

  if (error_flag === 1) {
    alert("Please fix the indicated errors!");
    togglesubmit(false);
  } else {
    togglesubmit(true);
  }
}
    togglesubmit(true); 
  }
}
