document.getElementById("submitPost").addEventListener("click", function() {
    const title = document.getElementById("postTitle").value;
    const content = document.getElementById("postContent").value;

    if (title && content) {
        const postList = document.getElementById("postList");
        const postItem = document.createElement("li");
        postItem.innerHTML = `<strong>${title}</strong><p>${content}</p>`;
        postList.appendChild(postItem);

        // Clear input fields
        document.getElementById("postTitle").value = '';
        document.getElementById("postContent").value = '';
    } else {
        alert("Please fill in both fields.");
    }
});
