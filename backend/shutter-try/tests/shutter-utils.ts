import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  NewUpload,
  PaidForContent,
  PurchaseAttestation,
  Verified
} from "../generated/Shutter/Shutter"

export function createNewUploadEvent(
  contentHash: string,
  creator: Address,
  timestamp: BigInt,
  price: BigInt
): NewUpload {
  let newUploadEvent = changetype<NewUpload>(newMockEvent())

  newUploadEvent.parameters = new Array()

  newUploadEvent.parameters.push(
    new ethereum.EventParam(
      "contentHash",
      ethereum.Value.fromString(contentHash)
    )
  )
  newUploadEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  newUploadEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )
  newUploadEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return newUploadEvent
}

export function createPaidForContentEvent(
  buyer: Address,
  creator: Address,
  contentHash: string,
  timestamp: BigInt,
  price: BigInt
): PaidForContent {
  let paidForContentEvent = changetype<PaidForContent>(newMockEvent())

  paidForContentEvent.parameters = new Array()

  paidForContentEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  paidForContentEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  paidForContentEvent.parameters.push(
    new ethereum.EventParam(
      "contentHash",
      ethereum.Value.fromString(contentHash)
    )
  )
  paidForContentEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )
  paidForContentEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return paidForContentEvent
}

export function createPurchaseAttestationEvent(
  creator: Address,
  buyer: Address,
  previewHash: string,
  attestationId: BigInt
): PurchaseAttestation {
  let purchaseAttestationEvent = changetype<PurchaseAttestation>(newMockEvent())

  purchaseAttestationEvent.parameters = new Array()

  purchaseAttestationEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  purchaseAttestationEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  purchaseAttestationEvent.parameters.push(
    new ethereum.EventParam(
      "previewHash",
      ethereum.Value.fromString(previewHash)
    )
  )
  purchaseAttestationEvent.parameters.push(
    new ethereum.EventParam(
      "attestationId",
      ethereum.Value.fromUnsignedBigInt(attestationId)
    )
  )

  return purchaseAttestationEvent
}

export function createVerifiedEvent(nullifierHash: BigInt): Verified {
  let verifiedEvent = changetype<Verified>(newMockEvent())

  verifiedEvent.parameters = new Array()

  verifiedEvent.parameters.push(
    new ethereum.EventParam(
      "nullifierHash",
      ethereum.Value.fromUnsignedBigInt(nullifierHash)
    )
  )

  return verifiedEvent
}
