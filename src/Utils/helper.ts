import { getTxHex } from "../API/Resources";

export const estimateFee = (
  signer,
  psbt,
  sender,
  remainBal,
  feeRate /* satoshis per byte */
) => {
  const tPsbt = psbt.clone();
  tPsbt.addOutput({ address: sender, value: remainBal });
  tPsbt.signAllInputs(signer);
  tPsbt.finalizeAllInputs();
  const estTx = tPsbt.extractTransaction(true);
  const vBytes = estTx.virtualSize();
  const finalFee = vBytes * feeRate + 1;
  return { finalFee };
};

export const buildInputsFromUtxos = async (utxos) => {
  const inputs = [];
  for (const utxo of utxos) {
    const input = { hash: utxo.txid, index: utxo.vout };
    const hex = await getTxHex(utxo.txid);
    if (!hex) throw "Unable to get Hex";
    input["nonWitnessUtxo"] = Buffer.from(hex, "hex");
    inputs.push(input);
  }
  return inputs;
};

export const checkEnoughBalace = (totalUnspent, finalFee, satoshiToSend) => {
  const DUST_THRESHOLD = 546;
  if (totalUnspent < finalFee + satoshiToSend + DUST_THRESHOLD) {
    throw `Total less than fee + amount + DUST_THRESHOLD: ${totalUnspent} < ${finalFee} + ${satoshiToSend} + ${DUST_THRESHOLD}`;
  }
};

export const remainingBalaceAndFee = (
  utxos,
  satoshiToSend,
  signer,
  psbt,
  to_address
) => {
  const totalUnspent = utxos.reduce((sum, { value }) => sum + value, 0);
  const remainBal = Math.floor(totalUnspent - satoshiToSend);
  const { finalFee } = estimateFee(signer, psbt, to_address, remainBal, 1);
  checkEnoughBalace(totalUnspent, finalFee, satoshiToSend);
  return { remainingBalance: remainBal - finalFee, fee: finalFee };
};

export function getTransactionStatus(confirmations, confirmedDate) {
  if (confirmations === 0) {
    return "Pending";
  } else if (confirmedDate) {
    return "Completed";
  } else {
    return "Failed";
  }
}
