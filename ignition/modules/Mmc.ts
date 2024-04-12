import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MmcModule = buildModule("MmcModule", (m) => {
  const Mmc = m.contract("Mmc");
  return { Mmc };
});
export default MmcModule;
