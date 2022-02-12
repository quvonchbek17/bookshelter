"use strict";

let elForm = document.querySelector(".search-form");
let elBooks = document.querySelector(".books");
let elPaginationList = document.querySelector(".pagination__btns");
let elBookmark = document.querySelector(".bookmark__list");
let elCardBtns = document.querySelector(".books__btns");
let elCard = document.querySelector(".books__card");
let elCardNull = document.querySelector(".cards-default");

let inputValue = "search+terms";

let page = 1;
let startIndex = (page - 1) * 15 + 1;
let bookmarkBooks =
  JSON.parse(window.localStorage.getItem("localBookmark")) || [];
let bookmarkId;
let data;

//// LOGOUT ////
if (window.localStorage.getItem("token") == null) {
  window.location.replace("login.html");
}
logout.addEventListener("click", function (evt) {
  let localToken = window.localStorage.getItem("token");
  if (localToken) {
    window.localStorage.removeItem("token");
  }
  window.location.replace("login.html");
});

//// RENDER DATA ////

const renderdata = async function () {
  startIndex = (page - 1) * 15 + 1;
  console.log(startIndex);

  let request = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${inputValue}&maxResults=15&startIndex=${startIndex}`
  );

  data = await request.json();
  console.log(data);
  bookMarkPush(data);
  renderCards(data, elBooks);
  renderBtns(data);
};

renderdata();
console.log(data);

//// RENDER CARDS ////

function renderCards(data, element) {
  element.innerHTML = null;
  let books = data.items;
  let bookmarkId = 0;
  let author;
  let year;
  if (books === undefined) {
    elCardNull.classList.remove("visually-hidden");
    pagination.classList.add("visually-hidden");
  } else {
    books.forEach((book) => {
      if (book.volumeInfo.authors == undefined) {
        author = "Muallif keltirilmagan !";
      } else {
        author = book.volumeInfo.authors;
      }

      if (book.volumeInfo.publishedDate == undefined) {
        year = "Yil keltirilmagan !";
      } else {
        year = book.volumeInfo.publishedDate;
      }

      const htmlbook = `<div class="books__card col-3  ">
                <div class="books__card-img">
                  <img
                    class="books__img"
                    src=${book.volumeInfo.imageLinks?.smallThumbnail}
                    alt="book image"
                  />
                </div>

                <div class="books__card-body">
                  <h2 class="books__name" >${book.volumeInfo.title}</h2>
                  <p class="books__author" >${author}</p>
                  <p class="books__year" >${year}</p>
                </div>
                <div
                    class="books__btns d-flex flex-wrap justify-content-between "
                  >
                    <button class="books__bookmark-btn" data-bookmarkBtn="${bookmarkId}">Bookmark</button>
                    <button class="books__info-btn" data-infoBtn="${bookmarkId}">More Info</button>
                    <button class="books__read-btn" data-readBtn="${bookmarkId}">Read</button>
                  </div>
              </div>`;
      element.insertAdjacentHTML("beforeend", htmlbook);
      bookmarkId++;
    });
  }
}

//// RENDER PAGINATION ////

function renderBtns(data) {
  if (data.totalItems != 0) {
    pagination.classList.remove("visually-hidden");
    elCardNull.classList.add("visually-hidden");
  }
  elPaginationList.innerHTML = null;
  showResult.textContent = data.totalItems;
  let btnsnumber = Math.ceil(data.totalItems / 15);
  for (let i = 1; i <= btnsnumber; i++) {
    let htmlBtns = `<button class=" books-btn">${i}</button> `;

    if (page == i) {
      htmlBtns = `<button class=" activeBtn books-btn ">${i}</button> `;
    }
    elPaginationList.insertAdjacentHTML("beforeend", htmlBtns);
  }

  if (page == 1) {
    prevBtn.disabled = true;
    prevBtn.classList.add("prev-bg");
  } else {
    prevBtn.disabled = false;
    prevBtn.classList.remove("prev-bg");
  }

  if (page == btnsnumber) {
    nextBtn.disabled = true;
    nextBtn.classList.add("prev-bg");
  } else {
    nextBtn.disabled = false;
    nextBtn.classList.remove("prev-bg");
  }
}

elPaginationList.addEventListener("click", function (evt) {
  page = Number(evt.target.textContent);
  renderdata();
});

prevBtn.addEventListener("click", function () {
  page--;
  renderdata();
});
nextBtn.addEventListener("click", function () {
  page++;
  renderdata();
});

//// SEARCH ////

elForm.addEventListener("submit", function (evt) {
  evt.preventDefault();

  inputValue = searchInput.value;
  renderdata();
});

//// BOOKMARK, MORE INFO, READ BTNS ////

elBooks.addEventListener("click", function (evt) {
  if (evt.target.matches(".books__bookmark-btn")) {
    bookmarkId = evt.target.dataset.bookmarkbtn;
    bookMarkPush(data);
  }
});

function bookMarkPush(data) {
  let books = data.items;
  if (bookmarkId) {
    if (!bookmarkBooks.find((book) => book.id == books[bookmarkId].id)) {
      bookmarkBooks.push(books[bookmarkId]);
      window.localStorage.setItem(
        "localBookmark",
        JSON.stringify(bookmarkBooks)
      );
    }
  }

  bookmarkBooks =
    JSON.parse(window.localStorage.getItem("localBookmark")) || [];
  renderBookmark(bookmarkBooks, elBookmark);
}

//// RENDER BOOKMARK ////

function renderBookmark(books, element) {
  if (books.length > 0 || bookmarkBooks != null) {
    element.innerHTML = null;
    let author;
    let counter = 0;
    books.forEach((book) => {
      if (book.volumeInfo.authors == undefined) {
        author = "Muallif keltirilmagan !";
      } else {
        author = book.volumeInfo.authors;
      }

      const htmlbook = `<li class="bookmark__item">
      <div class="bookmark__item-right">
        <p class="bookmark__item-name">${book.volumeInfo.title}</p>
        <p class="bookmark__item-author">${author}</p>
      </div>
      <div class="bookmark__item-left">
        <button class="bookmark__read"  >
          <img data-bookmarkreadid="${counter}" src="./img/book-open.svg" alt="book icon" />
        </button>
        <button class="bookmark__delete" >
          <img  data-bookmarkdeleteid="${counter}" class="bookmark__delete-icon" src="./img/delete.svg" alt="delete-icon" />
        </button>
      </div>
    </li>`;
      counter++;
      element.insertAdjacentHTML("beforeend", htmlbook);
    });
  }
}

//// DELETE, READ BOOKMARK ////

elBookmark.addEventListener("click", function (evt) {
  if (evt.target.matches(".bookmark__delete-icon")) {
    let bookmarkBooksId = evt.target.dataset.bookmarkdeleteid;
    bookmarkBooks.splice(bookmarkBooksId, 1);
    window.localStorage.setItem("localBookmark", JSON.stringify(bookmarkBooks));
    renderBookmark(bookmarkBooks, elBookmark);
    // renderdata();
  }
});
