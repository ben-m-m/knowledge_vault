

const bookForm = document.querySelector(".book-form");
const bookGrid = document.getElementById("book-grid");
const librarySearch = document.getElementById("library-search");

const libraryCase = document.getElementById("library-case");
const libraryRegex = document.getElementById("library-regex");
const bookSort = document.getElementById("book-sort");

let editingIndex = null;
let saveButton = null;

if (bookForm) {
    saveButton = bookForm.querySelector('button[type="submit"]');
}

//initialize the book form and display existing books
function initializeBookForm() {
    if (!bookForm) {
        return;
    }
    bookForm.addEventListener("submit", bookSubmit);
    bookGrid.addEventListener("click", handleBookActions); //Edit or delete actions
    librarySearch.addEventListener("input", searchBooks); // Listens for keyboard input
    libraryCase.addEventListener("change", searchBooks);
    libraryRegex.addEventListener("change", searchBooks);
    bookSort.addEventListener("change", searchBooks);

    document.getElementById("export-books-btn")?.addEventListener("click", exportBooks);
    document.getElementById("import-books-input")?.addEventListener("change", importBooks);

    document.getElementById("import-books-btn")?.addEventListener("click", function () {

        document.getElementById("import-books-input").click();

    });

    renderBooks();
}

//validation due to error helper functions

function clearErrors() {
    document.querySelectorAll(".form-error").forEach(function (error) {
        error.textContent = "";
    });
}

function showError(id, message) {
    document.getElementById(id).textContent = message;
}
//validation function
function validateBook(book) {
    clearErrors();

    let valid = true;

    if (book.title === "") {
        showError("error-book-title", "Title is Required!");
        valid = false;
    }
    if (book.author === "") {
        showError("error-book-author", "Author is also required!");
        valid = false;
    }
    if (book.pages <= 0 || Number.isNaN(book.pages)) {
        showError("error-book-pages", "Pages must be more than 0.");
        valid = false;
    }

    if (book.rating < 1 || book.rating > 5) {
        showError("error-book-rating", "Rating must be between 1 and 5.")
        valid = false;
    }

    const books = getBooks();
    const duplicate = books.some(function (existingBook, index) {
        if (editingIndex === index) {
            return false;
        }

        return (
            existingBook.title.toLowerCase() === book.title.toLowerCase()
        );
    });

    if (duplicate) {
        showError("error-book-title", "This book already exists!");
        valid = false;
    }

    return valid;
}


//Handles the form submition and saves new book details

function bookSubmit(event) {
    event.preventDefault();
    console.log("Book Submitted")

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

    if (!validateBook(book)) {
        return
    }

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
    searchBooks();
    if (typeof loadBookOptions === "function") {
        loadBookOptions();
    }
    bookForm.reset();
    clearErrors();
    updateDashboard();

}

// Handles books view, delete and edit buttons
function handleBookActions(event) {
    const button = event.target.closest("button")
    if (!button) {
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
    searchBooks();
    if (typeof loadBookOptions === "functions") {
        loadBookOptions();
    }
    updateDashboard();
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

//search books function
function searchBooks(event) {

    let books = getBooks();
    const searchText = librarySearch.value;

    const useCase = libraryCase.checked;
    const useRegex = libraryRegex.checked;
    if (searchText !== "") {
        books = books.filter(function (book) {

            const fields = [
                book.title,
                book.author,
                book.tag,
                book.status,
                book.summary
            ];

            return fields.some(function (field) {

                if (!field) {
                    return false;
                }
                let value = field;
                let search = searchText;

                if (!useCase) {
                    value = value.toLowerCase();
                    search = searchText.toLowerCase();
                }

                if (useRegex) {
                    try {
                        const regex = new RegExp(search);
                        return regex.test(value);
                    } catch {
                        return false;
                    }
                }
                return value.includes(search);
            });
        });
    }

    sortBooks(books);
}

// sort books function
function sortBooks(books) {
    switch (bookSort.value) {
        case "Title (A-Z)":
            books.sort(function (a, b) {
                return a.title.localeCompare(b.title);
            });

            break;
        case "Title (Z-A)":
            books.sort(function (a, b) {
                return b.title.localeCompare(a.title);
            });

            break;
        case "Pages (Low-High)":
            books.sort(function (a, b) {
                return a.pages - b.pages;
            });

            break;
        case "Pages (High-Low)":
            books.sort(function (a, b) {
                return b.pages - a.pages;
            });

            break;
        case "Newest":
            books.sort(function (a, b) {
                return new Date(b.dateAdded) - new Date(a.dateAdded);
            });

            break;
        case "Oldest":
            books.sort(function (a, b) {
                return new Date(a.dateAdded) - new Date(b.dateAdded);
            });

            break;
    }

    renderBooks(books)
}

//rendering books function: Displays all books in library

function renderBooks(bookList = getBooks()) {

    if (!bookGrid) {
        return;
    }

    const books = bookList;
    const allBooks = getBooks();
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

    books.forEach(function (book) {

        if (!book) {
            return;
        }

        const originalIndex = allBooks.findIndex(function (originalBook) {
            return (
                originalBook.title === book.title &&
                originalBook.author === book.author &&
                originalBook.dateAdded === book.dateAdded
            );
        });



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
                        data-index="${originalIndex}">
                    View
                </button>

                <button type="button"
                        class="edit-btn"
                        data-index="${originalIndex}">
                    Edit
                </button>

                <button type="button"
                        class="delete-btn"
                        data-index="${originalIndex}">
                    Delete
                </button>

            </div>
        `;
        bookGrid.appendChild(card);

    });
}

//import and export books
function exportBooks() {
    const books = getBooks();

    const dataStr = JSON.stringify(books, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "books-export.json";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
}

//import books
function importBooks(event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        try {
            const importedBooks = JSON.parse(e.target.result);

            if (!Array.isArray(importedBooks)) {
                alert("Invalid file format.");
                return;
            }

            const existingBooks = getBooks();
            //avoids importing duplicates
            const merged = [...existingBooks];

            importedBooks.forEach(function (book) {

                const exists = merged.some(function (existingBook) {

                    return (
                        existingBook.title.toLowerCase() ===
                        book.title.toLowerCase()
                    );

                });

                if (!exists) {
                    merged.push(book);
                }

            });

            saveBooks(merged);

            renderBooks();

            if (typeof loadBookOptions === "function") {
                loadBookOptions();
            }

            updateDashboard();

            alert("Books imported successfully!");
        } catch (err) {
            alert("Error importing books file.");
            console.error(err);
        }
    };

    reader.readAsText(file);
}
