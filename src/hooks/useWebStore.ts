import { useSyncExternalStore } from 'react'
import type { Store } from '@/services/webStore'

/** Subscribe a component to a store created with createWebStore(). */
export const useWebStore = <T,>(store: Store<T>): T => useSyncExternalStore(store.subscribe, store.get)
