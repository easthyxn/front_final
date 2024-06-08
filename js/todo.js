const host = "http://127.0.0.1:80"; // Ensure this is the correct port where your server is running
const guestbookContainer = document.querySelector('.guestbook-container');

function getEntries() {
    axios.get(`${host}/todo`)
        .then(response => {
            const entries = response.data || [];
            renderEntries(entries);
        })
        .catch(error => {
            console.error('Error fetching guestbook entries:', error);
        });
}

function renderEntries(entries) {
    guestbookContainer.innerHTML = '';
    if (Array.isArray(entries)) {
        entries.forEach(entry => {
            const entryDiv = document.createElement('div');
            entryDiv.classList.add('guestbook-entry');
            entryDiv.innerHTML = `<strong>${entry.author}</strong>: ${entry.content} <br> <small>${new Date(entry.timestamp).toLocaleString()}</small>`;

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = 'x';
            deleteBtn.addEventListener('click', function () {
                deleteEntry(entry.id);
            });

            entryDiv.appendChild(deleteBtn);
            guestbookContainer.appendChild(entryDiv);
        });
    } else {
        console.error('Expected entries to be an array but got:', entries);
    }
}

window.addEventListener('DOMContentLoaded', function () {
    getEntries();
});

const guestbookInput = document.querySelector('.guestbook-input');
const guestbookAuthor = document.querySelector('.guestbook-author');

guestbookInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        addEntry();
    }
});

guestbookAuthor.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        addEntry();
    }
});

document.querySelector('.submit-btn').addEventListener('click', function () {
    addEntry();
});

function addEntry() {
    const content = guestbookInput.value.trim();
    const author = guestbookAuthor.value.trim();
    if (content === '' || author === '') return;

    const entryData = {
        id: Date.now(), // 임시로 고유한 id를 생성
        author: author,
        content: content
    };

    axios.post(`${host}/todo`, entryData, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            guestbookInput.value = '';
            guestbookAuthor.value = '';
            getEntries();
        })
        .catch(error => {
            console.error('Error adding guestbook entry:', error);
        });
}

function deleteEntry(entryId) {
    axios.delete(`${host}/todo/${entryId}`)
        .then(function (response) {
            console.log('Entry deleted:', response.data);
            getEntries();
        })
        .catch(function (error) {
            console.error('Error deleting guestbook entry:', error);
        });
}

