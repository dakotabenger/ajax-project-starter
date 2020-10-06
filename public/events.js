window.addEventListener("DOMContentLoaded", (event) => {
    let image = document.querySelector(".cat-pic");
    let newPicBtn = document.querySelector("#new-pic");
    let loaderDiv = document.querySelector(".loader");
    let upVoteBtn = document.querySelector("#upvote");
    let downVoteBtn = document.querySelector("#downvote");
    let score = document.querySelector(".score");
    let form = document.querySelector(".comment-form");
    let formButton = document.querySelector("input[value=Submit]");
    let commentsDiv = document.querySelector(".comments");
    let errorDiv = document.querySelector(".error");

    fetchImg();

    newPicBtn.addEventListener("click", (event) => {
        event.preventDefault();
        fetchImg();
    });

    upVoteBtn.addEventListener("click", (event) => {
        event.preventDefault();
        handleVote("upvote");
    });

    downVoteBtn.addEventListener("click", (event) => {
        event.preventDefault();
        handleVote("downvote");
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        let formdata = new FormData(form);
        let comment = formdata.get("user-comment");
        // console.log("first event",formdata)
        console.log(formdata.get("user-comment"))
        fetch("/kitten/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ comment }),

        })
            .then((res) => {
                if (!res.ok) throw res;
                else return res.json();
            })
            .then((data) => {
                loadComments(data);
            })
            .catch((e) => {
                errorHandler(e);
            });
    });

    function loadDelete(btn) {
        btn.addEventListener("click", event => {
            event.preventDefault();
            let btnIdx = btn.getAttribute("id");

            fetch(`/kitten/comments/${btnIdx}`, { method: "DELETE" })
                .then(res => {
                    if (!res.ok) throw res;
                    else return res.json();
                })
                .then(data => {
                    loadComments(data);
                })
        })
    }

    function loadComments(data) {
        let commentsArray = data.comments;
        commentsDiv.innerHTML = "";
        commentsArray.forEach((el, i) => {
            let singleCommentDiv = document.createElement("div");
            let singleCommentBtn = document.createElement("button");
            singleCommentBtn.innerHTML = "Delete";
            singleCommentBtn.setAttribute("id", i)
            singleCommentDiv.innerHTML = el;
            singleCommentDiv.appendChild(singleCommentBtn);
            commentsDiv.appendChild(singleCommentDiv);
            loadDelete(singleCommentBtn);
        })
    }

    function handleLoadingDiv() {
        if (loaderDiv.innerHTML === "") loaderDiv.innerHTML = "<b>Loading...</b>";
        else loaderDiv.innerHTML = "";
    }

    function fetchImg() {
        handleLoadingDiv();
        fetch("/kitten/image")
            .then((res) => {
                if (!res.ok) throw res;
                else return res.json();
            })
            .then((data) => {
                image.src = data.src;
                handleLoadingDiv();
            })
            .catch((err) => {
                errorHandler(err, 1);
                handleLoadingDiv();
            });
    }

    function handleVote(type) {
        fetch(`/kitten/${type}`, { method: "PATCH" })
            .then((res) => {
                if (!res.ok) throw res;
                else return res.json();
            })
            .then((data) => {
                score.innerHTML = data.score;
            })
            .catch((err) => {
                errorHandler(err);
            });
    }

    function errorHandler(err, num) {
        if (num === 1) {
            err.json()
                .then(res => {
                    errorDiv.innerHTML = res.message;
                });
        } else {
            errorDiv.innerHTML = "Something went wrong..."
        }
    }
});
