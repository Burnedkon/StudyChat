// Submit a post
document.getElementById("submitPost").addEventListener("click", function() {
    const title = document.getElementById("postTitle").value;
    const content = document.getElementById("postContent").value;
    const tags = document.getElementById("postTags").value;
    const imageInput = document.getElementById("postImage");

    if (title && content) {
        const posts = JSON.parse(localStorage.getItem("posts")) || [];
        const image = imageInput.files[0]; // Get the uploaded file

        const newPost = {
            username: username,
            title: title,
            content: content,
            tags: tags,
            comments: [], // Initialize comments array
            image: image ? URL.createObjectURL(image) : null // Create URL for the image if it exists
        };

        posts.push(newPost);
        localStorage.setItem("posts", JSON.stringify(posts));
        loadPosts(); // Load posts to refresh the display

        // Clear input fields
        document.getElementById("postTitle").value = '';
        document.getElementById("postContent").value = '';
        document.getElementById("postTags").value = '';
        imageInput.value = ''; // Clear image input
    } else {
        alert("Please fill in both the title and content.");
    }
});

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
            ${post.image ? `<img src="${post.image}" alt="Post Image" style="max-width: 100%; height: auto;">` : ''}
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
            if (commentText && username) { // Ensure username is not null
                const newComment = { username: username, text: commentText }; // Store username with comment
                post.comments.push(newComment);
                localStorage.setItem("posts", JSON.stringify(posts));
                loadPosts(); // Reload posts to refresh comments
            }
        });

        postList.appendChild(postItem);
    });
}

