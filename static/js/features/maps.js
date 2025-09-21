import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs";
mermaid.initialize({ 
    startOnLoad: false, 
    securityLevel: 'loose', // permette l’uso del canvas
    themeVariables: { fontFamily: 'Arial' }
});

const buttonTTS = document.getElementById("generateTTS"); //generate button
const upload =document.getElementById("upload") //upload file txt
const fileInput=document.getElementById("fileInput") //file inserted
const wait=document.getElementById("wait") //wait until...
const downloadLink = document.getElementById("showMap")
const dwnldMap=document.getElementById("dwnldMap") //a from maps
downloadLink.style.visibility="hidden"
const map =document.getElementById("map") //generated map
let text
let apiKey ="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"




//detect text from file
fileInput.addEventListener('change', async (event) => {
    buttonTTS.style.scale="1.1"
    buttonTTS.classList.add("border-[4px]")
    upload.textContent="File inserted!"
    const file = event.target.files[0]; // Get the first selected file
    if (!file) return; // No file selected
        try {
            text = await file.text(); // Read file as text
            // Store in variable
            console.log("File content:", text);
        } catch (error) {
            console.error("Error reading file:", error);
    }
});


buttonTTS.addEventListener("click", async()=>{

    const response =await fetch("/api/openai", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            input: `Do a rich research improving these notes (dont use special symbols, just letters and a mermaid-translateable text). Then convert the result text into Mermaid code (respond only with the mermaid code and strip it not with backsticks but with ''. Optimize the mermaid code making it functional withouth adding any additional character and in a 14:9 layout, always start with graph TD):\n\n${text}`
        })
    });

    const data = await response.json();

    downloadLink.style.visibility="visible"
    wait.textContent="Your map is ready, click to see it!"
    const mermaidCode = data.choices?.[0]?.message?.content || "No Mermaid code generated";
    console.log(mermaidCode)
    //RENDER MAP
    const { svg } = await mermaid.render("generatedDiagram", mermaidCode);
    map.innerHTML = svg;


    //create download link for image
    const svgElement = map.querySelector("svg");
    if (svgElement) {
        // Serialize the SVG
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        // Update download link to download the SVG directly
        dwnldMap.setAttribute("href", url);
        dwnldMap.setAttribute("download", "mermaid-diagram.svg");
        
        // Optional: revoke object URL when user clicks
        dwnldMap.addEventListener("click", () => {
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        });
    }
})




