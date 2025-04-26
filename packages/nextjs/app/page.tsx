"use client";

import { useEffect, useState } from "react";
import { formatUnits, parseEther } from "viem/utils";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function TimeMiner() {
  const { address } = useAccount();
  const [buyHover, setBuyHover] = useState([false, false, false]);
  const [claimHover, setClaimHover] = useState(false);
  const [selectedMiner, setSelectedMiner] = useState(1);

  // Hook to fetch user stats (number of miners and total mined)
  const { data: userStats, refetch: refetchUserStats } = useScaffoldReadContract({
    contractName: "TimeMiner",
    functionName: "getUserStats",
    args: [address],
  });

  // Hook to fetch individual miner stats for all possible miners
  const [minerStats, setMinerStats] = useState([null, null, null]);

  // Fetch stats for each miner separately
  const { data: miner1Stats, refetch: refetchMiner1Stats } = useScaffoldReadContract({
    contractName: "TimeMiner",
    functionName: "getMinerStats",
    args: [address, 1],
    enabled: !!address,
  });

  const { data: miner2Stats, refetch: refetchMiner2Stats } = useScaffoldReadContract({
    contractName: "TimeMiner",
    functionName: "getMinerStats",
    args: [address, 2],
    enabled: !!address,
  });

  const { data: miner3Stats, refetch: refetchMiner3Stats } = useScaffoldReadContract({
    contractName: "TimeMiner",
    functionName: "getMinerStats",
    args: [address, 3],
    enabled: !!address,
  });

  // Hook to fetch the current global mining rate
  const { data: currentRate, refetch: refetchRate } = useScaffoldReadContract({
    contractName: "TimeMiner",
    functionName: "getCurrentMiningRate",
    args: undefined,
  });

  // Hook to fetch the total global power
  const { data: totalPower, refetch: refetchTotalPower } = useScaffoldReadContract({
    contractName: "TimeMiner",
    functionName: "getTotalGlobalPower",
    args: undefined,
  });

  // Combine miner stats when they change
  useEffect(() => {
    const newMinerStats = [
      miner1Stats ? miner1Stats : null,
      miner2Stats ? miner2Stats : null,
      miner3Stats ? miner3Stats : null,
    ];
    setMinerStats(newMinerStats);
  }, [miner1Stats, miner2Stats, miner3Stats]);

  // Contract write functions
  const { writeContractAsync: buyMinerAsync } = useScaffoldWriteContract({ contractName: "TimeMiner" });
  const { writeContractAsync: upgradeMinerAsync } = useScaffoldWriteContract({ contractName: "TimeMiner" });
  const { writeContractAsync: claimOreAsync } = useScaffoldWriteContract({ contractName: "TimeMiner" });

  // Miner type costs (from contract)
  const MINER_INITIAL_COSTS = ["0.1", "0.4", "1.0"];
  const MINER_UPGRADE_COSTS = [
    ["0.025", "0.05", "0.1", "0.2"],
    ["0.15", "0.25", "0.5", "0.7"],
    ["0.5", "1.0", "1.25", "2.25"],
  ];

  // Handle buying a new miner
  const handleBuyMiner = async minerType => {
    try {
      await buyMinerAsync({
        functionName: "buyMiner",
        args: [minerType],
        value: parseEther(MINER_INITIAL_COSTS[minerType - 1]),
      });
      refetchAll();
    } catch (error) {
      console.error(`Error buying miner ${minerType}:`, error);
    }
  };

  // Handle upgrading a miner
  const handleUpgradeMiner = async minerType => {
    try {
      const minerData = minerStats[minerType - 1];
      if (!minerData || !minerData[0]) {
        console.error("Miner doesn't exist");
        return;
      }

      const level = Number(minerData[1]);
      if (level >= 5) {
        alert("Max level reached");
        return;
      }

      const cost = MINER_UPGRADE_COSTS[minerType - 1][level - 1];
      await upgradeMinerAsync({
        functionName: "upgradeMiner",
        args: [minerType],
        value: parseEther(cost),
      });
      refetchAll();
    } catch (error) {
      console.error(`Error upgrading miner ${minerType}:`, error);
    }
  };

  // Handle claiming ORE
  const handleClaimOre = async () => {
    try {
      await claimOreAsync({ functionName: "claimOre" });
      refetchAll();
    } catch (error) {
      console.error("Error claiming ore:", error);
    }
  };

  // Refetch all data
  const refetchAll = () => {
    refetchUserStats();
    refetchMiner1Stats();
    refetchMiner2Stats();
    refetchMiner3Stats();
    refetchRate();
    refetchTotalPower();
  };

  // Define decimals for ORE token
  const oreDecimals = 18;

  // Effect to refetch stats, rate, and total power periodically
  useEffect(() => {
    const interval = setInterval(() => {
      refetchAll();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Calculate total mining power for the user
  const calculateUserTotalPower = () => {
    let totalUserPower = 0n;
    minerStats.forEach(stats => {
      if (stats && stats[0]) {
        // If miner exists
        totalUserPower += stats[2]; // Add its power
      }
    });
    return totalUserPower;
  };

  // Calculate Individual Mining Rate
  const calculateIndividualRate = () => {
    if (!currentRate || !totalPower || totalPower <= 0n) return 0n;

    const userTotalPower = calculateUserTotalPower();
    return (userTotalPower * currentRate) / totalPower;
  };

  // Format number with commas
  const formatNumber = value => {
    if (!value && value !== 0) return "...";
    return new Intl.NumberFormat().format(value.toString());
  };

  // Calculate total unclaimed ORE across all miners
  const calculateTotalUnclaimed = () => {
    let total = 0n;
    minerStats.forEach(stats => {
      if (stats && stats[0]) {
        // If miner exists
        total += stats[4]; // Add unclaimed ore
      }
    });
    return total;
  };

  // Calculate total mined ORE
  const calculateTotalMined = () => {
    return userStats?.[1] || 0n;
  };

  // Get upgrade cost based on miner type and level
  const getUpgradeCost = minerType => {
    const stats = minerStats[minerType - 1];
    if (!stats || !stats[0]) return "N/A";

    const level = Number(stats[1]);
    if (level >= 5) return "MAX";

    return MINER_UPGRADE_COSTS[minerType - 1][level - 1];
  };

  // Calculate power level percentage for progress bar
  const getPowerLevelPercentage = minerType => {
    const stats = minerStats[minerType - 1];
    if (!stats || !stats[0]) return 0;

    const level = stats[1];
    return Math.min(Number(level) * 20, 100); // 5 levels = 20% each
  };

  // Get miner emoji based on type and level
  const getMinerEmoji = (minerType, level) => {
    if (minerType === 1) {
      return ["🛠️", "⚙️", "💡", "🛰️", "🌌"][level - 1];
    } else if (minerType === 2) {
      return ["🏗️", "🚧", "🏭", "⚡", "🌠"][level - 1];
    } else {
      return ["🔋", "🔥", "⚡", "💎", "🚀"][level - 1];
    }
  };

  // Get miner name based on type and level
  const getMinerName = (minerType, level) => {
    if (minerType === 1) {
      return ["Genesis", "Fusion", "Nova", "Quantum", "Singularity"][level - 1] + " Miner";
    } else if (minerType === 2) {
      return ["Pioneer", "Vanguard", "Titan", "Eclipse", "Infinity"][level - 1] + " Rig";
    } else {
      return ["Pulse", "Blaze", "Hyper", "Aether", "Omni"][level - 1] + " Core";
    }
  };

  // Check if user has any miners
  const hasMiners = userStats && userStats[0] > 0n;

  return (
    <div
      className="min-h-screen text-white p-4 md:p-6"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url('/img/BG.jpeg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Game Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary-content">
            <span className="text-warning">⛏️ TIME MINER</span>
          </h1>
          <div className="divider divider-warning">Mine the blockchain for $ORE</div>
        </div>

        {/* Global Stats Card */}
        <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-300 w-full mb-6">
          <div className="stat">
            <div className="stat-title">Global Mining Rate</div>
            <div className="stat-value text-info text-xl md:text-2xl">
              {currentRate !== undefined ? Number(formatUnits(currentRate, oreDecimals)).toFixed(3) : "..."}
            </div>
            <div className="stat-desc">$ORE / block time</div>
          </div>

          <div className="stat">
            <div className="stat-title">Global Mining Power</div>
            <div className="stat-value text-info text-xl md:text-2xl">
              {totalPower !== undefined ? formatNumber(totalPower) : "..."}
            </div>
            <div className="stat-desc">Total network hashpower</div>
          </div>

          {hasMiners && (
            <div className="stat">
              <div className="stat-title">Your Mining Rate</div>
              <div className="stat-value text-info text-xl md:text-2xl">
                {currentRate !== undefined
                  ? Number(formatUnits(calculateIndividualRate(), oreDecimals)).toFixed(5)
                  : "..."}
              </div>
              <div className="stat-desc">$ORE / block time</div>
            </div>
          )}
        </div>

        {hasMiners ? (
          <>
            {/* Miner Navigation */}
            <div className="tabs tabs-boxed mb-6 justify-center">
              {minerStats.map((stats, index) => {
                const minerType = index + 1;
                if (!stats || !stats[0]) return null; // Skip if miner doesn't exist

                return (
                  <a
                    key={minerType}
                    className={`tab ${selectedMiner === minerType ? "tab-active" : ""}`}
                    onClick={() => setSelectedMiner(minerType)}
                  >
                    {`Miner ${minerType}`}
                  </a>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Miner Status Card */}
              <div className="card bg-base-200 shadow-xl col-span-1">
                <div className="card-body">
                  <h2 className="card-title">
                    <span className="text-warning">🛠️</span> Miner {selectedMiner} Status :
                  </h2>

                  {minerStats[selectedMiner - 1] && minerStats[selectedMiner - 1][0] ? (
                    <>
                      {/* Miner image placeholder based on level and type */}
                      <div className="flex flex-col items-center my-4">
                        <div className="relative w-full aspect-square bg-base-300 rounded-lg overflow-hidden flex items-center justify-center mb-2">
                          {/* Miner level indicator */}
                          <div className="absolute top-2 right-2 badge badge-warning">
                            Level {minerStats[selectedMiner - 1][1]?.toString()}
                          </div>

                          {/* Miner GIF */}
                          <img
                            src={`/img/${selectedMiner}-${minerStats[selectedMiner - 1][1]?.toString()}.jpg`}
                            alt={`Level ${minerStats[selectedMiner - 1][1]?.toString()} Miner ${selectedMiner}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Moved name and emoji below the box */}
                        <div className="text-center">
                          <div className="text-4xl mb-1">
                            {getMinerEmoji(selectedMiner, Number(minerStats[selectedMiner - 1][1]))}
                          </div>
                          <div className="text-lg font-bold">
                            {getMinerName(selectedMiner, Number(minerStats[selectedMiner - 1][1]))}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span>Power: {minerStats[selectedMiner - 1][2]?.toString()}</span>
                          <span className="text-warning">Level {minerStats[selectedMiner - 1][1]?.toString()}/5</span>
                        </div>
                        <progress
                          className="progress progress-warning w-full"
                          value={getPowerLevelPercentage(selectedMiner)}
                          max="100"
                        ></progress>
                      </div>

                      <div className="stats bg-base-300 shadow mb-4">
                        <div className="stat p-2 text-sm">
                          <div className="stat-title">Total Mined</div>
                          <div className="stat-value text-success text-lg">
                            {minerStats[selectedMiner - 1]?.[3] !== undefined
                              ? Number(formatUnits(minerStats[selectedMiner - 1][3], oreDecimals)).toFixed(3)
                              : "..."}
                          </div>
                        </div>
                        <div className="stat p-2 text-sm">
                          <div className="stat-title">Unclaimed</div>
                          <div className="stat-value text-info text-lg">
                            {minerStats[selectedMiner - 1]?.[4] !== undefined
                              ? Number(formatUnits(minerStats[selectedMiner - 1][4], oreDecimals)).toFixed(3)
                              : "..."}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center">
                        {minerStats[selectedMiner - 1] && (
                          <button
                            className={`btn btn-warning btn-block ${minerStats[selectedMiner - 1][1] >= 5n ? "btn-disabled" : ""}`}
                            onClick={() => handleUpgradeMiner(selectedMiner)}
                          >
                            {minerStats[selectedMiner - 1][1] >= 5n
                              ? "Max Level"
                              : `Upgrade Miner (${getUpgradeCost(selectedMiner)} ETH)`}
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <p className="text-center mb-4">This miner is not purchased yet.</p>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleBuyMiner(selectedMiner)}
                        onMouseEnter={() => {
                          const newHover = [...buyHover];
                          newHover[selectedMiner - 1] = true;
                          setBuyHover(newHover);
                        }}
                        onMouseLeave={() => {
                          const newHover = [...buyHover];
                          newHover[selectedMiner - 1] = false;
                          setBuyHover(newHover);
                        }}
                      >
                        {buyHover[selectedMiner - 1]
                          ? `Cost: ${MINER_INITIAL_COSTS[selectedMiner - 1]} ETH`
                          : `Buy Miner ${selectedMiner}`}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Mining Progress Card */}
              <div className="card bg-base-200 shadow-xl col-span-1 md:col-span-2">
                <div className="card-body">
                  <h2 className="card-title">
                    <span className="text-success">💎</span> $ORE Resources
                  </h2>
                  <div className="stats bg-base-300 shadow mt-2">
                    <div className="stat">
                      <div className="stat-title">Total Mined</div>
                      <div className="stat-value text-success">
                        {Number(formatUnits(calculateTotalMined(), oreDecimals)).toFixed(3)}
                      </div>
                      <div className="stat-desc">$ORE lifetime</div>
                    </div>
                    <div className="stat">
                      <div className="stat-title">Unclaimed</div>
                      <div className="stat-value text-info">
                        {Number(formatUnits(calculateTotalUnclaimed(), oreDecimals)).toFixed(3)}
                      </div>
                      <div className="stat-desc">Ready to claim</div>
                    </div>
                  </div>

                  <div className="flex justify-center mt-4">
                    <button
                      className="btn btn-success btn-block"
                      onClick={handleClaimOre}
                      onMouseEnter={() => setClaimHover(true)}
                      onMouseLeave={() => setClaimHover(false)}
                      disabled={calculateTotalUnclaimed() <= 0n}
                    >
                      {claimHover ? "Transfer to wallet" : "Claim $ORE"}
                    </button>
                  </div>

                  {/* Miner Collection */}
                  <div className="mt-6">
                    <h3 className="font-bold mb-2">Your Miner Collection</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map(minerType => {
                        const stats = minerStats[minerType - 1];
                        const exists = stats && stats[0];

                        return (
                          <div
                            key={minerType}
                            className={`bg-base-300 p-2 rounded-lg text-center cursor-pointer ${selectedMiner === minerType ? "ring-2 ring-warning" : ""}`}
                            onClick={() => setSelectedMiner(minerType)}
                          >
                            {exists ? (
                              <>
                                <div className="text-2xl">{getMinerEmoji(minerType, Number(stats[1]))}</div>
                                <div className="text-xs">Level {stats[1]?.toString()}</div>
                              </>
                            ) : (
                              <>
                                <div className="text-2xl opacity-50">❓</div>
                                <div className="text-xs">Locked</div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body items-center text-center">
              <h2 className="card-title text-2xl mb-4">Start Your Mining Journey!</h2>
              <p className="mb-4">Purchase your first miner to begin collecting valuable $ORE from the blockchain.</p>
              <div className="card-actions">
                <button
                  className="btn btn-lg btn-primary"
                  onClick={() => handleBuyMiner(1)}
                  onMouseEnter={() => {
                    const newHover = [...buyHover];
                    newHover[0] = true;
                    setBuyHover(newHover);
                  }}
                  onMouseLeave={() => {
                    const newHover = [...buyHover];
                    newHover[0] = false;
                    setBuyHover(newHover);
                  }}
                >
                  {buyHover[0] ? "Cost: 0.1 ETH" : "Buy First Miner"}
                </button>
              </div>
              <div className="mt-6 text-success">
                <p className="opacity-75">Join thousands of miners excavating digital treasures!</p>
              </div>
            </div>
          </div>
        )}

        {/* Mining Tips */}
        <div className="mt-8 opacity-80 text-sm">
          <div className="alert alert-info mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>Mining Tip: Different miners have different power levels. Higher tier miners yield more $ORE!</span>
          </div>
          <div className="alert alert-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>Mining Tip: Upgrading a miner automatically claims its unclaimed $ORE!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
