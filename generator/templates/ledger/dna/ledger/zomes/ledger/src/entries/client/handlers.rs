use crate::{
    error::LedgerResult,
    client::{Client, ClientEntry}
};
use hdk3::prelude::*;

use super::{ClientListInput, ClientList};

/// Create a new client
pub(crate) fn create_client(client_entry: ClientEntry) -> LedgerResult<Client> {
    let ClientEntry { path, uuid, .. } = client_entry.clone();
    let path: Path = Path::from(format!("{}.{}", path, uuid));
    path.ensure()?;
    create_entry(&client_entry)?;
    let entry_hash = hash_entry(&client_entry)?;
    let _client_link: HeaderHash = create_link(path.hash()?, entry_hash.clone(), ())?;
    Client::new(client_entry, entry_hash)
}

pub(crate) fn delete_client(client: Client) -> LedgerResult<()> {
    // This is a workaround for now
    if let Some(Details::Entry(metadata::EntryDetails{headers,..})) = get_details(client.entry_hash, GetOptions::default())?{
      if let Some(header) = headers.first(){
        delete_entry(header.header_address().clone())?;
      }
    }
    Ok(())
}

pub(crate) fn list_clients(input: ClientListInput) -> LedgerResult<ClientList> {
    let path_path = Path::from(input.path);
    let client_path_links = path_path.children()?.into_inner();
    let mut clients = Vec::with_capacity(client_path_links.len());
    for client_uuid in client_path_links.into_iter().map(|link| link.target) {
    let mut links = get_links(client_uuid, None)?.into_inner();
    links.sort_by_key(|l|l.timestamp);
    if let Some(client_link_last) = links.last() {
         if let Some(element) = get(client_link_last.target.clone(), GetOptions::default())? {
                if let Some(client) = element.into_inner().1.to_app_option::<ClientEntry>()? {
                    clients.push(Client::new(client.clone(), hash_entry(&client)?)?);
                }
            }
        }
    }
    Ok(clients.into())
}
