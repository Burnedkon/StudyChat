let username = null;

// Load posts from local storage when the page loads
window.onload = loadPosts;

// Function to load posts
function loadPosts() {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const postList = document.getElementById("postList");
    postList.innerHTML = ''; // Clear the current list
    posts.forEach(post => {
        const postItem = document.createElement("li");
        postItem.innerHTML = `
            <strong>${post.username}: ${post.title}</strong>
            <p>${post.content}</p>
            <p><em>Tags: ${post.tags}</em></p>
            <div class="commentSection">
                <h4>Comments</h4>
                <ul class="commentList"></ul>
                <input type="text" class="commentInput" placeholder="Add a comment">
                <button class="commentButton">Comment</button>
            </div>
        `;
        
        // Add comments to post
        const commentInput = postItem.querySelector(".commentInput");
        const commentButton = postItem.querySelector(".commentButton");
        const commentList = postItem.querySelector(".commentList");
        
        // Display existing comments
        post.comments.forEach(comment => {
            const commentItem = document.createElement("li");
            commentItem.innerHTML = `<strong>${comment.username}:</strong> ${comment.text}`;
            commentList.appendChild(commentItem);
        });

        // Handle new comment submission
        commentButton.addEventListener("click", () => {
            const commentText = commentInput.value.trim();
            if (commentText) {
                const newComment = { username: username, text: commentText }; // Store username with comment
                post.comments.push(newComment);
                localStorage.setItem("posts", JSON.stringify(posts));
                loadPosts(); // Reload posts to refresh comments
            }
        });

        postList.appendChild(postItem);
    });
}

// Set username
document.getElementById("setUsername").addEventListener("click", function() {
    username = document.getElementById("usernameInput").value.trim();
    if (username) {
        document.getElementById("userSection").style.display = "none";
        document.getElementById("postForm").style.display = "block";
        document.getElementById("logoutButton").style.display = "inline";
        document.getElementById("usernameInput").value = ''; // Clear input
        loadPosts(); // Load posts on username set
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
        const posts = JSON.parse(localStorage.getItem("posts")) || [];
        posts.push({
            username: username,
            title: title,
            content: content,
            tags: tags,
            comments: [] // Initialize comments array
        });
        localStorage.setItem("posts", JSON.stringify(posts));
        loadPosts(); // Load posts to refresh the display

        // Clear input fields
        document.getElementById("postTitle").value = '';
        document.getElementById("postContent").value = '';
        document.getElementById("postTags").value = '';
    } else {
        alert("Please fill in both the title and content.");
    }
});
