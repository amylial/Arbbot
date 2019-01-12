// Setting up exchanges and coins trading

const bfxTrade = require('./markets/BfxTrade')
const poloTrade = require('./markets/PoloTrade')

const bfxPairs = ['ETHBTC', 'XRPBTC', 'LTCBTC'] //coin pairs list
const poloPairs = ['BTC_ETH', 'BTC_XRP', 'BTC_LTC']

const exchanges = [bfxTrade, poloTrade]
const exchanges_names = ["Bitfinex", "Poloniex"]

exchanges[0].initPairs(bfxPairs)
exchanges[1].initPairs(poloPairs)


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
	console.log("Retrieving data")
	setInterval(function(){
		compare(self)
		//console.log("1")
	}, 50)
}, 50)

// =====================================================================================
// Transaction and time log

TransactionLog = {
	pairs:[],
	log:{},

	initiateLog:function(pairsArray){
		this.pairs = pairsArray;
		for(pair in pairsArray) {
			this.log[pair]={

			}
		}
	}
}


// ======================================================================================
function compare(self){
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
				
				//console.log(max, min)
				//console.log(bids)
				//console.log(asks)

				//console.log("Bitfinex", exchanges[0].orderbook)
				//console.log("Poloniex", exchanges[1].orderbook)

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
						var amountTrade = Math.min(amountSell,amountBuy)
						var profit = amountTrade * (max - min)

						//console.log(exchanges[0].orderbook)
						//console.log(exchanges[1].orderbook)
						//console.log(amountSell, amountBuy, amountTrade)

						console.log(bfxKey, 'sell on', exchanges_names[bidIndex], 'price', max, 'buy on', exchanges_names[askIndex], 'price', min)
						console.log('Profit', profit)
					}
				}
			}
		}
	}
}



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