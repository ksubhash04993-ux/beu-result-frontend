const BACKEND = "https://beta-5hut.onrender.com";

let latestResult = null;

fetch(BACKEND + "/api/exams")
  .then(res => res.json())
  .then(data => {
    const select = document.getElementById("examSelect");
    data.exams.forEach(exam => {
      const opt = document.createElement("option");
      opt.value = exam.link;
      opt.innerText = exam.title;
      select.appendChild(opt);
    });
  });

function getResult() {
  const regNo = document.getElementById("regNo").value;
  const link = document.getElementById("examSelect").value;

  fetch(BACKEND + "/api/result", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ reg_no: regNo, link: link })
  })
  .then(res => res.json())
  .then(data => {
    latestResult = data.result;   // SAVE RESULT
    document.getElementById("output").innerText =
      JSON.stringify(data, null, 2);
  });
}

function downloadPDF() {
  const regNo = document.getElementById("regNo").value;
  const examTitle = document.getElementById("examSelect").selectedOptions[0].innerText;

  if (!latestResult) {
    alert("First fetch result");
    return;
  }

  fetch(BACKEND + "/api/download-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      reg_no: regNo,
      exam_title: examTitle,
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
