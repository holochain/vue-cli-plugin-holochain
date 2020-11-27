use entries::card;
use error::RecursivecardsResult;
use hdk3::prelude::Path;
use hdk3::prelude::*;
use card::{CardEntry, Card, CardListInput, CardList};

mod entries;
mod error;

entry_defs![Path::entry_def(), CardEntry::entry_def()];

#[hdk_extern]
fn create_card(card_entry: CardEntry) -> RecursivecardsResult<Card> {
    card::handlers::create_card(card_entry)
}

#[hdk_extern]
fn delete_card(card: Card) -> RecursivecardsResult<()> {
    card::handlers::delete_card(card)
}

#[hdk_extern]
fn list_cards(parent: CardListInput) -> RecursivecardsResult<CardList> {
    card::handlers::list_cards(parent)
}
