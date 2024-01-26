const fileName = document.getElementById("filename");
const textArea = document.getElementById("keywords-textarea");
const keywordsForm = document.getElementById("keywords-form");
const btnDownload = document.querySelector(".download-file");
const btnDelete = document.querySelector(".delete-file");

function downloadFile(url, fileName){
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

document.addEventListener('DOMContentLoaded', () => {
    //console.log(localStorage.getItem('username'));
    fetch('/get_document', {
        method: 'POST',
        headers: {
            'fileid': localStorage.getItem('fileId')
        },
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Display user's documents on the main page
          //console.log(data.doc.originalname);
          
          fileName.innerHTML = data.doc.originalname;
          let keyWordsString = '';
          for (let i = 0; i < data.doc.keywords.length - 1; i++) {
            keyWordsString += data.doc.keywords[i] + ", ";
          }
          keyWordsString += data.doc.keywords[data.doc.keywords.length - 1];
          if (keyWordsString) {
            textArea.value = keyWordsString;
          }
          btnDownload.addEventListener('click', () => {
            downloadFile("/uploads/" + data.doc.filename, data.doc.originalname);
          });
          btnDelete.addEventListener('click', () => {
            const confirm = window.confirm("Are you sure you want to delete this file?");
            if (confirm) {
                fetch('/delete_document', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({fileid: localStorage.getItem('fileId')})
                  })
                  .then(response => response.json())
                  .then(data => {
                    if (data.success) {
                        localStorage.removeItem('fileId');
                        location.href = "mainpage.html";
                    } else {
                      console.error('Error:', data.message);
                      // Handle error response
                    }
                  })
                  .catch(error => {
                    //console.error('Error:', error);
                    // Handle fetch error
                  });
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

keywordsForm.addEventListener('submit', (event) => {
    event.preventDefault();

    let textAreaString = '';
    for (let i = 0; i < textArea.value.length; i++) {
        if (textArea.value[i] !== " ") {
            textAreaString += textArea.value[i];
        }
    }
    //console.log(textAreaString);
    let textAreaArray = textAreaString.split(",");
    const data = {
      fileid: localStorage.getItem('fileId'),
      keywordsArray: textAreaArray
    };
    //console.log(JSON.stringify(data));
    fetch('/upload_keywords', {
        method: 'POST',
        headers: {                             
            "Content-Type": "application/json" 
          }   ,
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('The keywords were successfully updated');
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

