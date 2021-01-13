use hdk3::prelude::*;
use crate::{
    error::LedgerResult
};
pub mod handlers;

/// The actual invoice data that is saved into the DHT
/// This is the data that can change.
#[hdk_entry(id = "invoice_entry")]
#[derive(Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ClientEntry {
    uuid: String,
    name: String,
    country: String,
    billing_contact: String,
    billing_address: String,
    path: String,
}

/// A channel is consists of the category it belongs to
/// and a unique id
#[derive(Debug, Clone, Serialize, Deserialize, SerializedBytes)]
#[serde(rename_all = "camelCase")]
pub struct Client {
    uuid: String,
    name: String,
    country: String,
    billing_contact: String,
    billing_address: String,
    path: String,
    entry_hash: EntryHash,
}

/// Input to the list invoices call
#[derive(Serialize, Deserialize, SerializedBytes)]
pub struct ClientListInput {
    path: String,
}

/// The invoices returned from list invoices
#[derive(Serialize, Deserialize, SerializedBytes, derive_more::From)]
pub struct ClientList {
    clients: Vec<Client>,
}

impl Client {
    pub fn new(entry: ClientEntry, entry_hash: EntryHash) -> LedgerResult<Client> {
        Ok(Client{
            uuid: entry.uuid,
            name: entry.name,
            country: entry.country,
            billing_contact: entry.billing_contact,
            billing_address: entry.billing_address,
            path: entry.path,
            entry_hash: entry_hash
        })
    }
} 
