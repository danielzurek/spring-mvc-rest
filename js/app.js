$(function() {

    var tbody = $("#books-list tbody");

    function add(book) {
        var button = $("<button>Usuń</button>").one("click", function() {

            $(this).attr("disabled", "disabled");

            var tr = $(this).closest("tr");
            var bookId = tr.data("id");

            $.ajax({
                url: `http://localhost:8282/books/${bookId}`,
                type: "DELETE"
            }).done(function() {
                tr.remove();
            });
        });
        var tr = $(`<tr data-id=${book.id}><td><a href="#">${book.title}</a></td><td>${book.author}</td><td>${book.isbn}</td></tr>`);
        var td = $("<td>");
        td.append(button);
        tr.append(td);
        tbody.append(tr);

        tr.find("a").click(function() {

            var a = $(this);
            var tr = a.closest("tr");
            var bookId = tr.data("id");

            $.get(`http://localhost:8282/books/${bookId}`).done(function(book) {
                if (a.siblings().length > 0) {
                    a.next().remove();
                } else {
                    var div = $(`<div>${book.publisher}, ${book.type}</div>`);
                    a.after(div);
                }
            });

            return false;
        });
    }

    $.get("http://localhost:8282/books").done(function(books) {
        for (var book of books) {
            add(book);
        }
    });

    $("#sendButton").click(function() {

        $(this).attr("disabled", "disabled");

        var title = $("#books-form input[name=title]").val();
        var author = $("#books-form input[name=author]").val();
        var isbn = $("#books-form input[name=isbn]").val();

        $.ajax({
            url: 'http://localhost:8282/books',
            type: 'POST',
            data: JSON.stringify({title, author, isbn}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).done(function (book) {
            add(book);
        });

        return false;
    });
});
