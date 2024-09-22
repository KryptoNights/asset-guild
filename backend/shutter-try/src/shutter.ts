import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  NewUpload as NewUploadEvent,
  PaidForContent as PaidForContentEvent,
  PurchaseAttestation as PurchaseAttestationEvent,
  Verified as VerifiedEvent
} from "../generated/Shutter/Shutter"
import {
  NewUpload,
  PaidForContent,
  PurchaseAttestation,
  Verified
} from "../generated/schema"

export function handleNewUpload(event: NewUploadEvent): void {
  let entity = new NewUpload(
    Bytes.fromUTF8(event.params.contentHash)
  )
  entity.contentHash = event.params.contentHash
  entity.creator = event.params.creator
  entity.timestamp = event.params.timestamp
  entity.price = event.params.price

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.purchaseCount = BigInt.fromI32(0)

  entity.save()
}

export function handlePaidForContent(event: PaidForContentEvent): void {
  let entity = new PaidForContent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.buyer = event.params.buyer
  entity.creator = event.params.creator
  entity.contentHash = event.params.contentHash
  entity.timestamp = event.params.timestamp
  entity.price = event.params.price

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  let upload = NewUpload.load(Bytes.fromUTF8(event.params.contentHash))
  if (upload) {
    upload.purchaseCount = upload.purchaseCount.plus(BigInt.fromI32(1))
    upload.save()
  }
}

export function handlePurchaseAttestation(
  event: PurchaseAttestationEvent
): void {
  let entity = new PurchaseAttestation(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.creator = event.params.creator
  entity.buyer = event.params.buyer
  entity.previewHash = event.params.previewHash
  entity.attestationId = event.params.attestationId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleVerified(event: VerifiedEvent): void {
  let entity = new Verified(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.nullifierHash = event.params.nullifierHash

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
