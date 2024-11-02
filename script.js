let username = '';
let profilePicture = '';
let userDescription = '';
let currentCommunity = '';

// Set username, description, and profile picture
document.getElementById("setUsername").addEventListener("click", async function() {
    const usernameInput = document.getElementById("usernameInput").value.trim();
    const descriptionInput = document.getElementById("userDescriptionInput").value.trim();
    const profilePicInput = document.getElementById("profilePictureInput").files[0];

    if (usernameInput && descriptionInput) {
        username = usernameInput;
        userDescription = descriptionInput;
        profilePicture = profilePicInput ? await convertToBase64(profilePicInput) : '';

        document.getElementById("userSection").style.display = 'none';
        document.getElementById("communityForm").style.display = 'block';
    } else {
        alert("Please enter both a username and description.");
    }
});

// Community setup
document.getElementById("createCommunity").addEventListener("click", function() {
    const communityName = document.getElementById("communityName").value.trim();
    if (communityName) {
        currentCommunity = communityName;
        document.getElementById("postForm").style.display = 'block';
        loadPosts();
    } else {
        alert("Please enter a community name.");
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
            username,
            profilePicture,
            description: userDescription,
            title,
            content,
            tags,
            comments: [],
            image,
            community: currentCommunity
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

    posts
        .filter(post => post.community === currentCommunity)
        .forEach(post => {
            const postItem = document.createElement("li");
            postItem.innerHTML = `
                <strong>${post.username}</strong>
                <img src="${post.profilePicture}" alt="Profile Picture" class="profile-picture">
                <p><em>${post.description}</em></p>
                <p><strong>${post.title}</strong></p>
                <p>${post.content}</p>
                <p><em>Tags: ${post.tags}</em></p>
                ${post.image ? `<img src="${post.image}" alt="Post Image" class="post-image">` : ''}
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

            post.comments.forEach(comment => {
                const commentItem = document.createElement("li");
                commentItem.innerHTML = `<strong>${comment.username}:</strong> ${comment.text}`;
                commentList.appendChild(commentItem);
            });

            commentButton.addEventListener("click", () => {
                const commentText = commentInput.value.trim();
                if (commentText) {
                    post.comments.push({ username, text: commentText });
                    localStorage.setItem("posts", JSON.stringify(posts));
                    loadPosts();
                }
            });

            postList.appendChild(postItem);
        });
}

window.onload = loadPosts;

