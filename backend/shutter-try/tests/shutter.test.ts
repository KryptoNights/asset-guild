import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { NewUpload } from "../generated/schema"
import { NewUpload as NewUploadEvent } from "../generated/Shutter/Shutter"
import { handleNewUpload } from "../src/shutter"
import { createNewUploadEvent } from "./shutter-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let contentHash = "Example string value"
    let creator = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let timestamp = BigInt.fromI32(234)
    let price = BigInt.fromI32(234)
    let newNewUploadEvent = createNewUploadEvent(
      contentHash,
      creator,
      timestamp,
      price
    )
    handleNewUpload(newNewUploadEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("NewUpload created and stored", () => {
    assert.entityCount("NewUpload", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "NewUpload",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "contentHash",
      "Example string value"
    )
    assert.fieldEquals(
      "NewUpload",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "creator",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "NewUpload",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "timestamp",
      "234"
    )
    assert.fieldEquals(
      "NewUpload",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "price",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
