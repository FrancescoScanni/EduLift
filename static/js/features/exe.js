const { jsPDF } = window.jspdf;

const textArea=document.getElementById("prompt")
const insertText=document.getElementById("insertText")

const wait=document.getElementById("wait") //wait until...
const downloadLink = document.getElementById("dwnldEse")
const pdfImg=document.getElementById("pDf")
downloadLink.style.visibility="hidden"
pdfImg.style.visibility="hidden"


//pick text from textbox
insertText.addEventListener("click",async()=>{
    let prompt=textArea.value

    const response =await fetch("/api/openai", { //fetching directly the openai file linked to vercel,again
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            input: `You are a virtual teacher. The user provides a general topic.  
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
                    Do not add any extra text outside of JSON. The topic is: ${prompt}
                    `
        })
    })
    const data = await response.json()
    const exercises = JSON.parse(data.choices[0].message.content);
    console.log(exercises);

    downloadLink.style.visibility="visible"
    pdfImg.style.visibility="visible"
    wait.textContent="Your exercises are ready, click to download them!"

    downloadLink.addEventListener("click",()=>{
        const doc = new jsPDF();
        let y=20
        exercises.exercises.forEach((ex, i) => {
            doc.setFontSize(16);
            doc.text(`${i + 1}. ${ex.title}`, 10, y);
            y += 10;

            doc.setFontSize(12);
            doc.text(`Objective: ${ex.objective}`, 10, y);
            y += 10;

            ex.steps.forEach((step, idx) => {
            doc.text(`${idx + 1}. ${step}`, 15, y);
            y += 10;
            });

            doc.text(`Task: ${ex.task}`, 10, y);
            y += 20;

            if (y > 270 && i < exercises.length - 1) {
            doc.addPage();
            y = 20;
            }
        })

        doc.save(`${prompt}.pdf`)
    })
})







