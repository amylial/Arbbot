// Setting up connection from Poloniex
// code from https://www.npmjs.com/package/poloniex-orderbook

const PoloManager = require('poloniex-orderbook');
const poloman = new PoloManager().connect({ 
  headers: '' //require('./headers.json') 
});
 
poloman.on('error', err => console.log(err));
 
 // ==============================================================================
 // Initializing object PoloTrade

PoloTrade = {
	// pretty similar set up to BfxTrade
	pairs:[],
	orderbook:{},

	// same initPairs function as BfxTrade
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
			poloman.market(pair);
		}
		
	},

	// getOrders is a little bit different
	getOrders:function(){
		var self = this
		poloman.on('change', info => {
			if (parseFloat(info['amount']) != 0) {
				self.orderbook[info['channel']][info['side']]['price'] = parseFloat(info['rate'])
				self.orderbook[info['channel']][info['side']]['amount'] = parseFloat(info['amount'])
			}
		})
	},
}

module.exports = PoloTrade 

/*poloman.on('change', info => {
  const {channel, side} = info;
  const market = poloman.market(channel);
  const top5 = market[side].slice(0, 5);
 
  console.log(`${side.toUpperCase()} :: ${market.seq}`);
  console.log(top5);
});
 
poloman.market('BTC_ETC');*/
 
// =================================================================




/*
// try new 
const Poloniex = require('poloniex-api-node');
let poloniex = new Poloniex()
poloniex.on('open', () => {
	console.log('WebSocket connect opened')
})


PoloTrade = {
	pairs:[],
	orderbook:{},

	// same initPairs function as BfxTrade
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

	getOrders:function(){
		var self = this
		for (pair of this.pairs) {
			console.log(1)
			poloniex.subscribe("BTC_ETH")

			poloniex.on('message', (channelName, data) => {
				if (channelName == "BTC_ETH") {
					if (data[0]['type'] != 'orderBook') {
						for (part of data) {
							if (part['type'] == 'orderBookModify'){
								if (part['data']['type'] == "bid") {
									this.orderbook[pair]['bids']['price'] = part['data']['rate']
									this.orderbook[pair]['bids']['amount'] = part['data']['amount']
								} else{
									this.orderbook[pair]['asks']['price'] = part['data']['rate']
									this.orderbook[pair]['asks']['amount'] = part['data']['amount']
								}
								console.log(data)
							}
						}
					}
				}
			})
		}
	}
}

poloniex.openWebSocket() */



