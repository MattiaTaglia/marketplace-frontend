import { writable } from "svelte/store"

export type User = {
  address?: string
}

export default writable<{
  user?: User,
  userValid: boolean
} | undefined>(undefined)