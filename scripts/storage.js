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