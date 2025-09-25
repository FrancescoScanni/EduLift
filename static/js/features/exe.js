const { jsPDF } = window.jspdf;
const WORKER_URL = document.querySelector('meta[name="worker-url"]')?.content || "https://edulift.frascanni07.workers.dev/";

const textArea = document.getElementById("prompt");
const insertText = document.getElementById("insertText");
const wait = document.getElementById("wait");
const downloadLink = document.getElementById("dwnldEse");
const pdfImg = document.getElementById("pDf");
downloadLink.style.visibility = "hidden";
pdfImg.style.visibility = "hidden";

async function ask(prompt){
  const r = await fetch(WORKER_URL, { 
    method:"POST", 
    headers:{"Content-Type":"application/json"}, 
    body: JSON.stringify({ prompt }) 
  });
  return (await r.json()).text;
}

insertText.addEventListener("click", async () => {
  const topic = textArea.value;
  wait.textContent = "Generating...";

  const p = `You are a virtual teacher. The user provides a general topic.  
                Generate 6 guided exercises on the topic.  
                Each exercise should include:
                    1. A clear title.
                    2. A brief objective.
                    3. Step-by-step instructions.
                    4. A final question or practical task.
                Respond in **JSON** format only so it can be easily used in code:
                {
                    "exercises": [
                        {
                            "title": "Exercise title",
                            "objective": "Short objective",
                            "steps": ["Step 1", "Step 2", "..."],
                            "task": "Final question or practical task"
                        }
                    ]
                }
                Do not add any extra text outside of JSON (backsticks neither, it must be pure json). The topic is: ${topic}
            `;
  
  const code = await ask(p);
  const exercises = JSON.parse(code);

  downloadLink.style.visibility = "visible";
  pdfImg.style.visibility = "visible";
  wait.textContent = "Your exercises are ready, click to download them!";

  downloadLink.onclick = () => {
    const doc = new jsPDF();
    let y = 20;

    exercises.exercises.forEach((ex, i) => {
      doc.setFontSize(16);
      doc.text(`${i + 1}. ${ex.title}`, 10, y); y += 10;
      doc.setFontSize(8);
      doc.text(`Objective: ${ex.objective}`, 10, y); y += 10;
      ex.steps.forEach((s, idx) => { doc.text(`${idx + 1}. ${s}`, 15, y); y += 10; });
      doc.text(`Task: ${ex.task}`, 10, y); y += 20;
      if (y > 270 && i < exercises.exercises.length - 1) { doc.addPage(); y = 20; }
    });

    doc.save(`${topic}.pdf`);
    window.location.href="exe.html"
  };
});
