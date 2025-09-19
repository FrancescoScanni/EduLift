
const buttonTTS = document.getElementById("generateTTS"); //generate button
const upload =document.getElementById("upload") //upload file txt
const fileInput=document.getElementById("fileInput") //file inserted
const downloadLink = document.getElementById("downloadTTS"); //final dwnld
let textContent
let text

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

//generate an audio after the lick
buttonTTS.addEventListener("click", async () => {
    console.log(text)
    const language = "en-us";
    const apiKey = "e82319ee249b41d9b47479801a8466e3";
    const url = `https://api.voicerss.org/?key=${apiKey}&hl=${language}&src=${encodeURIComponent(text)}&c=MP3&f=44khz_16bit_stereo`;
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);

        downloadLink.href = objectUrl;
        downloadLink.style.display = "inline";
    } catch (err) {
        console.error("Errore TTS:", err);
    }
    downloadLink.setAttribute('download', 'textToSpeech.mp3');
});

