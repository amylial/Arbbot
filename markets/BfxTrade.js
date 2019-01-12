// from Bitfinex API GitHub
// https://github.com/bitfinexcom/bitfinex-api-node

const BFX = require('bitfinex-api-node')

const bfx = new BFX({
  /*apiKey: '...',
  apiSecret: '...',*/

  ws: {
    autoReconnect: true,
    seqAudit: true,
    packetWDDelay: 10 * 1000
  }
})

// =====================================================================

const ws = bfx.ws()

ws.on('error', console.error)

// ====================================================================
// Intializing object BfxTrade
// Note that objects in JavaScript has "," to seperate them
// Accessing object characteristics can be done in two ways:
// objectName.propertyName or objectName["propertyName"]

BfxTrade = {
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

		ws.on('open', ()=>{ // shortcut for function()
			for(pair of pairsArray){
				ws.subscribeOrderBook(pair, 'P0', '1')
			}
		})
		ws.open()
	},


	// getOrders basically update the orderbook info
	// for some reasons the first few lines updated is an array within an array and that messes up the code
	//     hence if(book.length == 3)
	getOrders:function(){
		var self = this
		ws.on('orderbook', (pair, book)=>{

			if(book.length == 3){ 
				if(book[2] > 0) {
					self.orderbook[pair.substring(1)]['bids']['price'] = book[0]
					self.orderbook[pair.substring(1)]['bids']['amount'] = book[2]
				} else {
					self.orderbook[pair.substring(1)]['asks']['price'] = book[0]
					self.orderbook[pair.substring(1)]['asks']['amount'] = book[2]* -1
				}
			} else {
				if(book[0][2] > 0) {
					self.orderbook[pair.substring(1)]['bids']['price'] = book[0][0]
					self.orderbook[pair.substring(1)]['bids']['amount'] = book[0][2]
				} else {
					self.orderbook[pair.substring(1)]['asks']['price'] = book[0][0]
					self.orderbook[pair.substring(1)]['asks']['amount'] = book[0][2]* -1
				}
			}

		})
	}

}

// ============================================================================
// Export so other files can use it

module.exports = BfxTrade