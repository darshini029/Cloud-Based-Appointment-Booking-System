let token = localStorage.getItem("appointmentToken");
let userName = localStorage.getItem("appointmentUser");
let isRegister = false;

function showPage(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.remove("active"));
  if(id === "appointments") loadAppointments();
}

function toggleAuth(){
  isRegister = !isRegister;
  document.getElementById("authTitle").textContent = isRegister ? "Create Account" : "Welcome Back";
  document.getElementById("nameGroup").classList.toggle("hidden", !isRegister);
  document.querySelector("#authForm .primary").textContent = isRegister ? "Register" : "Login";
  document.getElementById("authSwitch").innerHTML = isRegister
    ? 'Already have an account? <button class="link" onclick="toggleAuth()">Login</button>'
    : 'Don\\'t have an account? <button class="link" onclick="toggleAuth()">Register</button>';
}

document.getElementById("authForm").addEventListener("submit", async e=>{
  e.preventDefault();
  const body = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };
  const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
  const res = await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  const data = await res.json();
  const msg = document.getElementById("authMessage");
  msg.textContent = data.message || "Something went wrong.";
  msg.style.color = res.ok ? "#148452" : "#c64b4b";
  if(res.ok && isRegister){
    setTimeout(()=>toggleAuth(),500);
  } else if(res.ok){
    token = data.token;
    userName = data.name;
    localStorage.setItem("appointmentToken",token);
    localStorage.setItem("appointmentUser",userName);
    updateLoginUI();
    showPage("book");
  }
});

document.getElementById("bookingForm").addEventListener("submit", async e=>{
  e.preventDefault();
  if(!token){ showPage("login"); return; }
  const body={
    service:document.getElementById("service").value,
    date:document.getElementById("date").value,
    time:document.getElementById("time").value,
    notes:document.getElementById("notes").value
  };
  const res=await fetch("/api/appointments",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+token},body:JSON.stringify(body)});
  const data=await res.json();
  const msg=document.getElementById("bookingMessage");
  msg.textContent=data.message||"Done.";
  msg.style.color=res.ok?"#148452":"#c64b4b";
  if(res.ok){ document.getElementById("bookingForm").reset(); setTimeout(()=>showPage("appointments"),600); }
});

async function loadAppointments(){
  const list=document.getElementById("appointmentList");
  if(!token){ list.innerHTML='<div class="empty">Please login to view your appointments.</div>'; return; }
  const res=await fetch("/api/appointments",{headers:{Authorization:"Bearer "+token}});
  if(!res.ok){ list.innerHTML='<div class="empty">Please login again.</div>'; return; }
  const items=await res.json();
  if(!items.length){ list.innerHTML='<div class="empty">No appointments yet. Book your first appointment!</div>'; return; }
  list.innerHTML=items.map(a=>`
    <div class="appointment-card">
      <div>
        <h3>${escapeHtml(a.service)}</h3>
        <div class="appointment-meta">📅 ${escapeHtml(a.date)} &nbsp; • &nbsp; ⏰ ${escapeHtml(a.time)}<br>${a.notes?escapeHtml(a.notes):"No additional notes"}</div>
        ${a.status==="Booked"?`<button class="cancel" onclick="cancelAppointment('${a._id}')">Cancel Appointment</button>`:""}
      </div>
      <span class="status ${a.status}">${a.status}</span>
    </div>`).join("");
}

async function cancelAppointment(id){
  if(!confirm("Cancel this appointment?")) return;
  const res=await fetch("/api/appointments/"+id+"/cancel",{method:"PATCH",headers:{Authorization:"Bearer "+token}});
  const data=await res.json();
  alert(data.message);
  loadAppointments();
}

function logout(){
  localStorage.removeItem("appointmentToken");
  localStorage.removeItem("appointmentUser");
  token=null; userName=null;
  updateLoginUI();
  showPage("home");
}

function updateLoginUI(){
  document.getElementById("loginNav").classList.toggle("hidden",!!token);
  document.getElementById("logoutBtn").classList.toggle("hidden",!token);
}

function escapeHtml(value){
  return String(value).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}

document.getElementById("date").min = new Date().toISOString().split("T")[0];
updateLoginUI();