use hdk3::prelude::*;
use crate::{
    error::RecursivecardsResult
};
pub mod handlers;

/// The actual card data that is saved into the DHT
/// This is the data that can change.
#[hdk_entry(id = "card_entry")]
#[derive(Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CardEntry {
    uuid: String,
    name: String,
    parent_column: String,
    preview: String,
    card_type: String,
    order: u32,
    parent: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, SerializedBytes)]
#[serde(rename_all = "camelCase")]
pub struct Card {
    uuid: String,
    name: String,
    parent_column: String,
    preview: String,
    card_type: String,
    order: u32,
    parent: String,
    entry_hash: EntryHash,
}

/// Input to the list cards call
#[derive(Serialize, Deserialize, SerializedBytes)]
pub struct CardListInput {
    parent: String,
}

/// The cards returned from list cards
#[derive(Serialize, Deserialize, SerializedBytes, derive_more::From)]
pub struct CardList {
    cards: Vec<Card>,
}

impl Card {
    pub fn new(entry: CardEntry, entry_hash: EntryHash) -> RecursivecardsResult<Card> {
        Ok(Card{
            uuid: entry.uuid,
            name: entry.name,
            parent_column: entry.parent_column,
            preview: entry.preview,
            card_type: entry.card_type,
            order: entry.order,
            parent: entry.parent,
            entry_hash,
        })
    }
}
