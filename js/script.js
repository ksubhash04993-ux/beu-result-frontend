const BACKEND = "https://beta-5hut.onrender.com";

let latestResult = null;

// Hardcoded semester list
const semesters = [
  { value: "1", text: "Semester 1" },
  { value: "2", text: "Semester 2" },
  { value: "3", text: "Semester 3" },
  { value: "4", text: "Semester 4" },
  { value: "5", text: "Semester 5" },
  { value: "6", text: "Semester 6" },
  { value: "7", text: "Semester 7" },
  { value: "8", text: "Semester 8" }
];

const select = document.getElementById("examSelect");
semesters.forEach(s => {
  const opt = document.createElement("option");
  opt.value = s.value;
  opt.innerText = s.text;
  select.appendChild(opt);
});

function getResult() {
  const regNo = document.getElementById("regNo").value;
  const sem = document.getElementById("examSelect").value;

  if (!regNo || !sem) {
    alert("Please enter Registration No and select Semester");
    return;
  }

  fetch(BACKEND + "/api/result", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ reg_no: regNo, sem: sem })
  })
  .then(res => res.json())
  .then(data => {
    latestResult = data.result;
    document.getElementById("output").innerText =
      JSON.stringify(data, null, 2);
  })
  .catch(err => {
    document.getElementById("output").innerText = "Error: " + err;
  });
}

function downloadPDF() {
  const regNo = document.getElementById("regNo").value;
  const semText = document.getElementById("examSelect").selectedOptions[0].innerText;

  if (!latestResult) {
    alert("First fetch result");
    return;
  }

  fetch(BACKEND + "/api/download-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      reg_no: regNo,
      exam_title: semText,
      result: latestResult
    })
  })
  .then(res => res.blob())
  .then(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `BEU_Result_${regNo}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  });
}
