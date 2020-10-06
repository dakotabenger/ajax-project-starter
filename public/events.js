function alertHandling() {
    alert("Something went wrong...");
}

window.addEventListener("DOMContentLoaded", event => {
    let image = document.querySelector(".cat-pic");
    let newPicBtn = document.querySelector("#new-pic");
    let loaderDiv = document.querySelector(".loader");
    let upVoteBtn = document.querySelector("#upvote");
    let downVoteBtn = document.querySelector("#downvote");
    let score = document.querySelector(".score");

    fetchImg();

    newPicBtn.addEventListener("click", event => {
        event.preventDefault();
        fetchImg();
    })

    upVoteBtn.addEventListener("click", event => {
        event.preventDefault();
        handleVote("upvote");
    })

    downVoteBtn.addEventListener("click", event => {
        event.preventDefault();
        handleVote("downvote");
    })

    function handleLoadingDiv() {
        if (loaderDiv.innerHTML === "") loaderDiv.innerHTML = "<b>Loading...</b>"
        else loaderDiv.innerHTML = "";
    }


    
    function fetchImg() {
        handleLoadingDiv();
        fetch("/kitten/image")
            .then(res => {
                if (!res.ok) throw res;
                else return res.json();
            })
            .then(data => {
                image.src = data.src;
                handleLoadingDiv();
            })
            .catch(err => {
                alertHandling();
                handleLoadingDiv();
            })
    }

    function handleVote(type) {
        fetch(`/kitten/${type}`, { method: "PATCH" })
            .then(res => {
                if (!res.ok) throw res;
                else return res.json();
            })
            .then(data => {
                score.innerHTML = data.score;
            })
            .catch(err => {
                alertHandling();
            })
    }
})