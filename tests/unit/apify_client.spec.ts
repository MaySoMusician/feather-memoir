import { test } from '@japa/runner'
import { fetchRunDataset, client } from '#services/apify_client'

test.group('ApifyClient.fetchRunDataset pagination guard', () => {
  test('throws when exceeding maxPages override', async ({ assert }) => {
    let calls = 0
    const fakeDataset = {
      listItems: async () => {
        calls++
        return { items: [{ id: calls }] }
      },
    }
    const originalDataset = client.dataset
    client.dataset = () => fakeDataset as any

    try {
      await fetchRunDataset('test-dataset', 2)
      assert.fail('Expected error not thrown')
    } catch (error) {
      assert.include((error as Error).message, 'Exceeded max dataset pages')
    } finally {
      client.dataset = originalDataset
    }
  })

  test('returns all items when under limit', async ({ assert }) => {
    let calls = 0
    const fakeDataset = {
      listItems: async () => {
        calls++
        if (calls < 3) {
          return { items: [{ id: calls }] }
        }
        return { items: [] }
      },
    }
    const originalDataset = client.dataset
    client.dataset = () => fakeDataset as any

    const items = await fetchRunDataset('test-dataset', 5)
    assert.lengthOf(items, 2)
    assert.equal(items[0].id, 1)
    assert.equal(items[1].id, 2)

    client.dataset = originalDataset
  })
})
