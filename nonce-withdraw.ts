import { getKeypairFromFile } from '@solana-developers/helpers';
import {
  clusterApiUrl,
  Connection,
  NONCE_ACCOUNT_LENGTH,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';

const main = async (): Promise<void> => {
  const connection = new Connection(clusterApiUrl('devnet'));

  const keypair1 = await getKeypairFromFile('./account1/keypair.json');
  const keypair2 = await getKeypairFromFile('./account2/keypair.json');
  const nonceAccountKeypair = await getKeypairFromFile('./nonce1/keypair.json');
  const noncePubkey = nonceAccountKeypair.publicKey;

  const rent =
    await connection.getMinimumBalanceForRentExemption(NONCE_ACCOUNT_LENGTH);
  console.log(`rent:${rent}`);

  const nonceWithdrawInstruction = SystemProgram.nonceWithdraw({
    noncePubkey,
    authorizedPubkey: keypair1.publicKey,
    toPubkey: keypair2.publicKey,
    lamports: rent
  });

  const transaction = new Transaction();
  transaction.add(nonceWithdrawInstruction);

  const signature = await sendAndConfirmTransaction(connection, transaction, [
    keypair1,
  ]);
  console.log(`Transaction sent: ${signature}`);
};

main().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(-1);
  },
);
