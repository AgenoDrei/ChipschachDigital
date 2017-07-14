```shell
db.lvls.find().toArray().forEach(function(doc){doc.description={"de":doc.description,"en":""};db.lvls.update({_id:doc._id},doc)})
```