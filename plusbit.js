var express = require("express");
var request = require('request')
var moment = require('moment')
var app = express();
var currencyFormatter = require('currency-formatter');

app.listen(3001, () => {
 console.log("Server running on port 3001");
});

function getBitcoin(params, cb){
  let heightList = new Array
  request(`https://insight.bitpay.com/api/addr/${params.address}`, { json: true }, (err, res, balances) => {
    if (typeof balances !== 'object'){
      cb({
        price: '0.00',
        balance: '0.0000',
        rawFiat: 0.00,
        fiatBalance: '0.00',
        transactions: [],
        status: 2,
        heightList: []
      })
    } else {
      request(`https://insight.bitpay.com/api/txs/?address=${params.address}`, { json: true }, (err, res, transactions) => {
      let formatedTransactions = new Array
      transactions.txs.forEach(tx => {
        heightList.push(65)
        formatedTransactions.push({
          txid: tx.txid,
          direction: tx.vin[0].addr == params.address ? 'SENT' : 'RECEIVED',
          value: Number(tx.vout[0].value),
          fiatValue: parseFloat((tx.vout[0].value * params.price).toFixed(2)),
          date: moment(tx.time * 1000).format("DD/MM/YYYY"),
          time: moment(tx.time * 1000).format('HH:mm')
        })
      })
      cb({
        price: currencyFormatter.format(params.price, { code: params.unit }),
        balance: parseFloat(balances.balance).toFixed(4),
        rawFiat: Number(balances.balance * params.price),
        fiatBalance: currencyFormatter.format(balances.balance * params.price, { code: params.unit }),
        transactions: formatedTransactions,
        status: 1,
        heightList: heightList
      })
    })
    }
  })
}

function getIlcoin(params, cb){
  let heightList = new Array
  request(`https://ilcoinexplorer.com/api/addr/${params.address}`, { json: true }, (err, res, balances) => {
    if (typeof balances !== 'object'){
      cb({
        price: '0.00',
        balance: '0.0000',
        rawFiat: 0.00,
        fiatBalance: '0.00',
        transactions: [],
        status: 2,
        heightList: []
      })
    } else {
      request(`https://ilcoinexplorer.com/api/txs/?address=${params.address}`, { json: true }, (err, res, transactions) => {
      let formatedTransactions = new Array
      transactions.txs.forEach(tx => {
        heightList.push(65)
        formatedTransactions.push({
          txid: tx.txid,
          direction: tx.vin[0].addr == params.address ? 'SENT' : 'RECEIVED',
          value: Number(tx.vout[0].value),
          fiatValue: parseFloat((tx.vout[0].value * params.price).toFixed(2)),
          date: moment(tx.time * 1000).format("DD/MM/YYYY"),
          time: moment(tx.time * 1000).format('HH:mm')
        })
      })
      cb({
        price: currencyFormatter.format(params.price, { code: params.unit }),
        balance: parseFloat(balances.balance).toFixed(4),
        rawFiat: Number(balances.balance * params.price),
        fiatBalance: currencyFormatter.format(balances.balance * params.price, { code: params.unit }),
        transactions: formatedTransactions,
        status: 1,
        heightList: heightList
      })
    })
    }
  })
}

function getZel(params, cb){
  let heightList = new Array
  request(`https://explorer.zel.cash/api/addr/${params.address}`, { json: true }, (err, res, balances) => {
    if (typeof balances !== 'object'){
      cb({
        price: '0.00',
        balance: '0.0000',
        rawFiat: 0.00,
        fiatBalance: '0.00',
        transactions: [],
        status: 2,
        heightList: []
      })
    } else {
      request(`https://explorer.zel.cash/api/txs/?address=${params.address}`, { json: true }, (err, res, transactions) => {
      let formatedTransactions = new Array
      transactions.txs.forEach(tx => {
        heightList.push(65)
        formatedTransactions.push({
          txid: tx.txid,
          direction: tx.vin[0].addr == params.address ? 'SENT' : 'RECEIVED',
          value: Number(tx.vout[0].value),
          fiatValue: parseFloat((tx.vout[0].value * params.price).toFixed(2)),
          date: moment(tx.time * 1000).format("DD/MM/YYYY"),
          time: moment(tx.time * 1000).format('HH:mm')
        })
      })
      cb({
        price: currencyFormatter.format(params.price, { code: params.unit }),
        balance: parseFloat(balances.balance).toFixed(4),
        rawFiat: Number(balances.balance * params.price),
        fiatBalance: currencyFormatter.format(balances.balance * params.price, { code: params.unit }),
        transactions: formatedTransactions,
        status: 1,
        heightList: heightList
      })
    })
    }
  })
}

function getZcash(params, cb){
  let heightList = new Array
  request(`https://explorer.z.cash/api/addr/${params.address}`, { json: true }, (err, res, balances) => {
    if (typeof balances !== 'object'){
      cb({
        price: '0.00',
        balance: '0.0000',
        rawFiat: 0.00,
        fiatBalance: '0.00',
        transactions: [],
        status: 2,
        heightList: []
      })
    } else {
      request(`https://explorer.z.cash/api/txs/?address=${params.address}`, { json: true }, (err, res, transactions) => {
      let formatedTransactions = new Array
      transactions.txs.forEach(tx => {
        heightList.push(65)
        formatedTransactions.push({
          txid: tx.txid,
          direction: tx.vin.length == 0 ? 'RECEIVED' : tx.vin[0].addr == params.address ? 'SENT' : 'RECEIVED',
          value: Number(tx.vout[0].value),
          fiatValue: parseFloat((tx.vout[0].value * params.price).toFixed(2)),
          date: moment(tx.time * 1000).format("DD/MM/YYYY"),
          time: moment(tx.time * 1000).format('HH:mm')
        })
      })
      cb({
        price: currencyFormatter.format(params.price, { code: params.unit }),
        balance: parseFloat(balances.balance).toFixed(4),
        rawFiat: Number(balances.balance * params.price),
        fiatBalance: currencyFormatter.format(balances.balance * params.price, { code: params.unit }),
        transactions: formatedTransactions,
        status: 1,
        heightList: heightList
      })
    })
    }
  })
}

app.get("/plusbit/:fiatUnit/:bitcoin/:ilcoin/:zel/:zcash", (req, res, next) => {
  var response = res
  request(`https://api.coingecko.com/api/v3/simple/price?ids=ilcoin,bitcoin,zelcash,zcash&vs_currencies=try,usd,eur,chf,cad,aud,gbp,jpy,nzd,cny,zar,thb,php,krw,vnd,myr,rub,inr,sgd,hkd,ars,brl,dkk,idr,kwd,mxn,nok,pln,pkr,sar,sek,uah`, { json: true }, (err, res, body) => {
    let fiatUnit = req.params.fiatUnit.toLowerCase()

    getBitcoin({address: req.params.bitcoin, price: body.bitcoin[fiatUnit], unit: req.params.fiatUnit}, function(bitcoin_balances){
      getIlcoin({address: req.params.ilcoin, price: body.ilcoin[fiatUnit], unit: req.params.fiatUnit}, function(ilcoin_balances){
        getZel({address: req.params.zel, price: body.zelcash[fiatUnit], unit: req.params.fiatUnit}, function(zel_balances){
          getZcash({address: req.params.zcash, price: body.zcash[fiatUnit], unit: req.params.fiatUnit}, function(zcash_balances){
            response.json({
              totalBalance: currencyFormatter.format(bitcoin_balances.rawFiat + ilcoin_balances.rawFiat + zel_balances.rawFiat + zcash_balances.rawFiat, { code: req.params.fiatUnit }),
              BTC: bitcoin_balances,
              ILC: ilcoin_balances,
              ZEL: zel_balances,
              ZEC: zcash_balances
            })
          })
        })
      })
    })

  })
});