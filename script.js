// Wait for the DOM content to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded", () => {
  // Create a SpeechRecognition object using the webkitSpeechRecognition API (for older browsers) or the standard SpeechRecognition API
  const recognition = new webkitSpeechRecognition() || new SpeechRecognition();

  // Get references to various DOM elements
  const languageSelect = document.getElementById("language");
  const resultContainer = document.querySelector(".result p.resultText");
  const startListeningButton = document.querySelector(".btn.record");
  const recordButtonText = document.querySelector(".btn.record p");
  const clearButton = document.querySelector(".btn.clear");
  const downloadButton = document.querySelector(".btn.download");

  // Flag to track whether speech recognition is currently active
  let recognizing = false;

  // Loop through an array of language options and populate the language select dropdown
  languages.forEach((language) => {
    const option = document.createElement("option");
    option.value = language.code;
    option.text = language.name;
    languageSelect.add(option);
  });

  // Configure recognition settings
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = languageSelect.value;

  // Event listener for language selection change
  languageSelect.addEventListener("change", () => {
    recognition.lang = languageSelect.value;
  });

  // Event listener for the "Start/Stop Listening" button
  startListeningButton.addEventListener("click", toggleSpeechRecognition);

  // Event listener for the "Clear" button
  clearButton.addEventListener("click", clearResults);

  // Disable the download button initially
  downloadButton.disabled = true;

  // Event handler for speech recognition results
  recognition.onresult = (event) => {
    // Get the final transcript from the last result
    const result = event.results[event.results.length - 1][0].transcript;

    // Update the result container with the recognized text
    resultContainer.textContent = result;

    // Enable the download button as there is now a result to download
    downloadButton.disabled = false;
  };

  // Event handler for the end of speech recognition
  recognition.onend = () => {
    // Update the recognition state and UI elements
    recognizing = false;
    startListeningButton.classList.remove("recording");
    recordButtonText.textContent = "Start Listening";
  };

  // Event listener for the "Download" button
  downloadButton.addEventListener("click", downloadResult);

  // Function to toggle speech recognition on/off
  function toggleSpeechRecognition() {
    // If currently recognizing, stop recognition; otherwise, start recognition
    if (recognizing) {
      recognition.stop();
    } else {
      recognition.start();
    }

    // Toggle the recognizing flag
    recognizing = !recognizing;

    // Toggle the "recording" class for styling purposes
    startListeningButton.classList.toggle("recording", recognizing);

    // Update the button text based on the current recognition state
    recordButtonText.textContent = recognizing
      ? "Stop Listening"
      : "Start Listening";
  }

  // Function to clear the result container and disable the download button
  function clearResults() {
    resultContainer.textContent = "";
    downloadButton.disabled = true;
  }

  // Function to initiate the download of the recognized text
  function downloadResult() {
    // Get the text content from the result container
    const resultText = resultContainer.textContent;

    // Create a Blob containing the text with a specified MIME type
    const blob = new Blob([resultText], { type: "text/plain" });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a hidden anchor element for downloading
    const a = document.createElement("a");
    a.href = url;
    a.download = "Your-Text.txt";
    a.style.display = "none";

    // Append the anchor to the document body, trigger a click event, and remove the anchor
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Release the URL object
    URL.revokeObjectURL(url);
  }
});
