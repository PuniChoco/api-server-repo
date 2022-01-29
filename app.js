const express = require('express');
// const { del } = require('express/lib/application');
// const { send } = require('express/lib/response');
// const members = require('./members')
const db = require('./models');   // 디렉토리를 지정하면 index.js는 알아서 찾는다

const { Member } = db;
// const { sequelize } = db; 이미 Member가 sequelize 객체임

const app = express()

// app.use(bodyParser.json())
app.use(express.json());

app.post('/api/members', async(req, res) => {
  const newMemberList = req.body;
  var postCount = 0
  newMemberList.forEach(async (el) => {
    const member = await Member.create(el)    // Member.build(el); member.save() 해줘도 된다. build는 비동기(save가 아님. 클라이언트 쪽에서 처리해서 그런 듯)
    postCount++;
    console.log(`postCount: ${postCount} newMemberList: ${newMemberList.length}`)
    if(newMemberList.length == postCount){
      res.send(postCount+' posted')
    }
  })
});

app.put('/api/members/:id', async(req, res) => {
  const {id} = req.params
  const newInfo = req.body
  const member = await Member.findOne({where : {id}})
  if (member){
    Object.keys(newInfo).forEach((prop => {
      console.log(newInfo[prop])
      member[prop] = newInfo[prop]
    }))
    member.save();
    res.send(member)
  }
  else res.status(404).send({ message:`id ${id}를 가지는 개체가 없습니다`})
})

// app.put('/api/members/:id', async(req, res) => {
//   const {id} = req.params
//   const newInfo = req.body
//   const result = await Member.update(newInfo, {where : {id}})
//   if(result[0]){
//     res.send(`${result[0]} affected`) 
//   }
//   else {
//     res.status(404).send({ message : 'No member with the ID' })
//   }
// })

  // if(member){
  //   Object.keys(newInfo).forEach((prop => {
  //     // Object 는 static method 그 자체로 작동한다.
  //     // newInfo라는 오브젝트의 키를 모아서 배열로 만듬 
  //     // console.log(Object) Functiong: Object 라고 뜸
  //     // console.log(Object.keys(newInfo)) 
  //     member[prop] = newInfo[prop];
  //     // console.log(newInfo[prop]) 각 프로퍼티의 value 값을 보여준다
  //   }))
    // console.log(Object.entries(members)) 객체의 프로퍼티와 밸류값을 보여준다
    // 배열일 경우 프로퍼티는 인덱스 번호가 출력됨
    // res.send(member);

app.get('/', (req,res) => {
  res.send('Welcome to Korea')
  // send가 JSON 문자열을 변환시켜준다
})


app.get('/api/members/:id', async (req,res) => {
  // :id는 route parameter 변화하는 값을 가져올 수 있게 한다
  const { id } = req.params
  console.log(typeof id)
  const member = await Member.findOne({ where : { id } })

  if(member){
    res.send(member)
  } else{
    res.status(404).send({ message : 'there is no such member with the id'})
  }
  
  // send가 JSON 문자열을 변환시켜준다
})


app.get('/api/members', async (req,res) => {
  const {team} = req.query
  // req.query 의 리턴값 { team: 'engineering' } req.query.team 리턴값 engineering
  // console.log(req.query.team)
  //쿼리 중에 팀이라는 값을 가져옴, team에는 sales, marketing, engineering 등 올 수 있다
  if(team){
    // const members = await Member.findAll({order: [[sequelize.col('admissionDate'), 'DESC']]});
    const members = await Member.findAll({where : { team }, order: [['admissionDate', 'DESC']]});
    // const memberOrdered = members.filter((m) => m.team === team) where 프로퍼티를 넣어줌으로서 필요없어졌다.
    await console.log(members)
    res.send(members) //true 가 되는 element를 리턴한다
  }
  else {
    // const members = await Member.findAll({order: [['admissionDate', 'DESC']]});
    const members = await Member.findAll();
    res.send(members)}
  // send가 JSON 문자열을 변환시켜준다
})

// app.delete('/api/members/:id', async (req,res) => {
//   const { id } = await req.params
//   console.log(id)
//   const deleteCount = await Member.destroy()
//   // const deleteCount = await Member.destroy({where : { id }})
//   // 여기서도 await를 쓰지 않으면 에러가 나온다.
//   //Error: WHERE parameter "id" has invalid "undefined" value
//   if(deleteCount){
//     res.send({message : `row data deleted`})
//   }
//   else{res.send( Message = 'no such member')}
// })


app.delete('/api/members/', async (req, res) => {
  const { team } = req.query;
  console.log(' team '+ team + team.length)
  let deleteCount = 0
  const member = await Member.findAll({where : {team}});
  const result = await Member.destroy({where : {}}); // 삭제한 개체의 갯수가 result에 리턴됨
  console.log(' result '+ result)
  if(team){
    await console.log('member '+ member +' team '+ team)  
    Object.keys(member).forEach(async (m) => {
      const result = await member[m].destroy();
      console.log('result '+ result)  
      deleteCount++
    }) 
  }
  // const member = await Member.findOne({ where: { id } });
  // const member = await Member.destroy({});
  // 여기에 코드를 추가하세요.
  console.log(deleteCount)
  res.send(deleteCount +'object deleted')
});

app.get('*', (req,res) => {
  res.send('Page not available')
})

app.listen(process.env.PORT || 3000,()=>{
  console.log('server listening...')
})