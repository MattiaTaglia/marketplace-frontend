import { writable } from "svelte/store"

export type Market = {
  address?: string
}

export default writable<{
  market?: Market
} | undefined> (undefined) 