"use client";

import { useState } from "react";

export default function Documentation() {
  const [activeSection, setActiveSection] = useState("overview");

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
        {/* Documentation Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary-content">
            <span className="text-warning">⛏️ TIME MINER</span>
          </h1>
          <div className="divider divider-warning">Official Documentation</div>
        </div>

        {/* Navigation Tabs */}
        <div className="tabs tabs-boxed mb-6 justify-center">
          <a
            className={`tab ${activeSection === "overview" ? "tab-active" : ""}`}
            onClick={() => setActiveSection("overview")}
          >
            Overview
          </a>
          <a
            className={`tab ${activeSection === "mechanics" ? "tab-active" : ""}`}
            onClick={() => setActiveSection("mechanics")}
          >
            Mechanics
          </a>
          <a
            className={`tab ${activeSection === "miners" ? "tab-active" : ""}`}
            onClick={() => setActiveSection("miners")}
          >
            Miners
          </a>
          <a
            className={`tab ${activeSection === "summary" ? "tab-active" : ""}`}
            onClick={() => setActiveSection("summary")}
          >
            Summary
          </a>
        </div>

        {/* Content Section */}
        <div className="card bg-base-200 shadow-xl mb-6">
          <div className="card-body">
            {/* Overview Section */}
            {activeSection === "overview" && (
              <section>
                <h2 className="card-title text-2xl mb-4">
                  <span className="text-warning">🚀</span> Basic Gameplay Overview
                </h2>
                <div className="space-y-4">
                  <p>
                    Welcome to Time Miner, a blockchain mining game where you collect $ORE by purchasing and upgrading
                    miners.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-base-300 p-4 rounded-lg">
                      <h3 className="font-bold text-lg flex items-center mb-2">
                        <span className="text-warning mr-2">💰</span> Getting Started
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Buy Miners using MON to begin your mining operation</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Each Miner automatically mines $ORE over time based on its Power Level</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Claim your mined $ORE tokens anytime to transfer them to your wallet</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-base-300 p-4 rounded-lg">
                      <h3 className="font-bold text-lg flex items-center mb-2">
                        <span className="text-warning mr-2">⚡</span> Power & Upgrades
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Each Miner has a Power Level that determines mining speed</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Upgrade Miners to increase their Power Level and mining output</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Higher tier miners provide greater power at maximum levels</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Mechanics Section */}
            {activeSection === "mechanics" && (
              <section>
                <h2 className="card-title text-2xl mb-4">
                  <span className="text-warning">⚙️</span> Core Mechanics
                </h2>
                <div className="space-y-4">
                  <div className="bg-base-300 p-4 rounded-lg mb-4">
                    <h3 className="font-bold text-lg mb-2">Mining Formula</h3>
                    <p>Your mining rate is calculated using this formula:</p>
                    <div className="bg-base-100 p-3 rounded mt-2 font-mono text-sm">
                      Your Mining Rate = (Your Total Power / Global Total Power) × Global Mining Rate
                    </div>
                  </div>

                  <h3 className="text-xl font-bold flex items-center">
                    <span className="text-warning mr-2">🪙</span> Global Halving Rules
                  </h3>
                  <p className="mb-2">The global mining rate reduces ("halving") as more $ORE is mined:</p>

                  <div className="overflow-x-auto">
                    <table className="table table-zebra w-full bg-base-300">
                      <thead>
                        <tr>
                          <th className="bg-base-200">Total Global Mined $ORE</th>
                          <th className="bg-base-200">Max Mining Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Less than 468,750</td>
                          <td className="text-success">100 ORE/sec</td>
                        </tr>
                        <tr>
                          <td>Less than 937,500</td>
                          <td className="text-success">50 ORE/sec</td>
                        </tr>
                        <tr>
                          <td>Less than 1,875,000</td>
                          <td className="text-success">25 ORE/sec</td>
                        </tr>
                        <tr>
                          <td>Less than 3,750,000</td>
                          <td className="text-success">12 ORE/sec</td>
                        </tr>
                        <tr>
                          <td>Less than 7,500,000</td>
                          <td className="text-success">6 ORE/sec</td>
                        </tr>
                        <tr>
                          <td>Less than 15,000,000</td>
                          <td className="text-success">3 ORE/sec</td>
                        </tr>
                        <tr>
                          <td>Less than 22,500,000</td>
                          <td className="text-success">2 ORE/sec</td>
                        </tr>
                        <tr>
                          <td>Rest of Supply</td>
                          <td className="text-success">1 ORE/sec</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="alert alert-warning mt-4">
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
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      ></path>
                    </svg>
                    <span>Important: Mining becomes progressively more difficult as the global supply is mined!</span>
                  </div>
                </div>
              </section>
            )}

            {/* Miners Section */}
            {activeSection === "miners" && (
              <section>
                <h2 className="card-title text-2xl mb-4">
                  <span className="text-warning">⛏️</span> Miner Types and Levels
                </h2>

                <div className="grid grid-cols-1 gap-6">
                  {/* Miner Alpha */}
                  <div className="card bg-base-300 shadow-lg">
                    <div className="card-body">
                      <h3 className="card-title">
                        <span className="text-2xl mr-2">⛏️</span> Miner 1
                      </h3>
                      <p className="text-sm mb-2">The basic miner, affordable but with lower power output</p>
                      <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                          <thead>
                            <tr>
                              <th>Level</th>
                              <th>Image</th>
                              <th>Name</th>
                              <th>Upgrade Cost (MON)</th>
                              <th>Power</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1</td>
                              <td><img src="/img/1-1.jpg" alt="Genesis Miner" className="w-16 h-16 rounded" /></td>
                              <td>Genesis Miner</td>
                              <td>0.1 (Initial Cost)</td>
                              <td>1</td>
                            </tr>
                            <tr>
                              <td>2</td>
                              <td><img src="/img/1-2.jpg" alt="Fusion Miner" className="w-16 h-16 rounded" /></td>
                              <td>Fusion Miner</td>
                              <td>0.025</td>
                              <td>2</td>
                            </tr>
                            <tr>
                              <td>3</td>
                              <td><img src="/img/1-3.jpg" alt="Nova Miner" className="w-16 h-16 rounded" /></td>
                              <td>Nova Miner</td>
                              <td>0.05</td>
                              <td>3</td>
                            </tr>
                            <tr>
                              <td>4</td>
                              <td><img src="/img/1-4.jpg" alt="Quantum Miner" className="w-16 h-16 rounded" /></td>
                              <td>Quantum Miner</td>
                              <td>0.1</td>
                              <td>4</td>
                            </tr>
                            <tr>
                              <td>5</td>
                              <td><img src="/img/1-5.jpg" alt="Singularity Miner" className="w-16 h-16 rounded" /></td>
                              <td>Singularity Miner</td>
                              <td>0.2</td>
                              <td>5</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Miner Beta */}
                  <div className="card bg-base-300 shadow-lg">
                    <div className="card-body">
                      <h3 className="card-title">
                        <span className="text-2xl mr-2">⚒️</span> Miner 2
                      </h3>
                      <p className="text-sm mb-2">Mid-tier miner with balanced cost and performance</p>
                      <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                          <thead>
                            <tr>
                              <th>Level</th>
                              <th>Image</th>
                              <th>Name</th>
                              <th>Upgrade Cost (MON)</th>
                              <th>Power</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1</td>
                              <td><img src="/img/2-1.jpg" alt="Pioneer Rig" className="w-16 h-16 rounded" /></td>
                              <td>Pioneer Rig</td>
                              <td>0.4 (Initial Cost)</td>
                              <td>1</td>
                            </tr>
                            <tr>
                              <td>2</td>
                              <td><img src="/img/2-2.jpg" alt="Vanguard Rig" className="w-16 h-16 rounded" /></td>
                              <td>Vanguard Rig</td>
                              <td>0.15</td>
                              <td>2</td>
                            </tr>
                            <tr>
                              <td>3</td>
                              <td><img src="/img/2-3.jpg" alt="Titan Rig" className="w-16 h-16 rounded" /></td>
                              <td>Titan Rig</td>
                              <td>0.25</td>
                              <td>3</td>
                            </tr>
                            <tr>
                              <td>4</td>
                              <td><img src="/img/2-4.jpg" alt="Eclipse Rig" className="w-16 h-16 rounded" /></td>
                              <td>Eclipse Rig</td>
                              <td>0.5</td>
                              <td>4</td>
                            </tr>
                            <tr>
                              <td>5</td>
                              <td><img src="/img/2-5.jpg" alt="Infinity Rig" className="w-16 h-16 rounded" /></td>
                              <td>Infinity Rig</td>
                              <td>0.7</td>
                              <td>5</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Miner Gamma */}
                  <div className="card bg-base-300 shadow-lg">
                    <div className="card-body">
                      <h3 className="card-title">
                        <span className="text-2xl mr-2">⚙️</span> Miner 3
                      </h3>
                      <p className="text-sm mb-2">Premium miner with highest power output potential</p>
                      <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                          <thead>
                            <tr>
                              <th>Level</th>
                              <th>Image</th>
                              <th>Name</th>
                              <th>Upgrade Cost (MON)</th>
                              <th>Power</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1</td>
                              <td><img src="/img/3-1.jpg" alt="Pulse Core" className="w-16 h-16 rounded" /></td>
                              <td>Pulse Core</td>
                              <td>1.0 (Initial Cost)</td>
                              <td>2</td>
                            </tr>
                            <tr>
                              <td>2</td>
                              <td><img src="/img/3-2.jpg" alt="Blaze Core" className="w-16 h-16 rounded" /></td>
                              <td>Blaze Core</td>
                              <td>0.5</td>
                              <td>4</td>
                            </tr>
                            <tr>
                              <td>3</td>
                              <td><img src="/img/3-3.jpg" alt="Hyper Core" className="w-16 h-16 rounded" /></td>
                              <td>Hyper Core</td>
                              <td>1.0</td>
                              <td>6</td>
                            </tr>
                            <tr>
                              <td>4</td>
                              <td><img src="/img/3-4.jpg" alt="Aether Core" className="w-16 h-16 rounded" /></td>
                              <td>Aether Core</td>
                              <td>1.25</td>
                              <td>8</td>
                            </tr>
                            <tr>
                              <td>5</td>
                              <td><img src="/img/3-5.jpg" alt="Omni Core" className="w-16 h-16 rounded" /></td>
                              <td>Omni Core</td>
                              <td>1.25</td>
                              <td>10</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
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
                    <span>
                      Mining Tip: Miner Gamma costs more but provides double the power of other miners at the same
                      level!
                    </span>
                  </div>
                </div>
              </section>
            )}

            {/* Summary Section */}
            {activeSection === "summary" && (
              <section>
                <h2 className="card-title text-2xl mb-4">
                  <span className="text-warning">📜</span> Summary
                </h2>

                <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-300 w-full mb-6">
                  <div className="stat">
                    <div className="stat-title">Total $ORE Supply</div>
                    <div className="stat-value text-success">30,000,000</div>
                    <div className="stat-desc">Maximum minable amount</div>
                  </div>

                  <div className="stat">
                    <div className="stat-title">Halving Events</div>
                    <div className="stat-value text-info">7</div>
                    <div className="stat-desc">Mining difficulty increases</div>
                  </div>

                  <div className="stat">
                    <div className="stat-title">Max Miner Level</div>
                    <div className="stat-value text-warning">5</div>
                    <div className="stat-desc">For all miner types</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-base-300 p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">Key Game Features</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>On-chain mining simulation</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Claim rewards anytime (real ERC-20 tokens)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Automatic mining (passive income)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Halving events make mining harder over time</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-base-300 p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">Strategy Tips</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Invest early for maximum returns</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Balance between different miner types</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Upgrade strategically before halvings</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Higher power = bigger share of global mining rate</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="card bg-base-300 p-4 mt-4">
                  <div className="card-body p-2">
                    <h3 className="text-lg font-bold">Ready to Start Mining?</h3>
                    <p className="mb-4">Join thousands of miners excavating digital treasures from the blockchain!</p>
                    <div className="card-actions justify-end">
                      <a href="https://timeminer.vercel.app/" className="btn btn-primary">Go to Time Miner</a>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Mining Tips Footer */}
        <div className="mt-8 opacity-80 text-sm">
          <div className="alert alert-warning mb-2">
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
            <span>
              Important: This is a decentralized application (dApp). All transactions require MON for gas fees.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
