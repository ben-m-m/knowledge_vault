

const noteForm = document.querySelector("#note-form");
const notesList = document.getElementById("notes-list");
const noteSearch = document.getElementById("note-search");
const noteSort = document.getElementById("note-sort");
const noteFilters = document.querySelectorAll("[data-filter]");

let editingNoteIndex = null;
let noteSaveButton = null;

if (noteForm) {
    noteSaveButton = noteForm.querySelector('button[type="submit"]');
}


//initializing notes

function initializeNotes() {
    console.log(noteForm);
    console.log(notesList);
    if (!noteForm || !notesList) {
        return;
    }
    noteForm.addEventListener("submit", noteSubmit);
    notesList.addEventListener("click", handleNoteActions);

    if (noteSearch) noteSearch.addEventListener("input", handleSearch);
    if (noteSort) noteSort.addEventListener("change", handleSort);

    noteFilters.forEach(function (button) {
        button.addEventListener("click", handleFilter);
    });

    document.getElementById("export-notes-btn")?.addEventListener("click", exportNotes)
    document.getElementById("import-notes-input")?.addEventListener("change", importNotes);
    document.getElementById("import-notes-btn")?.addEventListener("click", function () {
        document.getElementById("import-notes-input").click();

    });

    loadBookOptions();
    renderNotes();
}

//document.addEventListener("DOMContentLoaded", initializeNotes);


// submit function 
function noteSubmit(event) {
    event.preventDefault();

    const note = {
        title: document.getElementById("note-title").value.trim(),
        content: document.getElementById("note-content").value.trim(),
        book: document.getElementById("note-book").value.trim(),
        highlight: document.getElementById("note-highlight").checked,
        dateCreated: new Date().toISOString()
    };

    const notes = getNotes();

    if (editingNoteIndex === null) {
        notes.push(note);
    } else {
        notes[editingNoteIndex] = note;

        editingNoteIndex = null;
        noteSaveButton.textContent = "Save Note";
    }

    saveNotes(notes);
    renderNotes();
    noteForm.reset();
}

// rendering notes
function renderNotes(noteList = getNotes()) {

    if (!notesList) {
        return;
    }

    notesList.innerHTML = "";

    if (noteList.length === 0) {

        notesList.innerHTML = `
            <p class="empty-message">
                No notes yet.
            </p>
        `;

        return;
    }

    noteList.forEach(function (note, index) {

        const card = document.createElement("article");

        card.classList.add("note-card");

        card.innerHTML = `
            <h3>${note.title || "Untitled"}</h3>
            <p>${note.content || ""}</p>

            <small>Book: ${note.book || "General"}</small>

            ${note.highlight ? "<span> Highlighted</span>" : ""}

            <div class="note-card__actions">
                <button class="view-note-btn" data-index="${index}">View</button>
                <button class="edit-note-btn" data-index="${index}">Edit</button>
                <button class="delete-note-btn" data-index="${index}">Delete</button>
            </div>
        `;

        notesList.appendChild(card);
    });
}

// loading books list to the dropdoen select in notes

function loadBookOptions() {
    const select = document.getElementById("note-book");
    if (!select) {
        return;
    }

    const books = getBooks();

    select.innerHTML = `<option value="">General</option>`;

    books.forEach(book => {
        const option = document.createElement("option");
        option.value = book.title;
        option.textContent = book.title;
        select.appendChild(option);
    });

    console.log(books)
}

// handling note actions

function handleNoteActions(event) {
    const index = event.target.dataset.index;
    if (index === undefined) {
        return;
    }
    const notes = getNotes();

    if (event.target.classList.contains("delete-note-btn")) {
        notes.splice(index, 1);
        saveNotes(notes);
        renderNotes();
        return;
    }

    if (event.target.classList.contains("edit-note-btn")) {
        const note = notes[index];

        document.getElementById("note-title").value = note.title;
        document.getElementById("note-content").value = note.content;
        document.getElementById("note-book").value = note.book;
        document.getElementById("note-highlight").checked = note.highlight;


        editingNoteIndex = index;
        noteSaveButton.textContent = "Update Note";
    }

    if (event.target.classList.contains("view-note-btn")) {

        const note = notes[index];

        alert(`${note.title}\n\n${note.content}`);
    }
}


//search notes
function handleSearch() {
    const query = noteSearch.value.toLowerCase().trim();
    const notes = getNotes();

    const filtered = notes.filter(note =>
        (note.title || "").toLowerCase().includes(query) ||
        (note.content || "").toLowerCase().includes(query) ||
        (note.book || "").toLowerCase().includes(query)
    );

    renderNotes(filtered);
}

//sorting
function handleSort() {
    const value = noteSort.value;
    const notes = [...getNotes()];

    if (value === "Newest") {
        notes.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
    }

    if (value === "Oldest") {
        notes.sort(function (a, b) {
            return new Date(a.dateCreated) - new Date(b.dateCreated);
        });
    }

    if (value === "Book Title (A-Z)") {
        notes.sort((a, b) =>
            (a.book || "").localeCompare(b.book || "")
        );
    }
    renderNotes(notes);
}

//filter button filter
function handleFilter(event) {
    const filter = event.target.dataset.filter;

    let notes = getNotes();
    if (filter === "highlighted") {
        notes = notes.filter(function (note) {
            return note.highlight;
        });
    }

    if (filter === "recent") {
        notes.sort(function (a, b) {
            return new Date(b.dateCreated) - new Date(a.dateCreated);
        });
        notes = notes.slice(0, 5);
    }

    renderNotes(notes)
}

//import and export functions.
//export
function exportNotes() {
    const notes = getNotes();
    const dataStr = JSON.stringify(notes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url
    a.download = "notes-export.json"

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
}

//import json
function importNotes(event) {
    const file = event.target.files[0];

    if (!file) {
        return;
    }
    const reader = new FileReader();

    reader.onload = function (e) {
        try {
            const importedNotes = JSON.parse(e.target.result);

            if (!Array.isArray(importedNotes)) {
                alert("Invalid file format.");
                return;
            }

            const existingNotes = getNotes();

            const merged = [...existingNotes, ...importedNotes] //merge

            saveNotes(merged);
            renderNotes();

            alert("Notes imported successfully!");
        } catch (err) {
            alert("Error importing file.");
            console.error(err);
        }
    };
    reader.readAsText(file)
}

