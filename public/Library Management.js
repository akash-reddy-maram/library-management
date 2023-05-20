let inputEl = document.getElementById("searchInput");
let resultsEl = document.getElementById("searchResults");
let searchInput = null;
let spinnerEl = document.getElementById("spinner");

function appendResults(book) {
    let bookDetails = document.createElement("div");
    bookDetails.classList.add("text-center", "p-2", "col-6", "col-md-4", "col-lg-3", "col-xl-2");
    resultsEl.appendChild(bookDetails);

    let bookImage = document.createElement("img");
    bookImage.src = book.imageLink;
    bookDetails.appendChild(bookImage);

    let authorNameEl = document.createElement("p");
    authorNameEl.classList.add("text-center");
    authorNameEl.textContent = book.author;
    bookDetails.appendChild(authorNameEl);
}

function displayResults(booksArray) {
    let length = booksArray.length;
    if (length === 0) {
        let booksHeading = document.createElement("h1");
        booksHeading.classList.add("text-center", "col-12");
        booksHeading.textContent = "No books found";
        resultsEl.appendChild(booksHeading);
    } else {
        let booksHeading = document.createElement("h1");
        booksHeading.classList.add("text-left", "col-12");
        booksHeading.textContent = "Popular Books";
        resultsEl.appendChild(booksHeading);

        for (let book of booksArray) {
            appendResults(book);
        }
    }
}

function getSearchResuls(searchInput) {
    spinnerEl.classList.remove("d-none");
    // let url = "https://apis.ccbp.in/book-store" + "?title=" + searchInput;
    let url = "http://localhost:3000/data/" + "?title=" + searchInput;
    console.log(url);
    let options = {
        method: "GET"
    };
    fetch(url, options)
        .then(function(response) {
            return response.json();
        })
        .then(function(jsonData) {
            console.log(jsonData.search_results);
            console.log(typeof jsonData.search_results[2]);
            displayResults(jsonData.search_results);
            spinnerEl.classList.add("d-none");
        });
}

inputEl.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchInput = event.target.value;
        resultsEl.textContent = "";
        getSearchResuls(searchInput);
    }
});