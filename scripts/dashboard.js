//dashboard initialization function
function initializeDashboard() {
    updateDashboard();
}

function updateDashboard() {
    const books = getBooks();

    updateTotalBooks(books)
    updateTotalPages(books)
    updateTopTag(books)
    updateCurrentlyReading(books)
    updateRecentlyAdded(books)
    updateReadingGoal(books)
}

function updateTotalBooks(books) {
    document.getElementById("total-books").textContent = books.length;
}

function updateTotalPages(books) {
    let total = 0;

    books.forEach(function(book) {
        total += book.pages;
    });
    document.getElementById("total-pages").textContent = total;
}

function updateCurrentlyReading(books) {
    const current = books.find(function(book) {
        return book.status === "Reading";
    });

    document.getElementById("currently-reading").textContent = current ? current.title : "None";
}

function updateRecentlyAdded(books) {
    if (books.length === 0) {
        document.getElementById("recently-added").textContent = "None";

        return;
    }

    const newest = [...books].sort(function(a, b) {
        return new Date(b.dateAdded) - new Date(a.dateAdded);
    });
    document.getElementById("recently-added").textContent = newest[0].title;
}

function updateTopTag(books) {
    const tags = {};

    books.forEach(function(book) {
        if (!book.tag) {
            return;
        }
        if (!tags[book.tag]) {
            tags[book.tag] = 0;
        }
        
        tags[book.tag]++;
    });

    let topTag = "None";
    let highest = 0;

    for (const tag in tags) {
        if (tags[tag] > highest) {
            highest = tags[tag];
            topTag = tag;
        }
    }

    document.getElementById("top-tag").textContent = topTag;
}

function updateReadingGoal(books) {
    let pages = 0;

    books.forEach(function(book) {
        pages += book.pages;
    });

    const goalInput = document.getElementById("reading-goal")
    const goal = goalInput ? Number(goalInput.value) : 5000;

    document.getElementById("reading-goal-output").textContent = `${pages} / ${goal} Pages`;
}
