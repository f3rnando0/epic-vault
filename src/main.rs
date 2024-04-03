use dotenv::dotenv;
use serenity::model::channel::Message;
use serenity::{
    all::{Context, EventHandler, GatewayIntents},
    async_trait, Client,
};

struct Handler;

#[async_trait]
impl EventHandler for Handler {
    async fn message(&self, ctx: Context, msg: Message) {
        let guild_id: String = std::env::var("DISCORD_GUILD_ID").expect("Guild ID must be set.");
        let id = msg.channel_id.to_string();

        if guild_id.eq(&id) {
            println!("{msg:?}");
        }
    }
}

#[tokio::main]
async fn main() {
    dotenv().ok();

    let token: String = std::env::var("TOKEN").expect("TOKEN must be set.");

    let intents = GatewayIntents::GUILD_MESSAGES | GatewayIntents::MESSAGE_CONTENT;

    let mut client = Client::builder(&token, intents)
        .event_handler(Handler)
        .await
        .expect("Error while creating client.");

    if let Err(why) = client.start().await {
        println!("Client error: {why:?}");
    }
}
