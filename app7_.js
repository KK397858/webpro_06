"use strict";
const express = require("express");
const app = express();

let bbs = [];  // 本来はDBMSを使用するが，今回はこの変数にデータを蓄える

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

// 既存のルートコード...

// 投稿の編集機能
app.post("/edit", (req, res) => {
  const { id, newMessage } = req.body;
  
  const post = bbs.find(post => post.id === id);
  if (post) {
    post.message = newMessage; 
    res.json({ success: true, message: "投稿が編集されました", post });
  } else {
    res.json({ success: false, message: "投稿が見つかりません" });
  }
});

// 投稿の削除機能
app.post("/delete", (req, res) => {
  const { id } = req.body;
  
  const index = bbs.findIndex(post => post.id === id);
  if (index !== -1) {
    bbs.splice(index, 1);  // 投稿を削除
    res.json({ success: true, message: "投稿が削除されました" });
  } else {
    res.json({ success: false, message: "投稿が見つかりません" });
  }
});

// 返信機能
app.post("/reply", (req, res) => {
  const { parentId, name, message } = req.body;
  
  const newReply = {
    id: Date.now(),  // 一意なIDを生成
    parentId,        // 親投稿のID
    name,
    message,
    timestamp: new Date()
  };

  bbs.push(newReply);  // 返信をbbsに追加
  res.json({ success: true, message: "返信が投稿されました", reply: newReply });
});

// いいね機能
app.post("/like", (req, res) => {
  const { id } = req.body;
  
  const post = bbs.find(post => post.id === id);
  if (post) {
    post.likes = (post.likes || 0) + 1;  // いいねを増やす
    res.json({ success: true, message: "いいねが追加されました", likes: post.likes });
  } else {
    res.json({ success: false, message: "投稿が見つかりません" });
  }
});

// これ以降は、既存のBBS関連のコード...
app.post("/check", (req, res) => {
  // 本来はここでDBMSに問い合わせる
  res.json({ number: bbs.length });
});

app.post("/read", (req, res) => {
  const start = Number(req.body.start);
  if (start == 0) res.json({ messages: bbs });
  else res.json({ messages: bbs.slice(start) });
});

app.post("/post", (req, res) => {
  const name = req.body.name;
  const message = req.body.message;
  
  const newPost = { 
    id: Date.now(),  // 一意なIDを生成 
    name, 
    message, 
    likes: 0,  // 初期値0のいいね
    replies: []  // 返信用の空配列
  };
  
  bbs.push(newPost);
  res.json({ number: bbs.length });
});

// 既存のBBS以外の機能...

app.listen(8080, () => console.log("Example app listening on port 8080!"));
