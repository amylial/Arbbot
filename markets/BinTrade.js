const binance = require('node-binance-api')().options({
  APIKEY: '<key>',
  APISECRET: '<secret>',
  useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
  test: false // If you want to use sandbox mode where orders are simulated
});

BinTrade = {
	// pairs keep the code: "ETHBTC", "RXPBTC", ...
	pairs:[],      // [] is an array 

	// orderboook keep the information associated with the pairs
	orderbook:{},  // {} is an unindentified object


	initPairs:function(pairsArray){
		this.pairs = pairsArray;
		for(pair of pairsArray) {
			this.orderbook[pair]={
				'bids':{
					'price': 0,
					'amount': 0
				},
				'asks':{
					'price': 0,
					'amount': 0
				}

			}
		}
	},

	// getOrders basically update the orderbook info
	// for some reasons the first few lines updated is an array within an array and that messes up the code
	//     hence if(book.length == 3)
	getOrders:function(){
		var self = this
		for (pair of this.pairs){
			binance.bookTickers(pair, (error, ticker) => {
				if(typeof ticker == 'object'){
					//console.log('object')
					var cur = ticker['symbol']
				  	self.orderbook[cur]['bids']['price'] = parseFloat(ticker['bidPrice'])
				  	self.orderbook[cur]['bids']['amount'] = parseFloat(ticker['bidQty'])
				  	self.orderbook[cur]['asks']['price'] = parseFloat(ticker['askPrice'])
				  	self.orderbook[cur]['asks']['amount'] = parseFloat(ticker['askQty'])
				  
				} else {
					//console.log('not object')
				}
			  	//console.log("pre", self.orderbook)
			})
		}
		//console.log(self.orderbook)
	}
}

module.exports = BinTrade
