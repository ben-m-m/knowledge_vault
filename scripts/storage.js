//get the books

function getBooks() {
    const books = localStorage.getItem("books");

    if (books === null) {
        return [];
    }

    return JSON.parse(books);
}

//save books function

function saveBooks(books) {
    localStorage.setItem("books", JSON.stringify(books));
}


//get the notes

function getNotes() {
    const notes = localStorage.getItem("notes");

    if (notes === null) {
        return [];
    }

    return JSON.parse(notes);
}

//save notes

function saveNotes(notes) {
    localStorage.setItem("notes", JSON.stringify(notes));
}