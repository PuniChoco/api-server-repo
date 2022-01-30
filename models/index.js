const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development' // 환경변수가 없으면 개발용으로 
const config = require('../config/config')[env]
console.log('env '+ env)
const { username, password, database, host, dialect,
}= config // 대신 환경변수를 받아온다

// const config = require('../config/config.json')
// const { username, password, database, host, dialect, }= config.development

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
});

const Member = require('./member')(sequelize,Sequelize.DataTypes) //member.js 파일 가져오기 member라는 sequelize model 클래스의 인스턴스를 리턴함

const db = {}
db.Member = Member;
db.sequelize = sequelize;

module.exports = db