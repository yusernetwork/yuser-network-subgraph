// import events from the factory contract
import { CollectionCreated } from "./types/yuserFactory/yuserFactory";
//import event from the collection contract
import { Initialized, Transfer, RoleGranted, RoleRevoked, Mint } from "./types/templates/Collection/yuserCollection";
import { Collection } from "./types/templates";
import { CollectionEntity, InitializedEntity, TransferEntity, RoleGrantedEntity, RoleRevokedEntity, MintEntity } from './types/schema';
import fetch from "node-fetch";
import { BigInt, log } from "@graphprotocol/graph-ts";

// Events emitted by the factory contract
const baseUrl = "https://dev.yuserapps.com";

export function handleNewCollection(event: CollectionCreated): void {
  let collection = new CollectionEntity(event.transaction.hash.toHex());


  collection.collection = event.params.collection.toHexString();
  collection.royalties = event.params.royalties;
  collection.owner = event.params.owner.toHexString();
  collection.collectionId = event.params.collectionId;


  Collection.create(event.params.collection);

  const response = fetch(`${baseUrl}/nft-collection/${collection.collectionId}`, {
    method: "PUT",
    body: JSON.stringify({
      ownerAddress: collection.owner.toLowerCase(),
      contractAddress: collection.collection
    }),
    headers: {
      'api-key': 'NsM9l5YcuZYJLirflAx0rhbcameSysTikz_Bx_HHpE6akMeCHSSEevX-huSRr3zl',
      'Content-type': 'application/json'
    },
  }).then(response => {
    collection.save();
    if (!response.ok) {
      log.info("There was an error", []);
    }
  });

  log.info(`Collection creation event processed: collection address: ${collection.collection}`, []);
}

// Events emitted by the Collection contracts

export function handleCollectionInitialized(event: Initialized): void {
  let initialized = new InitializedEntity(event.transaction.hash.toHex());
  initialized.owner = event.params.owner.toHexString();
  initialized.collection = event.address.toHexString();
  initialized.collectionId = event.params.collectionId;
  initialized.save();
  log.info(`Initialized event processed at address: ${event.address}`, []);
}

export function handleTransfer(event: Transfer): void {
  let transfer = new TransferEntity(event.transaction.hash.toHex());
  transfer.from = event.params.from.toHexString();
  transfer.to = event.params.to.toHexString();
  transfer.tokenId = event.params.tokenId;
  transfer.collection = event.address.toHexString();

  if (transfer.from !== "0x0000000000000000000000000000000000000000000000000000000000000000") {
    const response = fetch(`${baseUrl}/nextgems-handler`, {
      method: "POST",
      body: JSON.stringify({ addressFrom: transfer.from, addressTo: transfer.to, tokenId: Number(transfer.tokenId), contractAddress: transfer.collection }),
      headers: {
        'api-key': 'NsM9l5YcuZYJLirflAx0rhbcameSysTikz_Bx_HHpE6akMeCHSSEevX-huSRr3zl',
        'Content-type': 'application/json'
      },
    }).then((response) =>{
      if (!response.ok) {
        throw new Error("Error: Event was not processed correctly");
      }
      transfer.save()
    });
    
  }
  log.info(`Transfer event processed at address: ${event.address}`, []);
}

export function handleRoleGranted(event: RoleGranted): void {
  let roleGranted = new RoleGrantedEntity(event.transaction.hash.toHex());
  roleGranted.role = event.params.role.toHexString(); // role has to be converted to string
  roleGranted.account = event.params.account.toHexString();
  roleGranted.sender = event.params.sender.toHexString();
  roleGranted.collection = event.address.toHexString();
  roleGranted.save();
  log.info(`RoleGranted event processed at address: ${event.address}`, []);
}

export function handleRoleRevoked(event: RoleRevoked): void {
  let roleRevoked = new RoleRevokedEntity(event.transaction.hash.toHex());
  roleRevoked.role = event.params.role.toHexString(); // role has to be converted to string
  roleRevoked.account = event.params.account.toHexString();
  roleRevoked.sender = event.params.sender.toHexString();
  roleRevoked.collection = event.address.toHexString();
  roleRevoked.save();
  log.info(`RoleRevoked event processed at address: ${event.address}`, []);
}

export function handleMint(event: Mint): void {
  let mint = new MintEntity(event.transaction.hash.toHex());
  mint.minter = event.params.minter.toHexString();
  mint.to = event.params.to.toHexString();
  mint.tokenId = event.params.tokenId;
  mint.tokenHash = event.params.tokenHash;
  mint.collection = event.address.toHexString();

  log.info(`Mint event processed at address: ${event.address}`, []);
  const updateNodeRes = fetch(`${baseUrl}/nft-creation`, {
    method: "PUT",
    body: JSON.stringify({
      contractId: Number(mint.tokenId),
      ipfsId: mint.tokenHash,
      contractAddress: mint.collection
    }),
    headers: {
      'api-key': 'NsM9l5YcuZYJLirflAx0rhbcameSysTikz_Bx_HHpE6akMeCHSSEevX-huSRr3zl',
      'Content-type': 'application/json'
    },
  }).then((updateNodeRes) => {
    mint.save()
    if (!updateNodeRes.ok) {
      log.error("Error: Could not update token", []);
    }
  });
  
  const mintTokenRes = fetch(`${baseUrl}/nextgems-handler`, {
    method: "POST",
    body: JSON.stringify({ addressFrom: mint.minter, addressTo: mint.to, tokenId: Number(mint.tokenId), contractAddress: mint.collection }),
    headers: {
      'api-key': 'NsM9l5YcuZYJLirflAx0rhbcameSysTikz_Bx_HHpE6akMeCHSSEevX-huSRr3zl',
      'Content-type': 'application/json'
    },
  }).then((mintTokenRes=>{
    if (!mintTokenRes.ok) {
      log.error("Error: Could not mint token", []);
    }
  }));
  

  log.info(`Mint event processed at address: ${event.address}`, []);
}



