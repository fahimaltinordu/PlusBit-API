var express = require("express");
var request = require('request')
var moment = require('moment')
var app = express();
var currencyFormatter = require('currency-formatter')

app.listen(3001, () => {
 console.log("Server running on port 3001");
});

function getTxValue(vout, address, direction){
  // Needs some more work
  if (direction == 'SENT'){
    var voutAddress
    for (var i = 0; i < vout.length; i++){
      if (vout[i].scriptPubKey.addresses !== undefined){
        if (vout[i].scriptPubKey.addresses[0] !== address) voutAddress = vout[i].scriptPubKey.addresses[0]
      }
    }
    if (voutAddress !== undefined){
      return vout[vout.findIndex((x) => x.scriptPubKey.addresses[0] === voutAddress)].value
    } else {
      // tx sent to self
      let voutValues = new Array
      for (var i = 0; i < vout.length; i++){
        voutValues.push(Number(vout[i].value))
      }
      return Math.min.apply( Math, voutValues )
    }
  } else {
    var voutAddress
    for (var i = 0; i < vout.length; i++){
      if (vout[i].scriptPubKey.addresses !== undefined){
        if (vout[i].scriptPubKey.addresses[0] == address) return vout[i].value
      }
    }
    if (voutAddress !== undefined){
      return vout[vout.findIndex((x) => x.scriptPubKey.addresses[0] === voutAddress)].value
    }
  }
}

function getBitcoin(params, cb){
  let heightList = new Array
  try {
  request(`https://explorer.btc.zelcore.io/api/addr/${params.address}/utxo`, { json: true }, (err, res, utxos) => {
    if (typeof utxos !== 'object'){
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
      let balance = 0
      for (var i = 0; i < utxos.length; i++){
        balance = balance + utxos[i].amount
      }
      request(`https://explorer.btc.zelcore.io/api/txs/?address=${params.address}`, { json: true }, (err, res, transactions) => {
      let formatedTransactions = new Array
      transactions.txs.forEach(tx => {
        let value = getTxValue(tx.vout, params.address, tx.vin[0].addr == params.address ? 'SENT' : 'RECEIVED')
        heightList.push(65)
        formatedTransactions.push({
          txid: tx.txid,
          direction: tx.vin[0].addr == params.address ? 'SENT' : 'RECEIVED',
          to_from: tx.vin[0].addr == params.address ? tx.vout[0].scriptPubKey.addresses[0] : tx.vin[0].addr,
          value: Number(value),
          fiatValue: parseFloat((value * params.price).toFixed(2)),
          date: moment(tx.time * 1000).format("DD/MM/YYYY"),
          time: moment(tx.time * 1000).format('HH:mm'),
          confirmations: tx.confirmations
        })
      })
      cb({
        price: currencyFormatter.format(params.price, { code: params.unit }),
        balance: parseFloat(balance).toFixed(8),
        rawFiat: Number(balance * params.price),
        fiatBalance: currencyFormatter.format(balance * params.price, { code: params.unit }),
        transactions: formatedTransactions,
        status: 1,
        heightList: heightList
      })
    })
    }
  })
} catch (err) {
  throw new Error('Error with bitcoin. Request will time out', err)
}
}

function getIlcoin(params, cb){
  let heightList = new Array
  try {
  request(`https://ilcoinexplorer.com/api/addr/${params.address}/utxo`, { json: true }, (err, res, utxos) => {
    if (typeof utxos !== 'object'){
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
      let balance = 0
      for (var i = 0; i < utxos.length; i++){
        balance = balance + utxos[i].amount
      }
      request(`https://ilcoinexplorer.com/api/txs/?address=${params.address}`, { json: true }, (err, res, transactions) => {
      let formatedTransactions = new Array
      transactions.txs.forEach(tx => {
        let value = getTxValue(tx.vout, params.address, tx.vin[0].addr == params.address ? 'SENT' : 'RECEIVED')
        heightList.push(65)
        formatedTransactions.push({
          txid: tx.txid,
          direction: tx.vin.length == 0 ? 'RECEIVED' : tx.vin[0].addr == params.address ? 'SENT' : 'RECEIVED',
          to_from: tx.vin[0].addr == params.address ? tx.vout[0].scriptPubKey.addresses[0] : tx.vin[0].addr,
          value: Number(value),
          fiatValue: parseFloat((value * params.price).toFixed(2)),
          date: moment(tx.time * 1000).format("DD/MM/YYYY"),
          time: moment(tx.time * 1000).format('HH:mm'),
          confirmations: tx.confirmations
        })
      })
      cb({
        price: currencyFormatter.format(params.price, { code: params.unit }),
        balance: parseFloat(balance).toFixed(8),
        rawFiat: Number(balance * params.price),
        fiatBalance: currencyFormatter.format(balance * params.price, { code: params.unit }),
        transactions: formatedTransactions,
        status: 1,
        heightList: heightList
      })
    })
    }
  })
} catch (err) {
  throw new Error('Error with ilcoin, request will timeout ', err)
}
}

function getZel(params, cb){
  let heightList = new Array
  try {
  request(`https://explorer.zel.cash/api/addr/${params.address}/utxo`, { json: true }, (err, res, utxos) => {
    if (typeof utxos !== 'object'){
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
      let balance = 0
      for (var i = 0; i < utxos.length; i++){
        balance = balance + utxos[i].amount
      }
      request(`https://explorer.zel.cash/api/txs/?address=${params.address}`, { json: true }, (err, res, transactions) => {
      let formatedTransactions = new Array
      transactions.txs.forEach(tx => {
        let value = getTxValue(tx.vout, params.address, tx.vin.length == 0 ? 'RECEIVED' : tx.vin[0].addr == params.address ? 'SENT' : 'RECEIVED')
        heightList.push(65)
        formatedTransactions.push({
          txid: tx.txid,
          direction: tx.vin.length == 0 ? 'RECEIVED' : tx.vin[0].addr == params.address ? 'SENT' : 'RECEIVED',
          to_from: tx.vin.length == 0 ? 'Sheilded Transaction' : tx.vin[0].addr == params.address ? tx.vout[0].scriptPubKey.addresses[0] : tx.vin[0].addr,
          value: Number(value),
          fiatValue: parseFloat((value * params.price).toFixed(2)),
          date: moment(tx.time * 1000).format("DD/MM/YYYY"),
          time: moment(tx.time * 1000).format('HH:mm'),
          confirmations: tx.confirmations
        })
      })
      cb({
        price: currencyFormatter.format(params.price, { code: params.unit }),
        balance: parseFloat(balance).toFixed(8),
        rawFiat: Number(balance * params.price),
        fiatBalance: currencyFormatter.format(balance * params.price, { code: params.unit }),
        transactions: formatedTransactions,
        status: 1,
        heightList: heightList
      })
    })
    }
  })
} catch (err) {
  throw new Error('Error with zel, request will timeout', err)
}
}

function getDash(params, cb){
  let heightList = new Array
  try {
  request(`https://explorer.dash.zelcore.io/api/addr/${params.address}/utxo`, { json: true }, (err, res, utxos) => {
    if (typeof utxos !== 'object'){
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
      let balance = 0
      for (var i = 0; i < utxos.length; i++){
        balance = balance + utxos[i].amount
      }
      request(`https://explorer.dash.zelcore.io/api/txs/?address=${params.address}`, { json: true }, (err, res, transactions) => {
      let formatedTransactions = new Array
      transactions.txs.forEach(tx => {
        let value = getTxValue(tx.vout, params.address, tx.vin[0].addr == params.address ? 'SENT' : 'RECEIVED')
        heightList.push(65)
        formatedTransactions.push({
          txid: tx.txid,
          direction: tx.vin[0].addr == params.address ? 'SENT' : 'RECEIVED',
          to_from: tx.vin[0].addr == params.address ? tx.vout[0].scriptPubKey.addresses[0] : tx.vin[0].addr,
          value: Number(value),
          fiatValue: parseFloat((value * params.price).toFixed(2)),
          date: moment(tx.time * 1000).format("DD/MM/YYYY"),
          time: moment(tx.time * 1000).format('HH:mm'),
          confirmations: tx.confirmations
        })
      })
      cb({
        price: currencyFormatter.format(params.price, { code: params.unit }),
        balance: parseFloat(balance).toFixed(4),
        rawFiat: Number(balance * params.price),
        fiatBalance: currencyFormatter.format(balance * params.price, { code: params.unit }),
        transactions: formatedTransactions,
        status: 1,
        heightList: heightList
      })
    })
    }
  })
} catch (err) {
  throw new Error('Error with dash, request will timeout ', err)
}
}

app.get("/plusbit/:fiatUnit/:bitcoin/:ilcoin/:zel/:dash", (req, res, next) => {
  var response = res
  request(`https://api.coingecko.com/api/v3/simple/price?ids=ilcoin,bitcoin,zelcash,dash&vs_currencies=try,usd,eur,chf,cad,aud,gbp,jpy,nzd,cny,zar,thb,php,krw,vnd,myr,rub,inr,sgd,hkd,ars,brl,dkk,idr,kwd,mxn,nok,pln,pkr,sar,sek,uah`, { json: true }, (err, res, body) => {
    let fiatUnit = req.params.fiatUnit.toLowerCase()

    getBitcoin({address: req.params.bitcoin, price: body.bitcoin[fiatUnit], unit: req.params.fiatUnit}, function(bitcoin_balances){
      getIlcoin({address: req.params.ilcoin, price: body.ilcoin[fiatUnit], unit: req.params.fiatUnit}, function(ilcoin_balances){
        getZel({address: req.params.zel, price: body.zelcash[fiatUnit], unit: req.params.fiatUnit}, function(zel_balances){
          getDash({address: req.params.dash, price: body.dash[fiatUnit], unit: req.params.fiatUnit}, function(dash_balances){
            response.json({
              totalBalance: currencyFormatter.format(bitcoin_balances.rawFiat + ilcoin_balances.rawFiat + zel_balances.rawFiat + dash_balances.rawFiat, { code: req.params.fiatUnit }),
              BTC: bitcoin_balances,
              ILC: ilcoin_balances,
              ZEL: zel_balances,
              DASH: dash_balances
            })
          })
        })
      })
    })

  })
});