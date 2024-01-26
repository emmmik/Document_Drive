const btnLogoutPopup = document.querySelector(".btnLogout-popup");
const uploadForm = document.getElementById('upload-form');
const uploadFormDiv = document.getElementById('upload-form-div');
const uploadMessage = document.querySelector('.upload-message');
const uploadedFile = document.querySelector('.uploaded-file');
const fileInput = document.getElementById('file-input');
const btnUpload = document.querySelector('.btnFileInput');
let draggedfile;

btnLogoutPopup.addEventListener("click", () => {
    localStorage.removeItem('username');
    location.href = "index.html";
});

uploadForm.addEventListener('submit', function (event) {
    event.preventDefault();
    //console.log("hello");

    const file = fileInput.files[0] || draggedfile;

    if (!file) {
        alert('Please select a file.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    //console.log(FormData);

    fetch('/upload', {
        method: 'POST',
        headers: { 
            'Username': localStorage.getItem('username')
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            uploadMessage.innerHTML = 'The file was successfully uploaded';
        } else {
            uploadMessage.innerHTML = 'Could not upload the file';
        }
    })
    .catch(error => {
        console.error('Error uploading file:', error);
        document.getElementById('result').innerText = 'Error uploading file.';
    });
  });

uploadFormDiv.addEventListener("dragenter", (event) => {
    event.preventDefault();
    event.stopPropagation();
    uploadFormDiv.classList.add("active");
});

uploadFormDiv.addEventListener("dragleave", (event) => {
    event.preventDefault();
    event.stopPropagation();
    uploadFormDiv.classList.remove("active");
});

uploadFormDiv.addEventListener("dragover", (event) => {
    event.preventDefault();
    event.stopPropagation();
    uploadFormDiv.classList.add("active");
});

uploadFormDiv.addEventListener("drop", (event) => {
    event.preventDefault();
    event.stopPropagation();
    uploadFormDiv.classList.remove("active");
    let draggedData = event.dataTransfer;
    draggedfile = draggedData.files[0];
    uploadedFile.innerHTML = draggedfile.name;
    //console.log(draggedfile);
});

btnUpload.addEventListener("change", () => {
    // console.log(btnUpload.files[0]);
    uploadedFile.innerHTML = btnUpload.files[0].name;
});