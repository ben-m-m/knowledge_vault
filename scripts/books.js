//Find the book form

const bookForm = document.querySelector(".book-form");

function initializeBookForm() {
    if (!bookForm) {
        return;
    }
    bookForm.addEventListener("submit", bookSubmit);
}

//Handles the submition of book details

function bookSubmit(event) {
    event.preventDefault();

    const book = {
        title: document.getElementById("book-title").value.trim(),
        author: document.getElementById("book-author").value.trim(),
        pages: Number(document.getElementById("book-pages").value),
        tag: document.getElementById("book-tag").value.trim(),
        status: document.getElementById("book-status").value,
        rating: Number(document.getElementById("book-rating").value),
        summary: document.getElementById("book-summary").value.trim(),
        dateAdded: document.getElementById("book-date-added").value

    };

    const books = getBooks();
    books.push(book);
    saveBooks(books);
    console.log(books);

}