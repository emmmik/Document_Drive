const btnLogoutPopup = document.querySelector(".btnLogout-popup");
const fileBox = document.querySelector(".file-box");
const btnPopupClose  = document.querySelector(".close-btn");
const mainDiv = document.getElementById('main');
const searchInput = document.querySelector('.search-input');

document.addEventListener('DOMContentLoaded', () => {
    //console.log(localStorage.getItem('username'));
    fetch('/user_docs', {
        method: 'POST',
        headers: {
            'Username': localStorage.getItem('username')
        },
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Display user's documents on the main page
          data.documents.forEach(doc => {
            // const listItem = document.createElement('li');
            // listItem.textContent = document.filename; // Display filename or other document information
            // documentsList.appendChild(listItem);
            //console.log('OK');
            //console.log(mainDiv);
            const fileBox = document.createElement('div');
            fileBox.classList.add("file-box");
            //console.log(fileBox);
            const documentLogo = document.createElement('div');
            documentLogo.classList.add("document-logo");
            const documentEmoji = document.createElement('p');
            documentEmoji.classList.add("document-emoji");
            documentEmoji.innerHTML = "&#128196";
            const documentName = document.createElement('div');
            documentName.classList.add("document-name");
            const fileName = document.createElement('p');
            if (doc.originalname.length <= 15) {
                fileName.innerHTML = doc.originalname;
              } else {
                fileName.innerHTML = doc.originalname.substring(0, 5) + "..." + doc.originalname.substring(doc.originalname.length - 6, doc.originalname.length);
              }
              //console.log(doc.originalname.substring(0, 5) + "..." + doc.originalname.substring(doc.originalname.length - 6, doc.originalname.length));
              //console.log(typeof doc.originalname);
            const documentSize = document.createElement('div');
            documentSize.classList.add("document-size");
            const sizeText = document.createElement('p');
            sizeText.innerHTML = "Size " + (Math.round(doc.filesize * 100) / 100).toFixed(2) + " MB";
            documentLogo.appendChild(documentEmoji);
            documentName.appendChild(fileName);
            documentSize.appendChild(sizeText);
            //console.log(documentLogo);
            fileBox.appendChild(documentLogo);
            fileBox.appendChild(documentName);
            fileBox.appendChild(documentSize);
            fileBox.setAttribute("id", doc.filename);

            mainDiv.appendChild(fileBox);
          });
            console.log(mainDiv);
            mainDiv.addEventListener("click", (event) => {
                //console.log(event.target.closest(".file-box"));
                if (event.target.closest(".file-box")) {
                    //console.log(event.target.closest(".file-box").id);
                    localStorage.setItem('fileId', event.target.closest(".file-box").id);
                    location.href = "fileinfo.html";
                }
            });
        } else {
          console.error('Error:', data.message);
          // Handle error response
        }
      })
      .catch(error => {
        //console.error('Error:', error);
        // Handle fetch error
      });
});

searchInput.addEventListener('keyup', (event) => {
    //if (event.keyCode === 13) {
        //console.log(searchInput.value);
        //event.preventDefault();
        console.log(searchInput.value);
        fetch('/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({searchInput: searchInput.value, username: localStorage.getItem('username')})
          })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
                //console.log(data.documents, searchInput.value);
                mainDiv.innerHTML = '';
              // Display user's documents on the main page
              data.documents.forEach(doc => {
                // const listItem = document.createElement('li');
                // listItem.textContent = document.filename; // Display filename or other document information
                // documentsList.appendChild(listItem);
                //console.log('OK');
                //console.log(mainDiv);
                const fileBox = document.createElement('div');
                fileBox.classList.add("file-box");
                //console.log(fileBox);
                const documentLogo = document.createElement('div');
                documentLogo.classList.add("document-logo");
                const documentEmoji = document.createElement('p');
                documentEmoji.classList.add("document-emoji");
                documentEmoji.innerHTML = "&#128196";
                const documentName = document.createElement('div');
                documentName.classList.add("document-name");
                const fileName = document.createElement('p');
                if (doc.originalname.length <= 15) {
                    fileName.innerHTML = doc.originalname;
                  } else {
                    fileName.innerHTML = doc.originalname.substring(0, 5) + "..." + doc.originalname.substring(doc.originalname.length - 6, doc.originalname.length);
                  }
                const documentSize = document.createElement('div');
                documentSize.classList.add("document-size");
                const sizeText = document.createElement('p');
                sizeText.innerHTML = "Size " + (Math.round(doc.filesize * 100) / 100).toFixed(2) + " MB";
                documentLogo.appendChild(documentEmoji);
                documentName.appendChild(fileName);
                documentSize.appendChild(sizeText);
                //console.log(documentLogo);
                fileBox.appendChild(documentLogo);
                fileBox.appendChild(documentName);
                fileBox.appendChild(documentSize);
                fileBox.setAttribute("id", doc.filename);
    
                mainDiv.appendChild(fileBox);
              });
                //console.log(mainDiv);
                mainDiv.addEventListener("click", (event) => {
                    //console.log(event.target.closest(".file-box"));
                    if (event.target.closest(".file-box")) {
                        //console.log(event.target.closest(".file-box").id);
                        localStorage.setItem('fileId', event.target.closest(".file-box").id);
                        location.href = "fileinfo.html";
                    }
                });
            } else {
              console.error('Error:', data.message);
              // Handle error response
            }
          })
          .catch(error => {
            //console.error('Error:', error);
            // Handle fetch error
          });
    //}
});

btnLogoutPopup.addEventListener("click", () => {
    localStorage.removeItem('username');
    location.href = "index.html";
});

