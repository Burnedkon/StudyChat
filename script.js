let username = '';

// Set username
document.getElementById("setUsername").addEventListener("click", function() {
    const usernameInput = document.getElementById("usernameInput").value.trim();
    if (usernameInput) {
        username = usernameInput;
        document.getElementById("userSection").style.display = 'none';
        document.getElementById("postForm").style.display = 'block';
        document.getElementById("logoutButton").style.display = 'inline';
        loadPosts();
    } else {
        alert("Please enter a username.");
    }
});

// Convert file to base64
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

        if (imageInput.files[0]) {
            image = await convertToBase64(imageInput.files[0]);
        }

        const newPost = {
            username: username,
            title: title,
            content: content,
            tags: tags,
            comments: [],
            image: image
        };

        posts.push(newPost);
        localStorage.setItem("posts", JSON.stringify(posts));
        loadPosts();

        // Clear input fields
        document.getElementById("postTitle").value = '';
        document.getElementById("postContent").value = '';
        document.getElementById("postTags").value = '';
        imageInput.value = '';
    } else {
        alert("Please fill in both the title and content.");
    }
});

// Load posts function
function loadPosts() {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const postList = document.getElementById("postList");
    postList.innerHTML = '';
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
        
        const commentInput = postItem.querySelector(".commentInput");
        const commentButton = postItem.querySelector(".commentButton");
        const commentList = postItem.querySelector(".commentList");
        const clearCommentsButton = postItem.querySelector(".clearCommentsButton");
        
        post.comments.forEach(comment => {
            const commentItem = document.createElement("li");
            commentItem.innerHTML = `<strong>${comment.username}:</strong> ${comment.text}`;
            commentList.appendChild(commentItem);
        });

        commentButton.addEventListener("click", () => {
            const commentText = commentInput.value.trim();
            if (commentText && username) {
                const newComment = { username: username, text: commentText };
                post.comments.push(newComment);
                localStorage.setItem("posts", JSON.stringify(posts));
                loadPosts();
            }
        });

        clearCommentsButton.addEventListener("click", () => {
            post.comments = [];
            localStorage.setItem("posts", JSON.stringify(posts));
            loadPosts();
        });

        postList.appendChild(postItem);
    });
}

window.onload = loadPosts;
