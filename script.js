// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getDatabase, ref, push, onValue, set, update } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";

// Firebase configuration
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
const db = getDatabase(app);

// DOM Elements
const usernameInput = document.getElementById('usernameInput');
const setUsernameButton = document.getElementById('setUsername');
const postForm = document.getElementById('postForm');
const postTitleInput = document.getElementById('postTitle');
const postContentInput = document.getElementById('postContent');
const postTagsInput = document.getElementById('postTags');
const postImageInput = document.getElementById('postImage');
const submitPostButton = document.getElementById('submitPost');
const postList = document.getElementById('postList');

let currentUsername = null;

// Set Username
setUsernameButton.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
        currentUsername = username;
        localStorage.setItem('studyChatUsername', username);
        usernameInput.value = '';
        postForm.style.display = 'block';
        loadPosts();
    }
});

// Submit Post
submitPostButton.addEventListener('click', () => {
    const title = postTitleInput.value.trim();
    const content = postContentInput.value.trim();
    const tags = postTagsInput.value.trim();
    const image = postImageInput.files[0];

    if (title && content && currentUsername) {
        let post = {
            username: currentUsername,
            title,
            content,
            tags,
            image: null, // Placeholder for image URL
            comments: []
        };

        if (image) {
            const reader = new FileReader();
            reader.onload = (e) => {
                post.image = e.target.result;
                push(ref(db, 'posts'), post);
            };
            reader.readAsDataURL(image);
        } else {
            push(ref(db, 'posts'), post);
        }
        postTitleInput.value = '';
        postContentInput.value = '';
        postTagsInput.value = '';
        postImageInput.value = '';
    }
});

// Load Posts
function loadPosts() {
    onValue(ref(db, 'posts'), (snapshot) => {
        postList.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const post = childSnapshot.val();
            const postItem = document.createElement('li');
            postItem.innerHTML = `
                <strong>${post.username}</strong>: ${post.title}
                <p>${post.content}</p>
                ${post.image ? `<img src="${post.image}" style="width:100px;" />` : ''}
                <em>Tags: ${post.tags}</em>
                <button onclick="addComment('${childSnapshot.key}')">Comment</button>
                <ul id="comments-${childSnapshot.key}">
                    ${post.comments.map(comment => `<li>${comment}</li>`).join('')}
                </ul>
            `;
            postList.appendChild(postItem);
        });
    });
}

// Add Comment
function addComment(postId) {
    const comment = prompt('Enter your comment:');
    if (comment) {
        const commentRef = ref(db, `posts/${postId}/comments`);
        push(commentRef, comment);
    }
}

// Initialize Username from Local Storage
window.addEventListener('load', () => {
    const storedUsername = localStorage.getItem('studyChatUsername');
    if (storedUsername) {
        currentUsername = storedUsername;
        postForm.style.display = 'block';
        loadPosts();
    }
});
