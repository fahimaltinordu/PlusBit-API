var express = require("express");
var request = require('request')
var moment = require('moment')
var app = express();
var currencyFormatter = require('currency-formatter');

app.listen(3001, () => {
 console.log("Server running on port 3001");
});

function getBitcoin(params, cb){
  request(`https://insight.bitpay.com/api/addr/${params.address}`, { json: true }, (err, res, balances) => {
    request(`https://insight.bitpay.com/api/txs/?address=${params.address}`, { json: true }, (err, res, transactions) => {
      let formatedTransactions = new Array
      transactions.txs.forEach(tx => {
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
        transactions: formatedTransactions
      })
    })
  })
}

function getIlcoin(params, cb){
  request(`https://ilcoinexplorer.com/api/addr/${params.address}`, { json: true }, (err, res, balances) => {
    request(`https://ilcoinexplorer.com/api/txs/?address=${params.address}`, { json: true }, (err, res, transactions) => {
      let formatedTransactions = new Array
      transactions.txs.forEach(tx => {
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
        transactions: formatedTransactions
      })
    })
  })
}

function getZel(params, cb){
  request(`https://explorer.zel.cash/api/addr/${params.address}`, { json: true }, (err, res, balances) => {
    request(`https://explorer.zel.cash/api/txs/?address=${params.address}`, { json: true }, (err, res, transactions) => {
      let formatedTransactions = new Array
      transactions.txs.forEach(tx => {
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
        transactions: formatedTransactions
      })
    })
  })
}

function getSafecoin(params, cb){
  request(`https://explorer.safecoin.org/api/addr/${params.address}`, { json: true }, (err, res, balances) => {
    request(`https://explorer.safecoin.org/api/txs/?address=${params.address}`, { json: true }, (err, res, transactions) => {
      let formatedTransactions = new Array
      transactions.txs.forEach(tx => {
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
        transactions: formatedTransactions
      })
    })
  })
}

app.get("/plusbit/:fiatUnit/:bitcoin/:ilcoin/:zel/:safe", (req, res, next) => {
  var response = res
  request(`https://api.coingecko.com/api/v3/simple/price?ids=ilcoin,bitcoin,zelcash,safe-coin-2&vs_currencies=try,usd,eur,chf,cad,aud,gbp,jpy,nzd,cny,zar,thb,php,krw,vnd,myr,rub,inr,sgd,hkd,ars,brl,dkk,idr,kwd,mxn,nok,pln,pkr,sar,sek,uah`, { json: true }, (err, res, body) => {
    let fiatUnit = req.params.fiatUnit.toLowerCase()

    getBitcoin({address: req.params.bitcoin, price: body.bitcoin[fiatUnit], unit: req.params.fiatUnit}, function(bitcoin_balances){
      getIlcoin({address: req.params.ilcoin, price: body.ilcoin[fiatUnit], unit: req.params.fiatUnit}, function(ilcoin_balances){
        getZel({address: req.params.zel, price: body.zelcash[fiatUnit], unit: req.params.fiatUnit}, function(zel_balances){
          getSafecoin({address: req.params.safe, price: body['safe-coin-2'][fiatUnit], unit: req.params.fiatUnit}, function(safe_balances){
            response.json({
              totalBalance: currencyFormatter.format(bitcoin_balances.rawFiat + ilcoin_balances.rawFiat + zel_balances.rawFiat + safe_balances.rawFiat, { code: req.params.fiatUnit }),
              BTC: bitcoin_balances,
              ILC: ilcoin_balances,
              ZEL: zel_balances,
              SAFE: safe_balances
            })
          })
        })
      })
    })

  })
});