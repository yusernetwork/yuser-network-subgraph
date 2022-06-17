// import events from the factory contract
import { CollectionCreated } from "./types/yuserFactory/yuserFactory";
//import event from the collection contract
import { Initialized, Transfer, RoleGranted, RoleRevoked, Mint } from "./types/templates/Collection/yuserCollection";
import { Collection } from "./types/templates";
import { CollectionEntity, InitializedEntity, TransferEntity, RoleGrantedEntity, RoleRevokedEntity, MintEntity } from './types/schema';
import { BigInt, log } from "@graphprotocol/graph-ts";

// Events emitted by the factory contract

export function handleNewCollection(event: CollectionCreated): void {
  let collection = new CollectionEntity(event.transaction.hash.toHex());

  collection.collection = event.params.collection.toHexString();
  collection.royalties = event.params.royalties;
  collection.owner = event.params.owner.toHexString();
  collection.collectionId = event.params.collectionId;
  Collection.create(event.params.collection);

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
}



