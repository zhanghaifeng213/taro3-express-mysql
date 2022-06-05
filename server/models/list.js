const express = require("express");
const router = express.Router();
const sqlQuery = require("../mysql");
const dayjs = require('dayjs')
// const request = require('request')

// const obj = {"id":1,"arrTime":"2021-09-05T10:55:00.000Z","airCompanyName":"中国国航","airIcon":"https://images3.c-ctrip.com/ztrip/airline/CA.png","price":447,"dptTimeStr":"16:25","arrTimeStr":"18:55"}

// request("https://www.brown77.cn/list/singleList", {json: true}, async (err, res, body) => {
//   const strSql1 =
//   `
//     create table flight_list(
//       id int not null auto_increment,
//       arrTime char(50) not null,
//       airCompanyName char(50) not null,
//       airIcon char(50) not null,
//       price int not null,
//       dptTimeStr char(50) not null,
//       arrTimeStr char(50) not null,
//       primary key (id)
//     ) engine=innodb;
//   `
//   // 删除表
//   await sqlQuery(`drop table if exists flight_list`)
//   await sqlQuery(strSql1)
//   for (let i = 0; i < body.result.length; i++) {
//     const { id, arrTime, airCompanyName, airIcon, price, dptTimeStr, arrTimeStr } = body.result[i]
//     const strSql2 = `insert into flight_list(id, arrTime, airCompanyName, airIcon, price, dptTimeStr, arrTimeStr) values (null, '${arrTime}', '${airCompanyName}', '${airIcon}', '${price}', '${dptTimeStr}', '${arrTimeStr}');`
//     await sqlQuery(strSql2)
//   }
// })
/**
 * 得到一个两数之间的随机整数
 */
const randomPrice = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}

router.get('/singleList', async (req, res) => {
  // req.query 请求参数
  const {
    dptAirportName,
    dptCityName,
    arrCityName,
    arrAirportName,
    dptDate,
  } = req.query
  const strSql = `select * from flight_list`;
  try {
    const result = await sqlQuery(strSql)
    // 模拟真实场景
    const resultList = result.map(item => ({
      ...item,
      dptAirportName,
      dptCityName,
      arrCityName,
      arrAirportName,
      dptTime: dptDate, // 模拟日期选择
      price: randomPrice(300, 1000),
      dptTimeStr: dayjs(item.dptTime).format("HH:mm"),
      arrTimeStr: dayjs(item.arrTime).format("HH:mm"),
    }))
    res.send({
      code: 1,
      message: "请求成功",
      result: resultList,
    })
  } catch(err) {
    res.send({
      code: -1,
      message: "请求失败"
    });
  }
})

module.exports = router