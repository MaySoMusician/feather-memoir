import type { LucidModel, ModelAttributes } from '@adonisjs/lucid/types/model'

/**
 * The type of the `values` parameter passed to a `LucidModel.createMany` method
 */
export type CreateManyValue<T extends LucidModel> = Partial<ModelAttributes<InstanceType<T>>>
