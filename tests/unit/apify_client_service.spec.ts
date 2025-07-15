import { test } from '@japa/runner'
import sinon from 'sinon'
import ApifyClientService from '#services/apify_client'
import { ActorClient } from 'apify-client'

test.group('ApifyClientService.fetchRunDataset pagination guard', (group) => {
  group.each.teardown(() => {
    sinon.restore()
  })

  test('throws when exceeding maxPages override', async ({ assert }) => {
    const mockedClient = {
      actor: () => sinon.createStubInstance(ActorClient),
      dataset: () => {
        return {
          listItems() {
            return { items: [{ id: 1 }] }
          },
        }
      },
    }

    const apifyClientService = new ApifyClientService({
      client: mockedClient as any,
      actorId: 'test',
      datasetPageSize: 1,
      waitSecs: 1,
    })

    try {
      await apifyClientService.fetchRunDataset('test-dataset', 2)
      assert.fail('Expected error not thrown')
    } catch (error) {
      assert.include((error as Error).message, 'Exceeded max dataset pages')
    }
  })

  test('returns all items when under limit', async ({ assert }) => {
    const stubbedListItems = sinon
      .stub()
      .onCall(0)
      .returns({ items: [{ id: 1 }] })
      .onCall(1)
      .returns({ items: [{ id: 2 }] })
      .onCall(2)
      .returns({ items: [] })
    const mockedClient = {
      actor: () => sinon.createStubInstance(ActorClient),
      dataset: () => {
        return {
          listItems: stubbedListItems,
        }
      },
    }

    const apifyClientService = new ApifyClientService({
      client: mockedClient as any,
      actorId: 'test',
      datasetPageSize: 1,
      waitSecs: 1,
    })

    const items = await apifyClientService.fetchRunDataset('test-dataset', 5)
    assert.lengthOf(items, 2)
    assert.equal(items[0].id, 1)
    assert.equal(items[1].id, 2)
  })
})
