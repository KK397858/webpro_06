"use strict";

const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // 静的ファイル提供

let posts = [];
let postId = 1;

// 投稿一覧を取得
app.post("/bbs", (req, res) => {
    res.json(posts); // 投稿データを返す
});

// 投稿を作成
app.post("/bbs", (req, res) => {
    const { author, content } = req.body;
    const newPost = { id: postId++, author, content, likes: 0, replies: [] };
    posts.push(newPost);
    res.json(newPost);
});

// いいね機能
app.post("/bbs/like", (req, res) => {
    const id = parseInt(req.body.id);
    const post = posts.find(p => p.id === id);
    if (post) {
        post.likes++;
        res.json({ success: true, likes: post.likes });
    } else {
        res.status(404).json({ success: false, message: "Post not found" });
    }
});

// 返信機能
app.post("/bbs/reply", (req, res) => {
    const id = parseInt(req.body.id);
    const { author, content } = req.body;
    const post = posts.find(p => p.id === id);
    if (post) {
        const reply = { id: post.replies.length + 1, author, content };
        post.replies.push(reply);
        res.json({ success: true, replies: post.replies });
    } else {
        res.status(404).json({ success: false, message: "Post not found" });
    }
});

// 編集機能
app.post("/bbs/edit", (req, res) => {
    const id = parseInt(req.body.id);
    const { content } = req.body;
    const post = posts.find(p => p.id === id);
    if (post) {
        post.content = content;
        res.json({ success: true, content: post.content });
    } else {
        res.status(404).json({ success: false, message: "Post not found" });
    }
});

// 削除機能
app.post("/bbs/delete", (req, res) => {
    const id = parseInt(req.body.id);
    const index = posts.findIndex(p => p.id === id);
    if (index !== -1) {
        posts.splice(index, 1);
        res.json({ success: true, message: "Post deleted" });
    } else {
        res.status(404).json({ success: false, message: "Post not found" });
    }
});

// サーバー起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
