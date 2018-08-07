// day 1 homework
conn = new Mongo();
db = conn.getDB("blogger");

cursor = db.articles.find({_id: ObjectId('5b69ea98418d255bdde3a4ed')});
while ( cursor.hasNext() ) {
    printjson( cursor.next() );
}
