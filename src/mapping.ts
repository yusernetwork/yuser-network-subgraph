import { CollectionCreated } from "../generated/yuserFactory/yuserFactory";
import { ItemListed, Bid, Settled } from "../generated/yuserMarketPlace/yuserMarketPlace";
import { Initialized, Transfer, RoleGranted, RoleRevoked, Mint } from "../generated/templates/Collection/yuserCollection";
import { Transfer as NextGemsTransfer } from "../generated/nextGems/nextGems";
import { Collection } from "../generated/templates";
import { CollectionEntity, InitializedEntity, TransferEntity, RoleGrantedEntity, RoleRevokedEntity, MintEntity, ItemListedEntity, BidEntity, SettledEntity } from '../generated/schema';
import { log } from "@graphprotocol/graph-ts";

// Events emitted by the factory contract

export function handleNewCollection(event: CollectionCreated): void {
  let collection = new CollectionEntity(event.transaction.hash.toHex());

  collection.collection = event.params.collection.toString();
  collection.royalties = event.params.royalties;
  collection.owner = event.params.owner.toString();
  collection.collectionId = event.params.collectionId;
  Collection.create(event.params.collection);
  collection.save();

  log.info(`Collection creation event processed: collection address: ${collection.collection}`, []);
}

// Events emitted by the Collection contracts

export function handleCollectionInitialized(event: Initialized): void {
  let initialized = new InitializedEntity(event.transaction.hash.toHex());
  initialized.owner = event.params.owner.toString();
  initialized.collection = event.address.toString();
  initialized.collectionId = event.params.collectionId;
  initialized.save();

  log.info(`Initialized event processed at address: ${event.address}`, []);
}

export function handleTransfer(event: Transfer): void {
  let transfer = new TransferEntity(event.transaction.hash.toHex());
  transfer.from = event.params.from.toString();
  transfer.to = event.params.to.toString();
  transfer.tokenId = event.params.tokenId;
  transfer.collection = event.address.toString();
  transfer.save();

  log.info(`Transfer event processed at address: ${event.address}`, []);
}

export function handleRoleGranted(event: RoleGranted): void {
  let roleGranted = new RoleGrantedEntity(event.transaction.hash.toHex());
  roleGranted.role = event.params.role.toString(); // role has to be converted to string
  roleGranted.account = event.params.account.toString();
  roleGranted.sender = event.params.sender.toString();
  roleGranted.collection = event.address.toString();
  roleGranted.save();

  log.info(`RoleGranted event processed at address: ${event.address}`, []);
}

export function handleRoleRevoked(event: RoleRevoked): void {
  let roleRevoked = new RoleRevokedEntity(event.transaction.hash.toHex());
  roleRevoked.role = event.params.role.toString(); // role has to be converted to string
  roleRevoked.account = event.params.account.toString();
  roleRevoked.sender = event.params.sender.toString();
  roleRevoked.collection = event.address.toString();
  roleRevoked.save();

  log.info(`RoleRevoked event processed at address: ${event.address}`, []);
}

export function handleMint(event: Mint): void {
  let mint = new MintEntity(event.transaction.hash.toHex());
  mint.minter = event.params.minter.toString();
  mint.to = event.params.to.toString();
  mint.tokenId = event.params.tokenId;
  mint.tokenHash = event.params.tokenHash;
  mint.collection = event.address.toString();
  mint.save();

  log.info(`Mint event processed at address: ${event.address}`, []);
}

// Events emitted on the marketplace contract

export function handleItemListed(event: ItemListed): void {
  let itemListed = new ItemListedEntity(event.transaction.hash.toHex());
  itemListed.itemNumber = event.params.itemNumber;
  itemListed.auctionEnd = event.params.auctionEnd.toString();
  itemListed.seller = event.params.seller.toString();
  itemListed.tokenId = event.params.tokenId;
  itemListed.saleToken = event.params.saleToken.toString();
  itemListed.nftToken = event.params.nftToken.toString();
  itemListed.minPrice = event.params.minPrice;
  itemListed.save();

  log.info(`itemListed event processed at address: ${event.address}`, []);
}

export function handleBid(event: Bid): void {
  let bid = new BidEntity(event.transaction.hash.toHex());
  bid.itemNumber = event.params.itemNumber;
  bid.bidAmount = event.params.bidAmount;
  bid.bidder = event.params.bidder.toString();
  bid.tokenId = event.params.tokenId;
  bid.save();

  log.info(`bid event processed at address: ${event.address}`, []);
}

export function handleSettled(event: Settled): void {
  let settled = new SettledEntity(event.transaction.hash.toHex());
  settled.itemNumber = event.params.itemNumber;
  settled.bidAmount = event.params.bidAmount;
  settled.winner = event.params.winner.toString();
  settled.seller = event.params.seller.toString();
  settled.tokenId = event.params.tokenId;
  settled.save();

  log.info(`settled event processed at address: ${event.address}`, []);
}

// Events emitted by the nextGems contract

export function handleNextGemsTransfer(event: NextGemsTransfer): void {
  let transfer = new TransferEntity(event.transaction.hash.toHex());
  transfer.from = event.params.from.toString();
  transfer.to = event.params.to.toString();
  transfer.tokenId = event.params.tokenId;
  transfer.collection = event.address.toString();
  transfer.save();

  log.info(`Transfer event processed at address: ${event.address}`, []);
}



