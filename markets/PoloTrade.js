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
			self.orderbook[info['channel']][info['side']]['price'] = parseFloat(info['rate'])
			self.orderbook[info['channel']][info['side']]['amount'] = parseFloat(info['amount'])			
		})
	},
}

/*poloman.on('change', info => {
  const {channel, side} = info;
  const market = poloman.market(channel);
  const top5 = market[side].slice(0, 5);
 
  console.log(`${side.toUpperCase()} :: ${market.seq}`);
  console.log(top5);
});
 
poloman.market('BTC_ETC'); */
 
// =================================================================

module.exports = PoloTrade