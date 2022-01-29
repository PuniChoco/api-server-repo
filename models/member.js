'use strict';
const {  Model  } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Member extends Model {  }
  // Member는 리퀄라이즈의 모델 클래스를 물려 받는다
  Member.init({ // init 메소드
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: DataTypes.STRING,
    team: DataTypes.STRING,
    position: DataTypes.STRING,
    emailAddress: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    admissionDate: DataTypes.DATE,
    birthday: DataTypes.DATE,
    profileImage: DataTypes.STRING 
    // 같은 이름을 할당해 주지 않으면 Model이 인식할 수 없다 빠짐없이 다 적혀 있어야 한다
  }, {
    sequelize, // sequelize:sequelize 객체
    modelName: 'Member',
  });
  return Member;
};