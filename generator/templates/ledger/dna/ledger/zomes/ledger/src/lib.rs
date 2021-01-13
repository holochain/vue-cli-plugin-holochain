use entries::client;
use error::LedgerResult;
use hdk3::prelude::Path;
use hdk3::prelude::*;
use client::{ClientEntry, Client, ClientListInput, ClientList};

mod entries;
mod error;

entry_defs![Path::entry_def(), ClientEntry::entry_def()];

#[hdk_extern]
fn create_client(client_entry: ClientEntry) -> LedgerResult<Client> {
    client::handlers::create_client(client_entry)
}

#[hdk_extern]
fn delete_client(client: Client) -> LedgerResult<()> {
    client::handlers::delete_client(client)
}

#[hdk_extern]
fn list_clients(parent: ClientListInput) -> LedgerResult<ClientList> {
    client::handlers::list_clients(parent)
}
