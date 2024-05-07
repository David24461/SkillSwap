// Creates a form to upload a file  -->
const uploadForm = document.querySelector('form');

uploadForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const url = new URL(form.action);
    const formData = new FormData(form);

    const fetchOptions = {
        method: form.method,
        body: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    };

    fetch(url, fetchOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);

            let a = document.createElement('a');
            a.href = data.fileUrl;
            a.download = 'file';
            ``
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        })
        .catch(error => console.error(error));
});

const handleSubmit = (event) => {
    event.preventDefault(); // prevent the default form submit
    const form = event.currentTarget; // get the form element
    const url = new URL(form.action); // create a new URL object from the form action

    fetch(url, { method: form.method, body: new FormData(form) }) // send a POST request with the form data
        .then(response => response.json()) // parse the JSON from the server
        .then(data => console.log(data)) // log the data from the server
        .catch(error => console.error(error)); // log any errors from the server
};
