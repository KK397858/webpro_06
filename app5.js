const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

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
  let hand = req.query.hand || 'グー';
  let win = Number(req.query.win) || 0;
  let total = Number(req.query.total) || 0;
  console.log({ hand, win, total });

  const num = Math.floor(Math.random() * 3); 
  let cpu = '';
  if (num === 0) cpu = 'グー';
  else if (num === 1) cpu = 'チョキ';
  else if (num === 2) cpu = 'パー';

  let judgement = '負け'; 
  if (hand === 'グー') {
    if (num === 0) judgement = 'あいこ';
    else if (num === 1) {
      judgement = '勝ち';
      win += 1;
    }
  } else if (hand === 'チョキ') {
    if (num === 1) judgement = 'あいこ';
    else if (num === 2) {
      judgement = '勝ち';
      win += 1;
    }
  } else if (hand === 'パー') {
    if (num === 2) judgement = 'あいこ';
    else if (num === 0) {
      judgement = '勝ち';
      win += 1;
    }
  }

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

app.get("/lot", (req, res) => {
  let dire = req.query.dire || '上';
  let win = Number(req.query.win) || 0;
  let total = Number(req.query.total) || 0;
  console.log({ dire, win, total });

  const num = Math.floor(Math.random() * 4); 
  let cpu = '';
  if (num === 0) cpu = '上';
  else if (num === 1) cpu = '右';
  else if (num === 2) cpu = '下';
  else if (num === 3) cpu = '左';

  let judgement = '負け'; 
  if (dire === '上') {
    if (num === 0) {
      judgement = '勝ち';
      win += 1;
    }
  } else if (dire === '右') {
    if (num === 1) {
      judgement = '勝ち';
      win += 1;
    }
  } else if (dire === '下') {
    if (num === 2) {
      judgement = '勝ち';
      win += 1;
    }
  }else if (dire === '左') {
    if (num === 3) {
      judgement = '勝ち';
      win += 1;
    }
  }

  total += 1;

  const display = {
    your: dire,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  };
  res.render('lot', display);
});

app.route("/math-game")
  
  .get((req, res) => {
    
    const num1 = Math.floor(Math.random() * 90) + 10; 
    const num2 = Math.floor(Math.random() * 90) + 10; 
    const correctAnswer = num1 * num2;

    let result = '';
    res.render('math-game', {
      num1: num1,
      num2: num2,
      correctAnswer: correctAnswer,
      result: result 
    });
  })
  
  .post((req, res) => {
    const playerAnswer = Number(req.body.answer); 
    const num1 = Number(req.body.num1);  
    const num2 = Number(req.body.num2);  
    const correctAnswer = num1 * num2;

    let result = '';
    if (!isNaN(playerAnswer)) {
      if (playerAnswer === correctAnswer) {
        result = '◯'; 
      } else {
        result = '✗'; 
      }
    } else {
      result = '✗'; 
    }

    res.render('math-game', {
      num1: num1,
      num2: num2,
      result: result,
      playerAnswer: playerAnswer,
      correctAnswer: correctAnswer
    });
  });

app.listen(8080, () => console.log("Example app listening on port 8080!"));
