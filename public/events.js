function alertHandling() {
  alert("Something went wrong...");
}

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
      body: JSON.stringify({ comment } ),
      
    })
      .then((res) => {
        if (!res.ok) throw res;
        else return res.json();
      })
      .then((data) => {
        console.log(data);
        let commentsArray = data.comments;
        commentsDiv.innerHTML = "";
        commentsArray.forEach((el) => {
          let singleCommentDiv = document.createElement("div");
          singleCommentDiv.innerHTML = el;
          commentsDiv.appendChild(singleCommentDiv);
        });
      })
      .catch((e) => {
        alertHandling();
      });
  });

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
        alertHandling();
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
        alertHandling();
      });
  }
});
