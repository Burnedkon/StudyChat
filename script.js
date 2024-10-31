let username = null;

// Set username
document.getElementById("setUsername").addEventListener("click", function() {
    username = document.getElementById("usernameInput").value.trim();
    if (username) {
        document.getElementById("userSection").style.display = "none";
        document.getElementById("postForm").style.display = "block";
        document.getElementById("logoutButton").style.display = "inline";
        document.getElementById("usernameInput").value = ''; // Clear input
    } else {
        alert("Please enter a valid username.");
    }
});

// Logout
document.getElementById("logoutButton").addEventListener("click", function() {
    username = null;
    document.getElementById("userSection").style.display = "block";
    document.getElementById("postForm").style.display = "none";
    document.getElementById("logoutButton").style.display = "none";
    document.getElementById("postList").innerHTML = ''; // Clear posts
});

// Submit a post
document.getElementById("submitPost").addEventListener("click", function() {
    const title = document.getElementById("postTitle").value;
    const content = document.getElementById("postContent").value;
    const tags = document.getElementById("postTags").value;

    if (title && content) {
        const postList = document.getElementById("postList");
        const postItem = document.createElement("li");
        postItem.innerHTML = `<strong>${username}: ${title}</strong><p>${content}</p><p><em>Tags: ${tags}</em></p>`;
        postList.appendChild(postItem);

        // Clear input fields
        document.getElementById("postTitle").value = '';
        document.getElementById("postContent").value = '';
        document.getElementById("postTags").value = '';
    } else {
        alert("Please fill in both the title and content.");
    }
});
