import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployTimeMiner: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deploy } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();

  await deploy("TimeMiner", {
    from: deployer,
    args: [],
    log: true,
  });
};

export default deployTimeMiner;

deployTimeMiner.tags = ["TimeMiner"];
