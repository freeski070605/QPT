export async function createCashAppInstruction() {
  return {
    provider: "cashapp",
    status: "manual",
    message: "Show cashtag and upload payment proof."
  };
}
