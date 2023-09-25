<script lang="ts">
  import MarketService from "$lib/services/contracts/market.service";
  import marketForm from "$lib/stores/users/marketForm";
  import { Button, Dialog, SimpleTextField, Icon } from "@likable-hair/svelte";
  import  { Card } from "@likable-hair/svelte";
  import { Image } from "@likable-hair/svelte";
  import { onMount } from "svelte";
  
  let shardsBatch = [
    {
      title: '50 Shards',
      image: "shards_50.jpeg",
      amountToBuy: 50,
      maticAmount: 1,
      ethAmount: 0,
      usdAmount: 0,
      priceText: "1 MATIC | 4 ETH | 20 USD"
    },
    {
      title: '100 Shards',
      image: "shards_100.jpeg",
      amountToBuy: 100,
      maticAmount: 2,
      ethAmount: 0,
      usdAmount: 0,
      priceText: "2 MATIC | 4 ETH | 20 USD"
    },
    {
      title: '500 Shards',
      image: "shards_500.jpeg",
      amountToBuy: 500,
      maticAmount: 10,
      ethAmount: 0,
      usdAmount: 0,
      priceText: "10 MATIC | 4 ETH | 20 USD"
    },
    {
      title: '1000 Shards',
      image: "shards_1000.jpeg",
      amountToBuy: 1000,
      maticAmount: 20,
      ethAmount: 0,
      usdAmount: 0,
      priceText: "20 MATIC | 4 ETH | 20 USD"
    }
  ]
  
  let selectedBatch: {
    title?: string,
    image?: string,
    amountToBuy?: number,
    maticAmount?: number,
    ethAmount?: number,
    usdAmount?: number,
    priceText?: string
  } = {}

  let marketAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"
  let openDialog = false

  function clickOnItem(item: any) {
    openDialog = true
    selectedBatch = item
    console.log(item)
  }

  async function makeConversions() {
    marketForm.set({
      market: {
        address: marketAddress
      }
    })
    const service = new MarketService({ fetch }, marketAddress)

    for (let i = 0; i < shardsBatch.length; i++) {
      let batch = shardsBatch[i]
      const usd = await service.convertMaticInUsd(batch.maticAmount)
      const eth = await service._round5Decimals(await service.convertMaticInEth(batch.maticAmount))

      let completedPriceText = batch.maticAmount + " MATIC | " 
        + await service._round5Decimals(eth) + " ETH | " + await service._round2Decimals(usd) + " USD" 
      shardsBatch[i].ethAmount = eth
      shardsBatch[i].usdAmount = usd
      shardsBatch[i].priceText = completedPriceText
    }
  }

  async function buyWithMatic(item: any) {
    const service = new MarketService({ fetch }, marketAddress)
    
    await service.buyShardsWithMatic(item.amountToBuy, item.maticAmount);
  }

  async function buyWithEth(item: any) {
    const service = new MarketService({ fetch }, marketAddress)
    
    const success = await service.buyShardsWithEth(item.amountToBuy, item.ethAmount);
    if (success)
      openDialog = false
  }

  onMount(() => {
    makeConversions()
  })
</script>

<div
  style:display="flex"
  style:justify-content="center"
  style:align-items="center"
  style:height="100%"
  style:font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
  style:font-size="large"
>

  {#each shardsBatch as batch}
    <div 
      style:margin-left="20px"
      class="product-card"
    >
      <Card
        width="13dvw"
        backgroundColor="rgba( 255, 255, 255, 0.15)"
        color="white"
        borderRadius="10px"
        borderColor="rgba( 255, 255, 255, 0.18 )"
        borderWidth="1px solid"
        on:click={() => clickOnItem(batch)}
      >

        <Image 
          src={batch.image}
          width="100%"
          height="26dvh"
          disableHover={true}
          --border-radius="10px 10px 0px 0px"
        >
        </Image>
        
        <div 
          style:display="flex"
          style:justify-content="center"
          style:margin-top="5px"
        >
          { batch.title }
        </div>

        <svelte:fragment slot="footer">
          <div
            style:display="flex"
            style:justify-content="center"
            style:align-items="end"
            style:margin-bottom="5px"
            style:height="60px"
            style:font-size="0.95rem"
          >
            { batch.priceText }
          </div>
        </svelte:fragment>
      </Card>
    </div>
  {/each}

  <Dialog
    bind:open={openDialog}
  >
    <Card
      width="40dvw"
      height="18dvw"
      backgroundColor="rgba( 0, 0, 0, 0.80)"
      borderRadius="15px"
    >
      <svelte:fragment slot="header">
        <div
          style:border-bottom="1px solid white"
          style:margin-left="5px"
          style:padding="5px"
        >
          <span
            style:font-size="24px"
            style:font-weight="600"
            style:font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
            style:color="white"
          >
            Product details
          </span>
        </div>
      </svelte:fragment>
      <div
        style:margin-top="20px"
        style:display="flex"
        style:flex-direction="column"
        style:height="13dvw"
        style:gap="20px"
      > 
        
        <div
          style:width="90%"
          style:display="flex"
        >
          <span
            style:margin-left="5px"
            style:width="15%"
            style:padding="5px"
            style:font-size="20px"
            style:font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
            style:color="white"
          >
            Amount
          </span>
          <div
            style:margin-left="5px"
          >
            <SimpleTextField
              readonly
              value="{selectedBatch.title}"
            ></SimpleTextField>
            </div>
        </div>

        <div
          style:width="90%"
          style:display="flex"
        >
          <span
            style:margin-left="5px"
            style:width="15%"
            style:padding="5px"
            style:font-size="20px"
            style:font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
            style:color="white"
          >
            Price
          </span>
          <div
            style:margin-left="5px"
          >
            <SimpleTextField
              readonly
              value="{selectedBatch.priceText}"
            ></SimpleTextField>
          </div>
        </div>

        <div
          style:display="flex"
          style:justify-content="center"
          style:align-items="center"
          style:aling-self="center"
          style:margin-top="auto"
          style:margin-bottom="20px"
          style:gap="15px"
        >
          <Button
            --button-background-color="#8642e2"
            --button-hover-background-color="white"
            --button-hover-color="black"
            on:click="{() => {buyWithMatic(selectedBatch)}}"
          >
            <Icon name="mdi-wallet"></Icon>
            <span>Pay with MATIC</span>
          </Button>

          <Button
            --button-background-color="#8642e2"
            --button-hover-background-color="white"
            --button-hover-color="black"
            on:click="{() => {buyWithEth(selectedBatch)}}"
          >
            <Icon name="mdi-wallet"></Icon>
            <span>Pay with ETH</span>
          </Button>

        </div>
      </div>
    </Card>
  </Dialog>
</div>

<style>
  .product-card {
    transition: transform .2s;
    backdrop-filter: blur( 4px );
    -webkit-backdrop-filter: blur( 4px );
  }
  
  .product-card:hover {
    transform: scale(1.1);
    
  }

</style>
