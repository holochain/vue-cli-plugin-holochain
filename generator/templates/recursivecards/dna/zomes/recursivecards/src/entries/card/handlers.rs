use crate::{
    error::RecursivecardsResult,
    card::{Card, CardEntry}
};
use hdk3::prelude::*;

use super::{CardListInput, CardList};

pub(crate) fn create_card(card_entry: CardEntry) -> RecursivecardsResult<Card> {
    let CardEntry { parent, uuid, .. } = card_entry.clone();
    let path: Path = Path::from(format!("{}.{}", parent, uuid));
    path.ensure()?;
    create_entry(&card_entry)?;
    let entry_hash = hash_entry(&card_entry)?;
    let _card_link: HeaderHash = create_link(path.hash()?, entry_hash.clone(), ())?;
    Card::new(card_entry, entry_hash)
}

pub(crate) fn delete_card(card: Card) -> RecursivecardsResult<()> {
    if let Some(Details::Entry(metadata::EntryDetails{headers,..})) = get_details(card.entry_hash, GetOptions)?{
      if let Some(header) = headers.first(){
        delete_entry(header.header_address().clone())?;
      }
    }
    Ok(())
}

pub(crate) fn list_cards(input: CardListInput) -> RecursivecardsResult<CardList> {
    let parent_path = Path::from(input.parent);
    let card_path_links = parent_path.children()?.into_inner();
    let mut cards = Vec::with_capacity(card_path_links.len());
    for card_uuid in card_path_links.into_iter().map(|link| link.target) {
    let mut links = get_links(card_uuid, None)?.into_inner();
    links.sort_by_key(|l|l.timestamp);
    if let Some(card_link_last) = links.last() {
         if let Some(element) = get(card_link_last.target.clone(), GetOptions)? {
                if let Some(card) = element.into_inner().1.to_app_option::<CardEntry>()? {
                    cards.push(Card::new(card.clone(), hash_entry(&card)?)?);
                }
            }
        }
    }
    Ok(cards.into())
}
