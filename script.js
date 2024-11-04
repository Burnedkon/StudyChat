// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child, onValue } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC_Pu9M7JlEyu9ZdwC8vvR_RJpvum6Ob_I",
    authDomain: "studychat-ee7e6.firebaseapp.com",
    projectId: "studychat-ee7e6",
    storageBucket: "studychat-ee7e6.appspot.com",
    messagingSenderId: "287137347249",
    appId: "1:287137347249:web:ac68545add0b15e2da9490",
    measurementId: "G-9LL85T6RQ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

let currentUsername = null;

// Set username and password
document.getElementById('setUsername').onclick = () => {
    const username = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;

    if (username && password) {
        set(ref(database, 'users/' + username), {
            password: password
        }).then(() => {
            currentUsername = username;
            document.getElementById('userSection').style.display = 'none';
            document.getElementById('postForm').style.display = 'block';
            loadPosts();
        }).catch((error) => {
            console.error('Error setting username: ', error);
        });
    }
};

// Login functionality
document.getElementById('loginButton').onclick = () => {
    const username = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;

    get(child(ref(database), 'users/' + username)).then((snapshot) => {
        if (snapshot.exists() && snapshot.val().password === password) {
            currentUsername = username;
            document.getElementById('userSection').style.display = 'none';
            document.getElementById('postForm').style.display = 'block';
            loadPosts();
        } else {
            alert('Invalid username or password');
        }
    }).catch((error) => {
        console.error('Error logging in: ', error);
    });
};

// Submit a new post
document.getElementById('submitPost').onclick = () => {
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const tags = document.getElementById('postTags').value;
    const imageFile = document.getElementById('postImage').files[0];

    const postId = Date.now();

    if (imageFile) {
        const imageRef = storageRef(storage, 'images/' + postId);
        uploadBytes(imageRef, imageFile).then(() => {
            const imageUrl = `images/${postId}`;
            savePost(title, content, tags, imageUrl, postId);
        }).catch((error) => {
            console.error('Error uploading image: ', error);
        });
    } else {
        savePost(title, content, tags, null, postId);
    }
};

// Function to save post data
function savePost(title, content, tags, imageUrl, postId) {
    set(ref(database, 'posts/' + postId), {
        username: currentUsername,
        title: title,
        content: content,
        tags: tags,
        imageUrl: imageUrl,
        comments: []
    }).then(() => {
        loadPosts();
        document.getElementById('postTitle').value = '';
        document.getElementById('postContent').value = '';
        document.getElementById('postTags').value = '';
        document.getElementById('postImage').value = '';
    }).catch((error) => {
        console.error('Error saving post: ', error);
    });
}

// Load posts from the database
function loadPosts() {
    onValue(ref(database, 'posts'), (snapshot) => {
        const posts = snapshot.val();
        const postList = document.getElementById('postList');
        postList.innerHTML = '';

        for (const postId in posts) {
            const post = posts[postId];
            const postElement = document.createElement('li');
            postElement.className = 'post';
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <p><strong>Tags:</strong> ${post.tags}</p>
                ${post.imageUrl ? `<img src="${post.imageUrl}" alt="Post Image" style="max-width: 100%;">` : ''}
                <p><strong>Posted by:</strong> ${post.username}</p>
                <div class="comments">
                    <h4>Comments:</h4>
                    <ul id="comments-${postId}"></ul>
                    <input type="text" placeholder="Add a comment..." id="commentInput-${postId}">
                    <button onclick="addComment('${postId}')">Comment</button>
                </div>
            `;
            postList.appendChild(postElement);
            loadComments(postId);
        }
    });
}

// Load comments for a post
function loadComments(postId) {
    onValue(ref(database, `posts/${postId}/comments`), (snapshot) => {
        const comments = snapshot.val() || [];
        const commentList = document.getElementById(`comments-${postId}`);
        commentList.innerHTML = '';

        comments.forEach((comment) => {
            const commentElement = document.createElement('li');
            commentElement.className = 'comment';
            commentElement.textContent = comment;
            commentList.appendChild(commentElement);
        });
    });
}

// Add a comment to a post
function addComment(postId) {
    const commentInput = document.getElementById(`commentInput-${postId}`);
    const comment = commentInput.value;

    if (comment) {
        const postCommentsRef = ref(database, `posts/${postId}/comments`);
        onValue(postCommentsRef, (snapshot) => {
            const comments = snapshot.val() || [];
            comments.push(comment);

            set(postCommentsRef, comments).then(() => {
                commentInput.value = '';
            }).catch((error) => {
                console.error('Error adding comment: ', error);
            });
        });
    }
}

// Logout functionality
document.getElementById('logoutButton').onclick = () => {
    currentUsername = null;
    document.getElementById('userSection').style.display = 'block';
    document.getElementById('postForm').style.display = 'none';
};
