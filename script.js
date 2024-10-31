let username = prompt("Please enter a username (this will be your display name):");

// Function to convert a file to base64
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

// Submit a post
document.getElementById("submitPost").addEventListener("click", async function() {
    const title = document.getElementById("postTitle").value;
    const content = document.getElementById("postContent").value;
    const tags = document.getElementById("postTags").value;
    const imageInput = document.getElementById("postImage");

    if (title && content) {
        const posts = JSON.parse(localStorage.getItem("posts")) || [];
        let image = null;

        // Check if an image was uploaded and convert it to base64
        if (imageInput.files[0]) {
            image = await convertToBase64(imageInput.files[0]);
        }

        const newPost = {
            username: username,
            title: title,
            content: content,
            tags: tags,
            comments: [], // Initialize comments array
            image: image // Store the base64 image
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

// Load posts function
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
            <button class="clearCommentsButton">Clear Comments</button>
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
        const clearCommentsButton = postItem.querySelector(".clearCommentsButton");
        
        // Display existing comments
        post.comments.forEach(comment => {
            const commentItem = document.createElement("li");
            commentItem.innerHTML = `<strong>${comment.username}:</strong> ${comment.text}`;
            commentList.appendChild(commentItem);
        });

        // Handle new comment submission
        commentButton.addEventListener("click", () => {
            const commentText = commentInput.value.trim();
            if (commentText && username) {
                const newComment = { username: username, text: commentText }; // Store username with comment
                post.comments.push(newComment);
                localStorage.setItem("posts", JSON.stringify(posts));
                loadPosts(); // Reload posts to refresh comments
            }
        });

        // Handle clearing all comments
        clearCommentsButton.addEventListener("click", () => {
            post.comments = []; // Clear the comments array
            localStorage.setItem("posts", JSON.stringify(posts)); // Update local storage
            loadPosts(); // Reload posts to refresh comments
        });

        postList.appendChild(postItem);
    });
}

// Load posts on page load
window.onload = loadPosts;
