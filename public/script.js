"use strict";

document.addEventListener("DOMContentLoaded", function () {
    loadPosts();
});

// 投稿を取得して表示
function loadPosts() {
    fetch("/bbs", {
        method: "POST", // 投稿の取得もPOSTに変更
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("取得した投稿:", data);
        displayPosts(data);
    })
    .catch(error => console.error("投稿の取得に失敗:", error));
}

// 投稿を表示する
function displayPosts(posts) {
    const postContainer = document.getElementById("postContainer");
    postContainer.innerHTML = ""; // 一旦クリア

    posts.forEach(post => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");

        postElement.innerHTML = `
            <p><strong>${post.author}</strong>: ${post.content}</p>
            <button onclick="likePost(${post.id})">👍 ${post.likes}</button>
            <button onclick="showReplyForm(${post.id})">💬 返信</button>
            <button onclick="editPost(${post.id}, '${post.content}')">✏️ 編集</button>
            <button onclick="deletePost(${post.id})">🗑️ 削除</button>
            <div id="replies-${post.id}">
                ${post.replies.map(reply => `<p>↳ <strong>${reply.author}</strong>: ${reply.content}</p>`).join("")}
            </div>
            <div id="replyForm-${post.id}" style="display:none;">
                <input type="text" id="replyContent-${post.id}" placeholder="返信を入力">
                <button onclick="submitReply(${post.id})">送信</button>
            </div>
        `;

        postContainer.appendChild(postElement);
    });
}

// 新規投稿を送信
document.getElementById("postForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const author = document.getElementById("author").value;
    const content = document.getElementById("content").value;

    fetch("/bbs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, content })
    })
    .then(response => response.json())
    .then(() => {
        loadPosts();
        document.getElementById("postForm").reset();
    })
    .catch(error => console.error("投稿に失敗:", error));
});

// いいね機能
function likePost(id) {
    fetch("/bbs/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
    })
    .then(response => response.json())
    .then(() => loadPosts())
    .catch(error => console.error("いいねに失敗:", error));
}

// 返信フォームを表示
function showReplyForm(id) {
    document.getElementById(`replyForm-${id}`).style.display = "block";
}

// 返信を送信
function submitReply(id) {
    const content = document.getElementById(`replyContent-${id}`).value;
    if (!content) return;

    fetch("/bbs/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, author: "匿名", content })
    })
    .then(response => response.json())
    .then(() => loadPosts())
    .catch(error => console.error("返信に失敗:", error));
}

// 投稿の編集
function editPost(id, oldContent) {
    const newContent = prompt("編集後の内容を入力してください:", oldContent);
    if (!newContent || newContent === oldContent) return;

    fetch("/bbs/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, content: newContent })
    })
    .then(response => response.json())
    .then(() => loadPosts())
    .catch(error => console.error("編集に失敗:", error));
}

// 投稿の削除
function deletePost(id) {
    if (!confirm("本当に削除しますか？")) return;

    fetch("/bbs/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
    })
    .then(response => response.json())
    .then(() => loadPosts())
    .catch(error => console.error("削除に失敗:", error));
}
