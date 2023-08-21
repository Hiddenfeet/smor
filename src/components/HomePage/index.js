import React, { Component, useState, useRef, useEffect } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import refreshLogo from "../assests/images/refresh.svg";
import setting from "../assests/images/setting.svg";
import backBtn from "../assests/images/back-button.svg";
import value from "../../value.json";
import lionImage from "../assests/images/lion.svg";
import InfoLogo from "../assests/images/info.svg";
import arrowWStroke from "../assests/images/arrowwstroke.svg";
import swapIcon from "../assests/images/swapIcon.svg";
import walletIcon from "../assests/images/walletIcon.svg";
import daiIcon from "../assests/images/daiIcon.svg";
import ethIcon from "../assests/images/ethIcon.svg";
import { ReactComponent as LegacyIcon } from "../assests/images/legacyIcon.svg";
import walkingman from "../assests/images/walkingman.svg";
import searchIcon from "../assests/images/searchIcon.svg";
import pin from "../assests/images/pin.svg";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  tokenMap,
  tokenContract,
  aggregatorContract,
  WCroContract,
  tokenMap2,
} from "../helperConstants";
import {
  checkAllowance,
  checkAllowanceForWithdrawal,
} from "../helperFunctions";
import highlightedpin from "../assests/images/highlightedPin.svg";
import "./style.css";
import { Lottie1, Lottie1Dark } from "../Lottie";
import { useSigner } from "wagmi";
import { BigNumber, ethers } from "ethers";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
export default function HomePage(props) {
  const {
    setUserInput,
    userInput,
    outPutTokens,
    convertToken,
    setIsCro,
    parameters,
    isCro,
    setReload,
    reload,
    setTokens,
    tokens,
    tokenBalance,
    isDataLoading,
  } = props;
  const notyf = new Notyf({
    duration: 3000,
    position: { x: "right", y: "top" },
    dismissible: true,
  });
  const [slippage1, setSlippage1] = useState(95);
  const [deadline, setDeadline] = useState(20);
  const [expanded, setExpanded] = useState(false);
  const { data: signer, isError, isLoading } = useSigner();
  const [selectToken, setSelectToken] = useState(false);
  const [searchBarValue_list, setSearchBarValue_list] = useState(<div></div>);
  const [searchBarValue_list2, setSearchBarValue_list2] = useState(<div></div>);
  const [selectToken1, setSelectToken1] = useState(false);
  const [selectToken2, setSelectToken2] = useState(false);
  const [searchValue1, setSearchValue1] = useState("");
  const [searchValue2, setSearchValue2] = useState("");
  const [selectedToken1, setSelectedToken1] = useState("USDT");
  const [selectedToken2, setSelectedToken2] = useState("ETH");
  const [isSetting, setIsSetting] = useState(false);
  const [slippage, setSlippage] = useState(4);
  const [searchBarValue, setSearchBarValue] = useState(<div></div>);
  const [searchBarValue2, setSearchBarValue2] = useState(<div></div>);
  const [selectedIcon1, setSelectedIcon1] = useState(
    <img src={require(`../assests/images/webP/usdt.webp`)} />
  );
  const [selectedIcon2, setSelectedIcon2] = useState(
    <img src={require(`../assests/images/webP/eth.webp`)} />
  );
  // Refresh btn
  const [isRotating, setIsRotating] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [fastTxn, setFastTxn] = useState(false);
  const [isOutputCro, setIsOutputCro] = useState(false);
  const handleRefreshClick = () => {
    setIsRotating(true);
    setReload((state) => {
      return !state;
    });
    setTimeout(() => setIsRotating(false), 500); // rotate for 5 milliseconds
  };
  const [isDisabled, setIsDisabled] = useState(false);
  async function onClickSwap() {
    setIsDisabled(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if (parseFloat(userInput) === 0) {
      notyf.error("Add input Amount");
      setIsDisabled(false);
      return;
    }
    const feeData = await provider.getFeeData();
    let finalGasPrice = 0;
    if (fastTxn) {
      finalGasPrice = feeData.maxPriorityFeePerGas;
    } else {
      finalGasPrice = feeData.lastBaseFeePerGas;
    }
    console.log(isCro, selectedToken2, selectedToken1, isOutputCro);
    if (
      (isCro && selectedToken2 === "WCRO") ||
      (isOutputCro && selectedToken1 === "WCRO")
    ) {
      const temp = await getUserWallet();
      const address = temp[0];
      const signer = temp[1];
      if (address === "" || signer === "") {
        notyf.error("Please Reconnect Your Wallet and Try Again");
        setIsDisabled(false);
        return;
      }
      try {
        const croRouter = WCroContract(signer, tokenMap[0][0]);
        const deci = await croRouter.decimals();
        const bigUserInput = ethers.utils.parseUnits(
          userInput.toString(),
          deci
        );
        if (isCro && selectedToken2 === "WCRO") {
          const croBalance = await provider.getBalance(address);
          if (croBalance.lt(bigUserInput)) {
            notyf.error("Insufficient Balance");
            setIsDisabled(false);
            return;
          }
          const response = await croRouter.deposit({
            value: bigUserInput,
          });
          await response.wait();
        } else if (isOutputCro && selectedToken1 === "WCRO") {
          await checkAllowanceForWithdrawal(
            tokens.token1,
            address,
            signer,
            bigUserInput
          );
          const wcroBalance = await croRouter.balanceOf(address);
          if (wcroBalance.lt(bigUserInput)) {
            notyf.error("Insufficient Balance");
            setIsDisabled(false);
            return;
          }
          const response = await croRouter.withdraw(bigUserInput);
          await response.wait();
        }
        setIsDisabled(false);
        notyf.success("Transaction Successful");
        setReload((state) => {
          return !state;
        });
        return;
      } catch (e) {
        notyf.error("Something Went Wrong");
        console.log(e);
        setIsDisabled(false);
        return;
      }
    }
    if (parameters.length === 4) {
      const temp = await getUserWallet();
      const address = temp[0];
      const signer = temp[1];
      if (address === "" || signer === "") {
        notyf.error("Please Reconnect Your Wallet and Try Again");
        setIsDisabled(false);
        return;
      }
      const balance = parameters[0]._hex;
      const router = parameters[1];
      const finalPath = parameters[2];
      const pairs = parameters[3];
      const tokenRouter = tokenContract(provider, tokens.token1);
      const outPutTokenRouter = tokenContract(provider, tokens.token2);
      const decimals = await tokenRouter.decimals();
      const bigUserInput = ethers.utils.parseUnits(
        userInput.toString(),
        decimals
      );
      if (!isCro) {
        await checkAllowance(tokens.token1, address, signer, bigUserInput);
      }
      if (ethers.BigNumber.from(bigUserInput).lt(balance)) {
        const outDecimals = await outPutTokenRouter.decimals();
        const bigOut = ethers.utils.parseUnits(
          outPutTokens.toFixed(outDecimals).toString(),
          outDecimals
        );
        const temp = parseInt(
          (100 - parseFloat(parseFloat(slippage1).toFixed(1))) * 10
        );
        const amountOutmin = ethers.BigNumber.from(bigOut).mul(temp).div(1000);
        // console.log(ethers.utils.formatUnits(amountOutmin, outDecimals));
        const aggregatorRouter = aggregatorContract(signer);
        const deadLineFromNow = Math.floor(Date.now() / 1000) + deadline * 60;
        if (isCro && isOutputCro) {
          notyf.error("Both Cro can't transact");
          setIsDisabled(false);
          return;
        }
        if (isCro) {
          try {
            const response =
              await aggregatorRouter.swapExactETHForTokensSupportingFeeOnTransferTokens(
                amountOutmin,
                finalPath,
                pairs,
                address,
                deadLineFromNow,
                { value: bigUserInput, gasPrice: finalGasPrice }
              );
            if (response) {
              await response.wait();
              notyf.success("Transaction Success");
            }
          } catch (e) {
            notyf.error("Transaction Failed");
          }
        } else if (isOutputCro) {
          try {
            const response =
              await aggregatorRouter.swapExactTokensForETHSupportingFeeOnTransferTokens(
                bigUserInput,
                amountOutmin,
                finalPath,
                pairs,
                address,
                deadLineFromNow,
                { gasPrice: finalGasPrice }
              );
            await response.wait();
            notyf.success("Transaction Success");
          } catch (e) {
            notyf.error("Transaction Failed");
          }
        } else {
          try {
            const response =
              await aggregatorRouter.swapExactTokensForTokensSupportingFeeOnTransferTokens(
                bigUserInput,
                amountOutmin,
                finalPath,
                pairs,
                address,
                deadLineFromNow,
                { gasPrice: finalGasPrice }
              );
            await response.wait();
            notyf.success("Transaction Success");
          } catch (e) {
            console.log("can't complete transaction", e);
            notyf.error("Transaction Failed");
          }
        }
      } else {
        notyf.error("Transaction Failed");
        setIsDisabled(false);
        return;
      }
    } else {
      notyf.error("Reload the page and try again");
    }
    setIsDisabled(false);
    handleRefreshClick();
  }
  function onClickToken(element, num) {
    console.log(tokens);
    if (num === 1) {
      setSelectedToken1(element[1]);
      setSelectedIcon1(
        <img src={require(`../assests/images/webP/${element[2]}`)} />
      );
      setTokens((state) => {
        return {
          token1: element[0],
          token2: state.token2,
        };
      });
      if (element[1] === "CRO") {
        setIsCro(true);
      } else {
        setIsCro(false);
      }
    } else {
      setSelectedToken2(element[1]);
      setSelectedIcon2(
        <img src={require(`../assests/images/webP/${element[2]}`)} />
      );
      console.log("fire fire", element[0]);
      console.log("UPDATING");
      setTokens((state) => {
        return {
          token1: state.token1,
          token2: element[0],
        };
      });
      if (element[1] === "CRO") {
        setIsOutputCro(true);
      } else {
        setIsOutputCro(false);
      }
    }

    setSelectToken1(false);
    setSelectToken2(false);
    setUserInput(0);
  }
  useEffect(() => {
    console.log("I changed my value", tokens);
  }, [tokens]);
  function onClickReverse() {
    if (isCro && !isOutputCro) {
      setIsCro(false);
      setIsOutputCro(true);
    } else if (!isCro && isOutputCro) {
      setIsCro(true);
      setIsOutputCro(false);
    }
    const temp = selectedToken1;
    setSelectedToken1(selectedToken2);
    setSelectedToken2(temp);
    setTokens((state) => {
      return {
        token1: state.token2,
        token2: state.token1,
      };
    });
    const temp2 = selectedIcon1;
    setSelectedIcon1(selectedIcon2);
    setSelectedIcon2(temp2);
    setUserInput(0);
  }
  function onChangeInput(event) {
    setDeadline(event.target.value);
  }

  const getUserWallet = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const address = await provider.getSigner().getAddress();
      return [address, provider.getSigner()];
    } catch (e) {
      console.log(e);
      return ["", ""];
    }
  };
  const _provider = new ethers.providers.JsonRpcProvider(value.rpcUrl);
  useEffect(() => {
    async function searchBar1() {
      if (searchValue1.startsWith("0x") || searchValue1.startsWith("0X")) {
        if (searchValue1.length === tokenMap[0][0].length) {
          const tokenRouter = tokenContract(_provider, searchValue1);
          try {
            const name = await tokenRouter.symbol();
            setTokens((state) => {
              return {
                token1: searchValue1,
                token2: state.token2,
              };
            });
            for (let i = 0; i < tokenMap.length; i++) {
              if (searchValue1 === tokenMap[i][0]) {
                setSelectedIcon1(
                  <img
                    src={require(`../assests/images/webP/${tokenMap[i][2]}`)}
                  />
                );
                break;
              }
              if (i === tokenMap.length - 1) {
                setSelectedIcon1(
                  <img
                    src={require(`../assests/images/webP/question-mark.webp`)}
                  />
                );
              }
            }
            setSelectedToken1(name);
            setSelectToken1(false);
            setIsCro(false);
            setSelectToken2(false);
            setUserInput(0);
          } catch (e) {
            setSearchBarValue(<div>Address Not found</div>);
          }
        } else {
          setSearchBarValue(<div>Address Not found</div>);
        }
      } else {
        let temp = tokenMap2
          .filter((item) => {
            const searchTerm = searchValue1.toUpperCase();
            return item[1].includes(searchTerm);
          })
          .map((element) => {
            return (
              <div
                className="fav-token cursor-pointer"
                key={element[0] + element[1] + "1"}
                onClick={() => onClickToken(element, 1)}
              >
                {element[2] !== "" ? (
                  <img
                    src={require(`../assests/images/webP/${element[2]}`)}
                    alt="eth-icon"
                  />
                ) : (
                  <img src={ethIcon} alt="eth-icon" />
                )}
                <div>{element[1]}</div>
              </div>
            );
          });
        setSearchBarValue(temp);

        let temp2 = tokenMap
          .filter((item) => {
            const searchTerm = searchValue1.toUpperCase();
            return item[1].includes(searchTerm);
          })
          .map((element, index) => {
            return (
              <div
                className="fav-token list_token cursor-pointer"
                key={element[0] + element[1] + "1"}
                onClick={() => onClickToken(element, 1)}
              >
                {element[2] !== "" ? (
                  <img
                    src={require(`../assests/images/webP/${element[2]}`)}
                    alt="eth-icon"
                  />
                ) : (
                  <img src={ethIcon} alt="eth-icon" />
                )}
                <div className="list_name_symbol">
                  <div>{element[3]}</div>
                  <div>{element[1]}</div>
                </div>
                <div></div>
              </div>
            );
          });
        setSearchBarValue_list(temp2);
      }
    }
    searchBar1();
  }, [searchValue1]);

  useEffect(() => {
    async function searchBar2() {
      if (searchValue2.startsWith("0x") || searchValue2.startsWith("0X")) {
        if (searchValue2.length === tokenMap[0][0].length) {
          const tokenRouter = tokenContract(_provider, searchValue2);
          try {
            const name = await tokenRouter.symbol();
            setTokens((state) => {
              return {
                token1: state.token1,
                token2: searchValue2,
              };
            });
            setSelectedToken2(name);
            setSelectToken1(false);
            setIsOutputCro(false);
            setSelectToken2(false);
            setUserInput(0);
            for (let i = 0; i < tokenMap.length; i++) {
              if (searchValue2 === tokenMap[i][0]) {
                setSelectedIcon2(
                  <img
                    src={require(`../assests/images/webP/${tokenMap[i][2]}`)}
                  />
                );
                break;
              }
              if (i === tokenMap.length - 1) {
                setSelectedIcon2(
                  <img
                    src={require(`../assests/images/webP/question-mark.webp`)}
                  />
                );
              }
            }
          } catch (e) {
            setSearchBarValue2(selectToken2 && <div>Address Not found</div>);
          }
        } else {
          setSearchBarValue2(selectToken2 && <div>Address Not found</div>);
        }
      } else {
        let temp = tokenMap2
          .filter((item) => {
            const searchTerm = searchValue2.toUpperCase();
            return item[1].includes(searchTerm);
          })
          .map((element) => {
            return (
              <div
                className="fav-token cursor-pointer"
                key={element[0] + element[1] + "2"}
                onClick={() => onClickToken(element, 2)}
              >
                {element[2] !== "" ? (
                  <img
                    src={require(`../assests/images/webP/${element[2]}`)}
                    alt="eth-icon"
                  />
                ) : (
                  <img src={ethIcon} alt="eth-icon" />
                )}
                <div>{element[1]}</div>
              </div>
            );
          });
        setSearchBarValue2(temp);

        let temp2 = tokenMap
          .filter((item) => {
            const searchTerm = searchValue2.toUpperCase();
            return item[1].includes(searchTerm);
          })
          .map((element) => {
            return (
              <div
                className="fav-token list_token cursor-pointer"
                key={element[0] + element[1] + "2"}
                onClick={() => onClickToken(element, 2)}
              >
                {element[2] !== "" ? (
                  <img
                    src={require(`../assests/images/webP/${element[2]}`)}
                    alt="eth-icon"
                  />
                ) : (
                  <img src={ethIcon} alt="eth-icon" />
                )}
                <div className="list_name_symbol">
                  <div>{element[3]}</div>
                  <div>{element[1]}</div>
                </div>
              </div>
            );
          });
        setSearchBarValue_list2(temp2);
      }
    }
    searchBar2();
  }, [searchValue2]);

  return (
    <>
      {!isSetting ? (
        <div className="content-wrapper">
          {!selectToken1 && !selectToken2 ? (
            <div
              className="card1"
              style={{
                alignSelf: expanded ? "flex-start" : "center",
              }}
            >
              <div className="swap-form-header">
                <div className="swap-menu-item">Swap</div>
                <div className="swap-icons">
                  <div className="refresh-icon-div">
                    <img
                      onClick={handleRefreshClick}
                      src={refreshLogo}
                      className={`cursor-pointer refreshIcon ${
                        isRotating ? "rotating" : ""
                      }`}
                      alt="refresh"
                    />
                  </div>
                  <div className="refresh-icon-div">
                    <img
                      src={setting}
                      alt="setting"
                      className="cursor-pointer"
                      onClick={() => setIsSetting(true)}
                    />
                  </div>
                </div>
              </div>
              <div className="token-input-wrapper">
                <div className="token-input">
                  <div className="token-input-row buy-sell-text">You sell</div>
                  <div className="token-input-row">
                    <div
                      onClick={() => {
                        setSelectToken1(true);
                        setSearchValue1("");
                      }}
                      className="select-coin cursor-pointer"
                    >
                      <div className="coin-desc">
                        {selectedIcon1}
                        {selectedToken1}
                      </div>
                      <img
                        src={arrowWStroke}
                        className="arrowIcon"
                        alt="arrow"
                      />
                    </div>
                    <input
                      className="input"
                      type="text"
                      placeholder="0.0"
                      value={userInput === "0" ? "" : userInput}
                      onChange={(event) => {
                        const temp = event.target.value.toString();
                        setUserInput(temp === "" ? "0" : temp);
                      }}
                    />
                  </div>
                  <div className="token-input-row">
                    <div className="coin-name">{selectedToken1}</div>
                    {isDataLoading ? (
                      <div className="loader"></div>
                    ) : (
                      <div className="showBalanceOfToken">
                        Balance = {tokenBalance}
                      </div>
                    )}
                  </div>
                  <div className="amountOptionWrapper">
                    <div onClick={()=>setUserInput(tokenBalance/4)} className="amountOption">25%</div>
                    <div onClick={()=>setUserInput(tokenBalance/2)} className="amountOption">50%</div>
                    <div onClick={()=>setUserInput(tokenBalance*3/4)} className="amountOption">75%</div>
                    <div onClick={()=>setUserInput(tokenBalance/1)} className="amountOption">100%</div>
                  </div>
                </div>
                <div className="swapIconDiv">
                  <button className="no-style" onClick={onClickReverse}>
                    <img src={swapIcon} className="swapIcon" alt="swap-icon" />
                  </button>
                </div>
                <div className="token-input2">
                  <div className="token-input-row buy-sell-text">You Buy</div>
                  <div className="token-input-row">
                    <div
                      onClick={() => {
                        setSearchValue2("");
                        setSelectToken2(true);
                      }}
                      className="select-coin cursor-pointer"
                    >
                      <div className="coin-desc">
                        {selectedIcon2}
                        {selectedToken2}
                      </div>
                      <img
                        src={arrowWStroke}
                        className="arrowIcon"
                        alt="arrow"
                      />
                    </div>
                    {isDataLoading ? (
                      <div className="loader translate-x-15"></div>
                    ) : (
                      <input
                        className="input"
                        type="text"
                        readOnly={true}
                        value={outPutTokens}
                      />
                    )}
                  </div>
                  <div className="token-input-row">
                    <div className="coin-name">{selectedToken2}</div>
                  </div>
                </div>
              </div>
              <div className="token-input">
                <div className="swap-mode-selector">
                  <div
                    className="swap-mode-selector-content"
                    style={{
                      display: expanded ? "none" : "flex",
                      overflow: "hidden",
                    }}
                  >
                    <img src={InfoLogo} alt="info-logo" />
                    {isDataLoading ? (
                      <div className="loader"></div>
                    ) : (
                      <p>
                        1 {selectedToken1} ={" "}
                        {tokens.token1 !== tokens.token2
                          ? convertToken.toFixed(4)
                          : 1}{" "}
                        {selectedToken2}
                      </p>
                    )}
                  </div>
                  <div
                    style={{
                      display: expanded ? "flex" : "none",
                      width: "100%",
                    }}
                  >
                    Swap mode
                  </div>
                  <div
                    className="accord"
                    style={{
                      width: expanded ? "100%" : "auto",
                    }}
                  >
                    <div
                      style={{
                        display: expanded ? "none" : "flex",
                        overflow: "hidden",
                      }}
                    >
                      <Lottie1 Class="lighteningLottiec1" />
                    </div>
                    <div
                      onClick={() => setExpanded(!expanded)}
                      className="swap-mode-arrowicon"
                    >
                      <img
                        src={arrowWStroke}
                        style={{
                          transform: expanded ? "scale(-1)" : "scale(1)",
                        }}
                        alt="arrow"
                      />
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    height: expanded ? "auto" : 0,
                    overflow: "hidden",
                    transition: "height 0.5s ease-out",
                  }}
                >
                   
                  <div className="modes">
                    <div
                      className="mode-option-notselected"
                      onClick={() => {
                        setFastTxn(true);
                      }}
                      style={{
                        backgroundColor: fastTxn ? "#DFBB00" : "#1D1D23",
                        color: fastTxn ? "#020202" : "white",
                      }}
                    >
                      {!fastTxn ? (
                        <Lottie1 Class="lighteningLottiec2" />
                      ) : (
                        <Lottie1Dark Class="lighteningLottiec2" />
                      )}
                      <span>Lightning = Fast</span>
                    </div>
                    <div
                      className="mode-option-selected"
                      onClick={() => {
                        setFastTxn(false);
                      }}
                      style={{
                        backgroundColor: fastTxn ? "#1D1D23" : "#DFBB00",
                        color: fastTxn ? "white" : "#020202",
                      }}
                    >
                      <LegacyIcon
                        className="leagacy-icon"
                        fill={fastTxn ? "#DFBB00" : "#020202"}
                      />
                      <span>
                        Legacy = <b className="bold">Normal</b>
                      </span>
                    </div>
                  </div>
                  <div className="grid-container">
                    <div className="grid-row">
                      <div>1 {selectedToken1} price</div>
                      <div className="value-desc">
                        <span className="highlighted-token-amount">
                          {tokens.token1 !== tokens.token2
                            ? convertToken.toFixed(5)
                            : 1}{" "}
                          ({selectedToken2})
                        </span>
                      </div>
                    </div>
                    <div className="grid-row">
                      <div>1 {selectedToken2} price</div>
                      <div className="value-desc">
                        <span className="highlighted-token-amount">
                          {tokens.token1 !== tokens.token2
                            ? convertToken
                              ? (1 / convertToken).toFixed(5)
                              : "undefined"
                            : 1}{" "}
                          ({selectedToken1})
                        </span>
                      </div>
                    </div>
                    {/* <div className="grid-row">
                                    <div>
                                        Tx Cost
                                    </div>
                                    <div className="value-desc">
                                        <button className="hidebtn">Hide</button>
                                        <img src={walkingman} className='cursor-pointer refreshIcon' alt="refresh" />
                                        <span className="usd-token-price">($1 588.5)</span>
                                        <span className="highlighted-token-amount">1 581.4 (DAI)</span>
                                    </div>
                                    </div> */}
                  </div>
              </div>
              </div>
              <div className="btn-wrapper">
                {!signer && (
                  <ConnectButton
                    className="dex_connect"
                    chainStatus="none"
                    showBalance={false}
                    accountStatus={"avatar"}
                  />
                )}
                {signer !== undefined && signer !== null && (
                  <button
                    className="connect-wallet-btn dex_connect"
                    onClick={onClickSwap}
                    disabled={isDisabled}
                  >
                    Swap
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="card2">
              <div className="select-token-header">
                <div
                  className="backIcon-div"
                  onClick={() => {
                    setSelectToken1(false);
                    setSelectToken2(false);
                  }}
                >
                  <img
                    src={arrowWStroke}
                    className="arrowIconback"
                    alt="arrow"
                  />
                </div>
                <div className="headingtxt">Select a token</div>
              </div>
              {/* <div className="searchBar">
                        <img src={searchIcon} className="searchIcon" alt="search-icon"/>
                        <input className="search-input" type="text" placeholder="Search by name or paste address" value={searchValue1} onChange=
                        {(event)=>{
                            setSearchValue1(event.target.value)
                        }}/>
                    </div>
                    <div className="token-grid"> */}
              {/* {selectToken1 && tokenMap.map(element => {
                            return (<div className="fav-token cursor-pointer" key={element[0] + element[1]} onClick={() => onClickToken(element, 1)}>
                                {element[2] !== "" ? <img src={require(`../assests/images/webP/${element[2]}`)} alt ="eth-icon" />: <img src={ethIcon} alt ="eth-icon" />}
                                <div>{element[1]}</div>
                            </div>)
                        })} */}
              {selectToken1 && (
                <div className="searchBar">
                  <img
                    src={searchIcon}
                    className="searchIcon"
                    alt="search-icon"
                  />
                  <input
                    className="search-input"
                    type="text"
                    placeholder="Search by name or paste address"
                    value={searchValue1}
                    onChange={(event) => {
                      setSearchValue1(event.target.value);
                    }}
                  />
                </div>
              )}
              {selectToken1 && (
                <>
                  <div className="token-grid">{searchBarValue}</div>
                  <hr></hr>
                  <div className="list">
                    <li className="list_tokens">{searchBarValue_list}</li>
                  </div>
                </>
              )}
              {selectToken2 && (
                <div className="searchBar">
                  <img
                    src={searchIcon}
                    className="searchIcon"
                    alt="search-icon"
                  />
                  <input
                    className="search-input"
                    type="text"
                    placeholder="Search by name or paste address"
                    value={searchValue2}
                    onChange={(event) => {
                      setSearchValue2(event.target.value);
                    }}
                  />
                </div>
              )}
              {selectToken2 && (
                <>
                  <div className="token-grid">{searchBarValue2}</div>
                  <hr></hr>
                  <div className="list">
                    <li className="list_tokens">{searchBarValue_list2}</li>
                  </div>
                </>
              )}
              {/* {selectToken2 && tokenMap.map(element => {
                            return (<div className="fav-token cursor-pointer" key={element[0] + element[1]} onClick={() => onClickToken(element, 2)}>
                                {element[2] !== "" ? <img src={require(`../assests/images/webP/${element[2]}`)} alt ="eth-icon" />: <img src={ethIcon} alt ="eth-icon" />}
                                <div>{element[1]}</div>
                            </div>)
                        })} */}
              {/* <div className="separator"></div>
                    <div className="select-accordion">
                        <div className="token-choice">
                            <img src={ethIcon} alt ="eth-icon" />
                            <div className="">
                            <div className="token-name">
                                 Ethereum
                            </div>
                            <div className="token-symbol">ETH</div>
                            </div>
                            <div className="pinned">
                                <div>0</div>
                                <img src={pin} className="pin-align" alt="pin" />
                            </div>
                        </div>
                        <div className="token-choice">
                            <img src={ethIcon} alt ="eth-icon" />
                            <div className="">
                            <div className="token-name">
                                 Ethereum
                            </div>
                            <div className="token-symbol">ETH</div>
                            </div>
                            <div className="pinned">
                                <div>0</div>
                                <img src={highlightedpin} className="pin-align" alt="pin" />
                            </div>
                        </div>
                        <div className="token-choice">
                            <img src={ethIcon} alt ="eth-icon" />
                            <div className="">
                            <div className="token-name">
                                 Ethereum
                            </div>
                            <div className="token-symbol">ETH</div>
                            </div>
                        </div>
                    </div> */}
            </div>
          )}
          <div className="img-wrapper">
            <img className="lionImage" src={lionImage} alt="lionImage" />
          </div>
        </div>
      ) : (
        <div className="setting-component">
          <div className="setting-wrapper">
            <button
              className="back-button no-style"
              onClick={() => setIsSetting(false)}
            >
              <img src={backBtn} alt="" />
            </button>
            <div className="setting-container">
              <h1>Slippage tolerance</h1>
              <ul className="slippage">
                <li
                  className="slippage-item flex-center"
                  style={{
                    backgroundColor:
                      slippage === 1
                        ? "rgba(223, 187, 0, 1)"
                        : "rgba(37, 37, 45, 1)",
                    color:
                      slippage !== 1
                        ? "rgba(153, 153, 153, 1)"
                        : "rgba(23, 24, 29, 1)",
                  }}
                >
                  <button
                    className="no-style"
                    onClick={() => {
                      setSlippage(1);
                      setSlippage1(0.1);
                    }}
                  >
                    0.1%
                  </button>
                </li>
                <li
                  className="slippage-item flex-center"
                  style={{
                    backgroundColor:
                      slippage === 2
                        ? "rgba(223, 187, 0, 1)"
                        : "rgba(37, 37, 45, 1)",
                    color:
                      slippage !== 2
                        ? "rgba(153, 153, 153, 1)"
                        : "rgba(23, 24, 29, 1)",
                  }}
                >
                  <button
                    className="no-style"
                    onClick={() => {
                      setSlippage(2);
                      setSlippage1(0.5);
                    }}
                  >
                    0.5%
                  </button>
                </li>
                <li
                  className="slippage-item flex-center"
                  style={{
                    backgroundColor:
                      slippage === 3
                        ? "rgba(223, 187, 0, 1)"
                        : "rgba(37, 37, 45, 1)",
                    color:
                      slippage !== 3
                        ? "rgba(153, 153, 153, 1)"
                        : "rgba(23, 24, 29, 1)",
                  }}
                >
                  <button
                    className="no-style"
                    onClick={() => {
                      setSlippage(3);
                      setSlippage1(1.0);
                    }}
                  >
                    1.0%
                  </button>
                </li>
                <li className="slippage-item">
                  <input
                    className="setting-input"
                    type="text"
                    value={slippage1}
                    onChange={(event) => {
                      setSlippage1(event.target.value);
                      const temp = parseFloat(event.target.value);
                      if (temp === 0.1) setSlippage(1);
                      else if (temp === 0.5) setSlippage(2);
                      else if (temp === 1) setSlippage(3);
                      else setSlippage(4);
                    }}
                  />
                </li>
              </ul>
              <div className="tx-deadline">
                <h1>Tx deadline (mins)</h1>
                <input
                  className="setting-input"
                  type="text"
                  value={deadline}
                  onChange={(event) => {
                    onChangeInput(event);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
