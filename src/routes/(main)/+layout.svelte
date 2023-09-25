<script lang="ts">
  import { HeaderMenu, Button, Drawer, Icon } from "@likable-hair/svelte";
  import AuthService from '$lib/services/auth/auth.service';
  import userForm, { type User } from "$lib/stores/users/userForm";
  import marketForm from "$lib/stores/users/marketForm";
  import MarketService from "$lib/services/contracts/market.service";

  function loginWithMetamask() {
		const service = new AuthService({ fetch });
		service
      .loginWithMetamask()
	}

  async function ethWithdraw() {
    if ($marketForm?.market?.address) {
      const service = new MarketService({ fetch }, $marketForm?.market?.address)
      
      await service.ethWithdraw();
    }

  }

  async function maticWithdraw() {
    if ($marketForm?.market?.address) {
      const service = new MarketService({ fetch }, $marketForm?.market?.address)
      
      await service.maticWithdraw();
    }

  }

  let ownerAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  let showWithdraw = false
  $: {

    if ($userForm?.user?.address && ownerAddress === $userForm?.user?.address) {
      showWithdraw = true
    }
  }
</script>

<div
  style:background-color="rgba(0, 0, 0, 0.65)"
  style:width="100dvw"
>
  <HeaderMenu
    title="Shards Marketplace"
    color="white"
    --header-menu-height="60px"
    --header-menu-width="100dvw"
    --global-color-background-200="rgba(0, 0, 0, 0.65)"
  >
    <svelte:fragment slot="drawer">
    </svelte:fragment>
    <svelte:fragment slot="append">
      <div
        style:margin-right="20px"
        style:display="flex"
        style:gap="20px"
      >
        {#if !$userForm || !$userForm?.userValid}
          <Button
            --button-background-color="#8642e2"
            --button-hover-background-color="white"
            --button-hover-color="black"
            on:click="{loginWithMetamask}"
          >
            <Icon name="mdi-wallet"></Icon>
            <span>Connect with MetaMask</span>
          </Button>
        {:else}
<!--           {#if showWithdraw} -->
          <Button
            --button-background-color="#8642e2"
            --button-hover-background-color="white"
            --button-hover-color="black"
            on:click="{ethWithdraw}"
          >
            <span>Eth Withdraw</span>
          </Button>

          <Button
            --button-background-color="#8642e2"
            --button-hover-background-color="white"
            --button-hover-color="black"
            on:click="{maticWithdraw}"
          >
            <span>Matic Withdraw</span>
          </Button>
<!--           {/if} -->
          <div
            style:background-color="#8642e2"
            style:padding="10px"
            style:border-radius="10px"
          >
            <span>{$userForm.user?.address}</span>
          </div>
        {/if}
      </div>
    </svelte:fragment>
  </HeaderMenu>
</div>

<main 
  class="main-style"
> 
  <slot></slot>
</main>

<style>
  .main-style {
    height: calc(100dvh - 60px);
  }
</style>