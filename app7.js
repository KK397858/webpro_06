"use strict";
const express = require("express");
const app = express();

let bbs = [];  // 本来はDBMSを使用するが，今回はこの変数にデータを蓄える

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

// 既存のルートコード
app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1: message1, greet2: message2 });
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1: "Hello world", greet2: "Bon jour" });
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename: "./public/Apple_logo_black.svg", alt: "Apple Logo" });
});

app.get("/luck", (req, res) => {
  const num = Math.floor(Math.random() * 6 + 1);
  let luck = '';
  if (num == 1) luck = '大吉';
  else if (num == 2) luck = '中吉';
  console.log('あなたの運勢は' + luck + 'です');
  res.render('luck', { number: num, luck: luck });
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number(req.query.win);
  let total = Number(req.query.total);
  console.log({ hand, win, total });
  const num = Math.floor(Math.random() * 3 + 1);
  let cpu = '';
  if (num == 1) cpu = 'グー';
  else if (num == 2) cpu = 'チョキ';
  else cpu = 'パー';
  // ここに勝敗の判定を入れる
  // 今はダミーで人間の勝ちにしておく
  let judgement = '勝ち';
  win += 1;
  total += 1;
  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  };
  res.render('janken', display);
});

app.get("/get_test", (req, res) => {
  res.json({
    answer: 0
  });
});

app.get("/add", (req, res) => {
  console.log("GET");
  console.log(req.query);
  const num1 = Number(req.query.num1);
  const num2 = Number(req.query.num2);
  console.log(num1);
  console.log(num2);
  res.json({ answer: num1 + num2 });
});

app.post("/add", (req, res) => {
  console.log("POST");
  console.log(req.body);
  const num1 = Number(req.body.num1);
  const num2 = Number(req.body.num2);
  console.log(num1);
  console.log(num2);
  res.json({ answer: num1 + num2 });
});


// 投稿の編集
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

// 投稿の削除
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

// 返信投稿
app.post("/reply", (req, res) => {
  const { parentId, name, message } = req.body;
  
  const newReply = {
    id: Date.now(), 
    parentId,  
    name,
    message,
    timestamp: new Date()
  };

  bbs.push(newReply);  
  res.json({ success: true, message: "返信が投稿されました", reply: newReply });
});

// いいね機能
app.post("/like", (req, res) => {
  const { id } = req.body;

  const post = bbs.find(post => post.id === id);
  if (post) {
    post.likes = (post.likes || 0) + 1;  
    res.json({ success: true, message: "いいねが追加されました", likes: post.likes });
  } else {
    res.json({ success: false, message: "投稿が見つかりません" });
  }
});

// BBSの投稿数
app.post("/check", (req, res) => {
  // 本来はここでDBMSに問い合わせる
  res.json({ number: bbs.length });
});


app.post("/read", (req, res) => {
  // 本来はここでDBMSに問い合わせる
  const start = Number(req.body.start);
  console.log("read -> " + start);
  if (start == 0) res.json({ messages: bbs });
  else res.json({ messages: bbs.slice(start) });
});


app.post("/post", (req, res) => {
  const name = req.body.name;
  const message = req.body.message;
  console.log([name, message]);

  const newPost = { id: Date.now(), name, message, likes: 0 };  // idを追加
  bbs.push(newPost);
  res.json({ number: bbs.length });
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
