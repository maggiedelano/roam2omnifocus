function queryAND(tag1Blocks,tag2Blocks){

	let intersection = tag1Blocks.filter(x => tag2Blocks.includes(x));

	return intersection;
}

function queryNOT(tag,blocks){
	let not = `[:find ?blockIDs
				:in $ ?pageName [?blockIDs ...]
				:where [?tagID :node/title ?pageName] 
					(not (?blockIDs :block/refs ?tagID)) ]`;

	let notQ = window.roamAlphaAPI.q(not,tag,blocks);

	return notQ.map((data, index) => {return data[0];});
}

function getAllParentsAndChildrenForTag(tag){

	pageBlocks = findAllBlocksOnPage(tag);
	referenceBlocks = findReferenceParentAndChildren(tag);

	allBlocks = pageBlocks.concat(referenceBlocks);

	return allBlocks;
	
}

function getBlockStringsFromIDs(blockIDs){
	let getBlockStrings = `[:find ?blockStrings
				  :in $  [?blockIDs ...]
				  :where [?blockIDs :block/string ?blockStrings]]`;

	blockStrings = window.roamAlphaAPI.q(getBlockStrings,blockIDs);

	return blockStrings.map((data,index) => {return cleanUpBlockString(data[0])}).join('\n');
}

function findAllBlocksOnPage(tag){
	let ancestor = `[ 
  [(ancestor ?child ?parent)
   [?parent :block/children ?child]]
  [(ancestor ?child ?ancestor)
   [?parent :block/children ?child]
   (ancestor ?parent ?ancestor)]
	]`;

	let blocksQ = window.roamAlphaAPI.q(`[:find ?blockIDs
  										 :in $ ?pagetitle % 
  										 :where [?page :node/title ?pagetitle] 
      											(ancestor ?blockIDs ?page)
  												]`, tag, ancestor);

	blocks = blocksQ.map((data, index) => {return data[0];});

	return blocks;

}

function findReferenceParentAndChildren(tag){
	let ancestor = `[ 
  [(ancestor ?child ?parent)
   [?parent :block/children ?child]]
  [(ancestor ?child ?ancestor)
   [?parent :block/children ?child]
   (ancestor ?parent ?ancestor)]
	]`;

	let findParents = `[:find ?blockIDs
			  :in $ ?pageName
			  :where [?pageID :node/title ?pageName]
					 [?blockIDs :block/refs ?pageID]
					 [?blockIDs :block/string ?blockStrings]]`;

	let parentsQ = window.roamAlphaAPI.q(findParents,tag);

	parents = parentsQ.map((data, index) => {return data[0];});

	let findChildren = `[:find ?childIDs ?childStrings
 			  			 :in $ % [?blockIDs ...] 
			  			 :where [?childIDs :block/string ?childStrings]
					 	 (ancestor ?childIDs ?blockIDs)]`;

	let childrenQ = window.roamAlphaAPI.q(findChildren,ancestor,parents);

	children = childrenQ.map((data, index) => {return data[0];});

	return parents.concat(children);
}

function writeResultsToClipboard (results){
	navigator.clipboard.writeText(results);
}

function cleanUpBlockString (blockString){
	blockString = blockString.replace('{{[[TODO]]}} ','');
	return blockString;
}

tag1Blocks = getAllParentsAndChildrenForTag('next action');
tag2Blocks = getAllParentsAndChildrenForTag('Project/Current Source Testing');
tag3Blocks = getAllParentsAndChildrenForTag('TODO');

writeResultsToClipboard(getBlockStringsFromIDs(queryNOT('query',queryAND(tag1Blocks, queryAND(tag2Blocks,tag3Blocks)))))
window.open('omnifocus:///inbox');