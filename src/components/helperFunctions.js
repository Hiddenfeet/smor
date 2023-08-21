import { BigNumber } from "ethers";
import { tokenContract, WCroContract } from "./helperConstants";
import value from "../value.json";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
export function findSubsets(subset, nums, output, index) {
  if (index === nums.length) {
    subset.push(output);
    return;
  }
  findSubsets(subset, nums, [...output], index + 1);
  output.push(nums[index]);
  findSubsets(subset, nums, [...output], index + 1);
}
//subset = []
// findSubsets(subset, yourArray, [], 0)
export function permute(letters) {
  let res = [];
  dfs(letters, [], Array(letters.length).fill(false), res);
  return res;
}

function dfs(letters, path, used, res) {
  if (path.length === letters.length) {
    // make a deep copy since otherwise we'd be append the same list over and over
    res.push(Array.from(path));
    return;
  }
  for (let i = 0; i < letters.length; i++) {
    // skip used letters
    if (used[i]) continue;
    // add letter to permutation, mark letter as used
    path.push(letters[i]);
    used[i] = true;
    dfs(letters, path, used, res);
    // remove letter from permutation, mark letter as unused
    path.pop();
    used[i] = false;
  }
}

export function allSubsets(nums) {
  const result = [];
  result.push([]);
  let size = nums.length;
  for (let i = 1; i < 1 << size; i++) {
    let subset = [];
    let bitmask = 0;
    while (bitmask < size) {
      if (i & (1 << bitmask)) {
        subset.push(nums[bitmask]);
      }
      bitmask++;
    }
    result.push(subset);
  }
  return result;
}

export function findMax(arr) {
  var val = BigNumber.from("0");
  var row = 0;
  var col = 0;
  const n = arr.length;
  const m = arr[0].length;
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < m; j++) {
      if (BigNumber.from(arr[i][j]).gt(val)) {
        val = BigNumber.from(arr[i][j]);
        row = i;
        col = j;
      }
    }
  }
  return [val, row, col];
}

export async function checkAllowance(token, userAddress, signer, userInput) {
  const notyf = new Notyf({
    duration: 3000,
    position: { x: "right", y: "top" },
    dismissible: true,
  });
  const tokenRouter = tokenContract(signer, token);
  const allowance = await tokenRouter.allowance(
    userAddress,
    value.aggregatorAddress
  );
  if (BigNumber.from(allowance._hex).lt(userInput)) {
    notyf.error("Please Approve CROWKING DEX to use your token");
    const tx = await tokenRouter.approve(
      value.aggregatorAddress,
      BigNumber.from(10).pow(30)
    );
    await tx.wait();
    notyf.success("Approved! Wait few seconds for the transaction to complete");
  }
}
export async function checkAllowanceForWithdrawal(
  token,
  userAddress,
  signer,
  userInput
) {
  const notyf = new Notyf({
    duration: 3000,
    position: { x: "right", y: "top" },
    dismissible: true,
  });
  const wCroRouter = WCroContract(signer, token);
  const allowance = await wCroRouter.allowance(
    userAddress,
    "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23"
  );
  if (BigNumber.from(allowance._hex).lt(userInput)) {
    notyf.error("Please Approve CROWKING DEX to use your token");
    const tx = await wCroRouter.approve(
      "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23",
      BigNumber.from(10).pow(30)
    );
    await tx.wait();
    notyf.success("Approved! Wait few seconds for the transaction to complete");
  }
}
