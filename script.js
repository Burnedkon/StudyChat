// Initialize Firebase
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child, update } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC_Pu9M7JlEyu9ZdwC8vvR_RJpvum6Ob_I",
  authDomain: "studychat-ee7e6.firebaseapp.com",
  projectId: "studychat-ee7e6",
  storageBucket: "studychat-ee7e6.appspot.com",
  messagingSenderId: "287137347249",
  appId: "1:287137347249:web:ac68545add0b15e2da9490",
  measurementId: "G-9LL85T6RQ0"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

let currentUsername = "";

document.getElementById("setUsername").onclick = function() {
    const username = document.getElementById("usernameInput").value;
    const password = document.getElementById("passwordInput").value;

    if (username && password) {
        // Store username and password
        set(ref(database, 'users/' + username), {
            password: password
        }).then(() => {
            currentUsername = username;
            document.getElementById("userSection").style.display = 'none';
            document.getElementById("postForm").style.display = 'block';
            loadPosts();
        });
    }
};

// Submit Post
document.getElementById("submitPost").onclick = function() {
    const title = document.getElementById("postTitle").value;
    const content = document.getElementById("postContent").value;
    const tags = document.getElementById("postTags").value;
    const postImage = document.getElementById("postImage").files[0];

    const newPostKey = ref(database, 'posts').push().key;
    
    const postData = {
        username: currentUsername,
        title: title,
        content: content,
        tags: tags,
        comments: [],
        imageUrl: ""
    };

    if (postImage) {
        const imageRef = storageRef(storage, `images/${newPostKey}.jpg`);
        uploadBytes(imageRef, postImage).then(() => {
            postData.imageUrl = `images/${newPostKey}.jpg`;
            set(ref(database, 'posts/' + newPostKey), postData);
        });
    } else {
        set(ref(database, 'posts/' + newPostKey), postData);
    }

    loadPosts();
};

// Load Posts
function loadPosts() {
    get(child(ref(database), 'posts')).then((snapshot) => {
        const postsList = document.getElementById("postList");
        postsList.innerHTML = ""; // Clear previous posts
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const post = childSnapshot.val();
                const li = document.createElement("li");
                li.innerHTML = `<strong>${post.username}</strong>: ${post.title}<br>${post.content}<br>${post.tags}`;
                if (post.imageUrl) {
                    li.innerHTML += `<img src="${post.imageUrl}" alt="Post Image" style="max-width: 100px;"/>`;
                }
                postsList.appendChild(li);
            });
        } else {
            postsList.innerHTML = "No posts available.";
        }
    });
}
