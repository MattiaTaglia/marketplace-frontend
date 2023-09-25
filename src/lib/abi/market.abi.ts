export const MARKETABI = [
  "function convertEthInUsd(uint weiAmount) public view returns (uint)",
  "function convertUsdInEth(uint usdAmount) public view returns (uint)",
  "function convertMaticInUsd(uint weiAmount) public view returns (uint)",
  "function convertUsdInMatic(uint usdAmount) public view returns (uint)",
  "function convertMaticInEth(uint maticAmount) public view returns (uint)",
  "function ethWithdraw() public",
  "function maticWithdraw() public",

  // Payable functions
  "function buyShardsInMatic(uint256 amount) public payable",
  "function buyShardsInEth(uint256 amount) public payable",
  "function buyShardsInUsd(uint256 amount) public payable",

  // Events
  "event BuyShardsInMatic(address buyer, uint256 amountOfmatic, uint256 amountOfShards)",
  "event BuyShardsInEth(address buyer, uint256 amountOfEth, uint256 amountOfShards)",
  "event BuyShardsInUsd(address buyer, uint256 amountOfUsd, uint256 amountOfShards)"
]