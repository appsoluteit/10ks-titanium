exports.definition = {
	config: {
		columns: {
			"id" : "INTEGER PRIMARY KEY",
		    "steps_date": 	 "TEXT",		//no native datetime support in sqlite. Store as text and parse. yyyy-mm-dd
		    "steps_total": 	 "INTEGER",
		    "steps_walked":  "INTEGER",
		    "activity_part": "INTEGER",
		    "moderate":      "INTEGER",
		    "vigorous":      "INTEGER",
		    "last_synced_on": "TEXT",
		    "last_updated_on": "TEXT"
		},
		adapter: {
			type: "sql",
			collection_name: "log"
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