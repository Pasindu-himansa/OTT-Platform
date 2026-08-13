db = db.getSiblingDB("ott_db");

db.createCollection("videos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "type", "status"],
      properties: {
        title: { bsonType: "string" },
        type: { enum: ["movie", "series", "episode", "live"] },
        status: { enum: ["draft", "published", "archived"] },
      },
    },
  },
});

db.createCollection("watch_history");
db.createCollection("analytics");

db.videos.createIndex({ title: "text", description: "text" });
db.videos.createIndex({ type: 1, status: 1 });
db.videos.createIndex({ categories: 1 });
db.videos.createIndex({ createdAt: -1 });

db.watch_history.createIndex({ userId: 1, videoId: 1 }, { unique: true });
db.watch_history.createIndex({ userId: 1, updatedAt: -1 });

db.analytics.createIndex({ event: 1, createdAt: -1 });
db.analytics.createIndex({ userId: 1 });

print("✅ MongoDB collections and indexes created");
