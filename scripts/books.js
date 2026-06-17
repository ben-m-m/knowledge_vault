

const bookForm = document.querySelector(".book-form");
const bookGrid = document.getElementById("book-grid");
const saveButton =bookForm.querySelector('button[type="submit"]');

let editingIndex = null;


//initialize the book form and display existing books
function initializeBookForm() {
    if (!bookForm) {
        return;
    }
    bookForm.addEventListener("submit", bookSubmit);
    bookGrid.addEventListener("click", handleBookActions); //Edit or delete actions

    renderBooks();
}

//Handles the form submition and saves new book details

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
    //checks if its editing or adding a new book in form field

    if (editingIndex === null) {
        books.push(book) // adds new book
    } else {
        books[editingIndex] = book; //editing book in form field

        editingIndex = null;

        saveButton.textContent = "Save Book";
    }
    
    saveBooks(books);
    renderBooks();
    bookForm.reset();
    
}

// Handles books view, delete and edit buttons
function handleBookActions(event) {
    const button = event.target.closest("button")
    if (!button ) {
        return;
    }

    const index = Number(button.dataset.index);

    if (button.classList.contains("view-btn")) {
        viewBook(index);
        return;
    }

    if (button.classList.contains("edit-btn")) {
        editBook(index);
        return;
    }

    if (button.classList.contains("delete-btn")) {
        deleteBook(index);
    }

}

//view books section
function viewBook(index) {
    const books = getBooks();
    const book = books[index];

    if (!book) {
        return;
    }

    alert(
        `Title: ${book.title}
        Author: ${book.author}
        Pages: ${book.pages}
        Status: ${book.status}
        Rating: ${book.rating}
        Tag: ${book.tag}
        Summary: ${book.summary}
        `
    );
}

//delete book from storage
function deleteBook(index) {
    const books = getBooks();

    if (!confirm("Delete This Book?!")) {
        return;
    }

    books.splice(index, 1);
    saveBooks(books);
    renderBooks();
}

// Editing books section
function editBook(index) {
    const books = getBooks();
    const book = books[index];

    if (!book) {
        return;
    }

    editingIndex = index;

    saveButton.textContent = "Update Book"

    document.getElementById("book-title").value = book.title;
    document.getElementById("book-author").value = book.author;
    document.getElementById("book-pages").value = book.pages;
    document.getElementById("book-tag").value = book.tag;
    document.getElementById("book-status").value = book.status;
    document.getElementById("book-rating").value = book.rating
    document.getElementById("book-summary").value = book.summary;
    document.getElementById("book-date-added").value = book.dateAdded;
}


//rendering books function: Displays all books in library

function renderBooks() {

    if (!bookGrid) {
        return;
    }

    const books = getBooks();
    //If the library is blank, the user sees a message.
    if (books.length === 0) {
        bookGrid.innerHTML = `
        <p class="empty-message">
            No books added yet.
        </p>
    `;

        return;
    }

    bookGrid.innerHTML = "";

    books.forEach((book, index) => {
        const card = document.createElement("article");
        card.classList.add("book-card");

        card.innerHTML = `
            <img
                src="assets/images/placeholder-cover.png"
                alt="${book.title}"
                class="book-card__cover">

            <div class="book-card__content">

                <h3>${book.title}</h3>

                <p><strong>Author:</strong> ${book.author}</p>

                <p><strong>Pages:</strong> ${book.pages}</p>

                <p><strong>Status:</strong> ${book.status}</p>

                <p><strong>Rating:</strong> ${book.rating}</p>

                <span class="book-card__tag">
                    ${book.tag}
                </span>

            </div>

            <div class="book-card__actions">

                <button type="button"
                        class="view-btn"
                        data-index="${index}">
                    View
                </button>

                <button type="button"
                        class="edit-btn"
                        data-index="${index}">
                    Edit
                </button>

                <button type="button"
                        class="delete-btn"
                        data-index="${index}">
                    Delete
                </button>

            </div>
        `;
        bookGrid.appendChild(card);

    });
}


