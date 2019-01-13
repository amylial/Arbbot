// Setting up exchanges and coins trading

const bfxTrade = require('./markets/BfxTrade')
const poloTrade = require('./markets/PoloTrade')
const binTrade = require('./markets/BinTrade')

const bfxPairs = ['ETHBTC', 'XRPBTC', 'LTCBTC', 'BSVBTC', 'ZECBTC'] //coin pairs list
const poloPairs = ['BTC_ETH', 'BTC_XRP', 'BTC_LTC', 'BTC_BCHSV', 'BTC_ZEC']
const binPairs = ['ETHBTC', 'XRPBTC', 'LTCBTC', 'BCHSVBTC', 'ZECBTC']

const pairlist = [bfxPairs, poloPairs, binPairs]

const exchanges = [bfxTrade, poloTrade, binTrade]
const exchanges_names = ["Bitfinex", "Poloniex", "Binance"]

exchanges[0].initPairs(bfxPairs)
exchanges[1].initPairs(poloPairs)
exchanges[2].initPairs(binPairs)


// Setting intial balance in all markets: 

// 
const prices = [3500, 120, 0.3, 30, 80, 50]
const names = ['BTC', 'ETH', 'XRP', 'LTC', 'BSV', 'ZEC']
const index1 = [0, 1, 2, 3, 4, 5]

var balance = {
	'Bitfinex':{
		'BTC': 0,
		'ETH': 0,
		'XRP': 0,
		'LTC': 0,
		'BSV': 0,
		'ZEC': 0
	},
	'Poloniex':{
		'BTC': 0,
		'ETH': 0,
		'XRP': 0,
		'LTC': 0,
		'BSV': 0,
		'ZEC': 0
	},
	'Binance':{
		'BTC': 0,
		'ETH': 0,
		'XRP': 0,
		'LTC': 0,
		'BSV': 0,
		'ZEC': 0
	},

	setStartingBalance:function(usd){
		var self = this
		for (i of index1) {
			for (exchange_balance in balance) {
				balance[exchange_balance][names[i]] = usd / prices[i]
			}
		}
	},

	updateBalance:function(mode, exchange, currency, price, amount) {
	// mode is either "add" or "minus"
	// exchange = 'Bitfinex', 'Poloniex' or 'Binance'
		var self = this
		if (mode == 'add') {// if add then 
			self[exchange][currency] += price * amount
		} else { //
			self[exchange][currency] -= price * amount
		}
	},

	usdBalance:function(){
		var self = this
		var usdBalance = 0
		for(i of index1){
			for (exchange_balance in balance){
				usdBalance += prices[i] * balance[exchange_balance][names[i]]
			}
		}
		return usdBalance
	}
}


// =======================================================================

// Note that "for of" loop is iterating over values in an array, while "for in"
//     is going over attributes of an object

for (exchange of exchanges) {
	exchange.getOrders()
}

// Giving access of the object to self
var self = this

// setTimeout() delay the process, acting only once
// setInterval() repeat the process
setTimeout(function(){
	console.log("Retrieving data...")
	balance.setStartingBalance(1000)
	setInterval(function(){
		//compare(self)
		compare1(self)
		binTrade.getOrders()
	}, 200)
}, 1000)

// =====================================================================================
// Transaction and time log

/*var paste = {
	'amountTrade': 0,
 	'otherCoin': '',
 	'sellExchange': '',
 	'max': 0,
 	'buyExchange': '',
 	'min': 0,
 	'profit': 0
}*/

TransactionLog = [0]





// ======================================================================================

var index = [0,1,2,3,4]
var bids = []
var asks = []

var max = 0
var min = 0


function compare1(self){
	console.log(balance.usdBalance())
	console.log(TransactionLog)
	//console.log("compare1")
	//test: get price of the first thing only. index = 0
	for(i of index){
		for(exchange of exchanges) {
			//console.log(exchange)
			//console.log(exchange.orderbook)
			//console.log(exchange.pairs)

			var current_key = exchange.pairs[i]

			//console.log(current_key)

			bids.push(exchange.orderbook[current_key]['bids']['price'])
			asks.push(exchange.orderbook[current_key]['asks']['price'])

			max = Math.max.apply(Math, bids) //highest bids on the two exchanges
			min = Math.min.apply(Math, asks) //lowest asks on the two exchanges
			
			if(max > 0 && min > 0 && max > min){
				// Note that bitIndex and askIndex are exchanges index
				var bidIndex = bids.indexOf(max) // index of highest bid => sell to this 
				var askIndex = asks.indexOf(min) // index of lowest ask => buy this
				
				if(bidIndex != askIndex){ // not on the same exchange
					var sellKey = exchanges[bidIndex].pairs[i]
					var buyKey = exchanges[askIndex].pairs[i]

					var amountSell = exchanges[bidIndex].orderbook[sellKey]['bids']['amount']
					var amountBuy = exchanges[askIndex].orderbook[buyKey]['asks']['amount'] //min ?
					var amountTrade = Math.min(amountSell, amountBuy)
					var profit = amountTrade * (max - min)

					if (amountTrade > 0) {
						/*console.log(exchanges[0].orderbook)
						console.log(exchanges[1].orderbook)
						console.log(exchanges[2].orderbook)
						console.log(amountSell, amountBuy, amountTrade)
						console.log(sellKey, 'sell on', exchanges_names[bidIndex], 'price', max, 'buy on', exchanges_names[askIndex], 'price', min)
						console.log('Profit', profit)*/
						//var pasteString = ''
						//pasteString = sellKey + ' sell on ' + exchanges_names[bidIndex] + ' price ' + max.toString() +  ' /n. Buy on ' + exchanges_names[askIndex], ' price ' + min.toString() + './n Profit is ' +  profit.toString() + ' BTC or ' + (profit * 3500).toString() + ' USD.' 
						


						// updating balance for sell: add Bitcoin, minus coin on that exchange, price max
						// 					for buy: add coin. minus Bitcoin on that exchange, price min
						var sellExchange = exchanges_names[bidIndex]
						var buyExchange = exchanges_names[askIndex]
						var otherCoin = names[i + 1]
						var len = TransactionLog.length
						if (len < 7 && !TransactionLog.includes(amountTrade, 0)){
							TransactionLog.push(amountTrade)
							console.log(amountTrade)
							console.log(sellKey, 'sell on', exchanges_names[bidIndex], 'price', max, 'buy on', exchanges_names[askIndex], 'price', min)

							balance.updateBalance('add', sellExchange, 'BTC', max, amountTrade)
							balance.updateBalance('minus', sellExchange, otherCoin, max, amountTrade)

							balance.updateBalance('add', buyExchange, otherCoin, min, amountTrade)
							balance.updateBalance('minus', buyExchange, 'BTC', min, amountTrade)
	
						}
						if (!TransactionLog.includes(amountTrade, -6)){
							TransactionLog.push(amountTrade)
							console.log(amountTrade)
							console.log(sellKey, 'sell on', exchanges_names[bidIndex], 'price', max, 'buy on', exchanges_names[askIndex], 'price', min)

							balance.updateBalance('add', sellExchange, 'BTC', max, amountTrade)
							balance.updateBalance('minus', sellExchange, otherCoin, max, amountTrade)

							balance.updateBalance('add', buyExchange, otherCoin, min, amountTrade)
							balance.updateBalance('minus', buyExchange, 'BTC', min, amountTrade)

						}
						
					}
				}
			}
		}
		bids.length = 0
		asks.length = 0
	}
}

/*
function compare(self){
	console.log("compare")
	for(bfxKey in exchanges[0].orderbook){
		var bids = []
		var asks = []

		var max = 0
		var min = 0

		for(poloKey in exchanges[1].orderbook){
			if(matchKeys(bfxKey, poloKey)){
				bids.push(exchanges[0].orderbook[bfxKey]['bids']['price'])
				bids.push(exchanges[1].orderbook[poloKey]['bids']['price'])
				asks.push(exchanges[0].orderbook[bfxKey]['asks']['price'])
				asks.push(exchanges[1].orderbook[poloKey]['asks']['price'])

				max = Math.max.apply(Math, bids) //highest bids on the two exchanges
				min = Math.min.apply(Math, asks) //lowest asks on the two exchanges

				// can only arbitrage when max > min anyway
				if(max > 0 && min > 0 && max > min){
					var bidIndex = bids.indexOf(max) // index of highest bid => sell to this
					var askIndex = asks.indexOf(min) // index of lowest ask => buy this

					if(bidIndex != askIndex){ // not on the same exchange
						if (bidIndex == 0){
							var sellthis = bfxKey
							var buythis = poloKey
						} else{
							var sellthis = poloKey
							var buythis = bfxKey
						}

						var amountSell = exchanges[bidIndex].orderbook[sellthis]['bids']['amount']
						var amountBuy = exchanges[askIndex].orderbook[buythis]['asks']['amount'] //min ?
						var amountTrade = Math.min(amountSell, amountBuy)
						var profit = amountTrade * (max - min)

						console.log(exchanges[0].orderbook)
						console.log(exchanges[1].orderbook)
						console.log(amountSell, amountBuy, amountTrade)
						console.log(bfxKey, 'sell on', exchanges_names[bidIndex], 'price', max, 'buy on', exchanges_names[askIndex], 'price', min)
						console.log('Profit', profit)
					}
				}

			}
		}
	}
}
*/


function matchKeys(key1, key2) {
	// good practice to keep the variable within the scope of the function
	// the variable is still allocated only once, so not much performance issue comparing to defining it before the loop
	var curr = key2.split('_')[1]
	if(key1.includes(curr)){
		return true
	} else{
		return false
	}
}