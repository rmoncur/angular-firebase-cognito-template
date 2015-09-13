// JavaScript Document
function callDynamo(){
	
	var ddb = new AWS.DynamoDB();
                 
	// Scan the table
	ddb.scan({TableName: "recipes"}, function (err, data) {
		if (err){   // an error occurred
			console.log(err);   
		}else{      // successful response
			 
			// Print the items
			var items = '';
			for (i = 0; i < data.Count; i++) {
				items += data.Items[i].Id.N + ' ';
			}    
			console.log('Dynamo DB items found: '  + items);                
		}
	});
		
}

function startCognito(){
	
	
	
	
	
	console.log("Starting Cognito Sync");
	//callDynamo();
	
	return;
	
	//Creating the sync client object
	var syncClient = new AWS.CognitoSyncManager();

	//Grabbing the dataset
	syncClient.openOrCreateDataset('recipes', function(err, dataset) {
	   
		//Getting all the records
		var records = dataset.getAllRecords(function(err,values){
			console.log("a",err,"b",values);
		});
	   
		//Reading a value from the record
		var scar = dataset.get('marco',function(a,b){});
		dataset.get('marco', function(err, value) {
		  console.log('myRecord: ' + value);
		});
		
		dataset.put('marco', 'polo', function(err, record){

		 dataset.synchronize({

			onSuccess: function(data, newRecords) {
				// Your handler code here
				console.log(data,newRecords);
			}

		 });
		 

	  });
	 
   });

}