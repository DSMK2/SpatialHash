/*
* Author : Aric Ng
* Website: http://www.aricng.com
* GitHub: https://github.com/DSMK2
* MIT license: http://opensource.org/licenses/MIT
* 
* VERSION: 1.0.1
* - Updated to use Maps instead of Objects after noting performance gains
*/

function SpatialHash(cWidth, cHeight) {
	this.buckets = new Map();
	
	// Cell size
	this.cWidth = cWidth;
	this.cHeight = cHeight;

	// Grid size
	this.gWidth = 0;
	this.gHeight = 0;
}

SpatialHash.numItems = 0;

SpatialHash.prototype = {
	clear: function() {
		// Let garbage collection do the work
		this.buckets.clear();
		SpatialHash.numItems = 0;
	},
	/**
	* Inserts item into the hash map
	*/
	insert: function(x, y, width, height, item) {
		var boundsX = {};
		var boundsY = {};
		var position = '';
		var positions = [];
		var i = 0;
		var d = 0;
		var itemNode = {};
		var bucket;
			
		// Must have a position
		if(typeof x !== 'number' || typeof y !== 'number')
			return false;
		
		// Size is optional
		width = typeof width !== 'number' ? 0 : width;
		height = typeof height !== 'number' ? 0 : height;
		
		// Generate 
		itemNode = {item: item, id: SpatialHash.numItems};	
			
		// Find positions (bounds) based on bounds
		boundsX.high = Math.floor((x + width) / this.cWidth);
		boundsX.low = Math.floor((x - width) / this.cWidth);

		boundsY.high = Math.floor((y + height) / this.cHeight);
		boundsY.low = Math.floor((y - height) / this.cHeight);
		
		// Iterate over bounds for each position to handle large objects
		// Assign items to 'buckets'
		for(x = boundsX.low; x <= boundsX.high; x++) {
			for(y = boundsY.low; y <= boundsY.high; y++) {
				position = x + '_' + y;				
			
				// Undefined positions are defined as objects, new "buckets"
				if(!this.buckets.has(position))
					this.buckets.set(position, new Map());
				
				bucket = this.buckets.get(position)
				
				// Push item in if slot with ID doesn't exist
				if(!bucket.has(SpatialHash.numItems))
					bucket.set(SpatialHash.numItems, itemNode);
			}
		}
		
		SpatialHash.numItems++;
				
		return true;
	},
	/**
	* @function spatialHash.retrieve 
	* @description Retrieves items found within given arguments
	* @param {number} x X coordinate of area to check
	* @param {number} y Y coordinate of area to check
	* @param {number} width Width of area to check, checks half of width from x
	* @param {number} height Height of area to check, checks half of height from x
	* @returns {array} An array representing items found
	*/
	retrieve: function(x, y, width, height) {
		var boundsX = {};
		var boundsY = {};
		var item;
		var results = [];
		var bucket;
		var i = 0;
		var d = 0;
		var found = false;
		var itemID;
		var itemChecklist = new Map();
		var position;

		// Must have a position
		if(typeof x !== 'number' && typeof y !== 'number')
			return;
		
		width = typeof width !== 'number' ? 0 : width;
		height = typeof height !== 'number' ? 0 : height;
		
		// Get cell position based on position and bounds
		boundsX.high = Math.floor((x + width/2) / this.cWidth);
		boundsX.low = Math.floor((x - width/2) / this.cWidth);

		boundsY.high = Math.floor((y + height/2) / this.cHeight);
		boundsY.low = Math.floor((y - height/2) / this.cHeight);
		
		// Look for buckets with positions found within bounds
		for(x = boundsX.low; x <= boundsX.high; x++) {
			for(y = boundsY.low; y <= boundsY.high; y++) {
				position = x + '_' + y
				
				// Push items in bucket to results, while skipping over dupes
				if(this.buckets.has(position)) {
					
					bucket = this.buckets.get(position);
					
					// Push all items in position into results
					for(itemID of bucket.keys()) {
							
						item = bucket.get(itemID);
						
						// Add item id to checklist and results if it doesn't exist
						if(!itemChecklist.has(itemID)) {
							itemChecklist.set(item.id, true);
							results.push(item.item);
						}
						
					}
				}	
			}
		}

		return results;
	}
};