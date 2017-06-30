exports.definition = {
	config: {
		columns: {
			"id" : "INTEGER PRIMARY KEY AUTOINCREMENT",
		    "steps_date": 	 "TEXT",		//yyyy-mm-dd
		    "steps_total": 	 "INTEGER",
		    "steps_walked":  "INTEGER",
		    "activity_part": "INTEGER",
		    "moderate":      "INTEGER",
		    "vigorous":      "INTEGER",
		    "last_synced_on": "INTEGER", //timestamp (ticks)
		    "last_updated_on": "INTEGER" //timestamp (ticks)	 
		},
		adapter: {
			type: "sql",
			collection_name: "log",
			idAttribute: "id"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
			validate: function(attrs) {
				
			}
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			//https://gist.github.com/aaronksaunders/5066608
			deleteAll : function() {
				var collection = this;
				
				var sql = "DELETE FROM " + collection.config.adapter.collection_name;
				db = Ti.Database.open(collection.config.adapter.db_name);
				db.execute(sql);
				db.close();
				
				collection.trigger('sync');
			},
		});

		return Collection;
	}
};