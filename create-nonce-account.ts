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

  const keypair = await getKeypairFromFile('./account1/keypair.json');
  const nonceAccountKeypair = await getKeypairFromFile('./nonce1/keypair.json');
  const noncePubkey = nonceAccountKeypair.publicKey;

  const accountInfo = await connection.getAccountInfo(keypair.publicKey);
  console.log(JSON.stringify(accountInfo, null, 2));

  const rent =
    await connection.getMinimumBalanceForRentExemption(NONCE_ACCOUNT_LENGTH);
  console.log(`rent:${rent}`);

  const createNonceAccountInstruction = SystemProgram.createNonceAccount({
    fromPubkey: keypair.publicKey,
    noncePubkey,
    authorizedPubkey: keypair.publicKey,
    lamports: rent,
  });

  const transaction = new Transaction();
  transaction.add(createNonceAccountInstruction);

  const signature = await sendAndConfirmTransaction(connection, transaction, [
    keypair,
    nonceAccountKeypair,
  ]);
  console.log(`Transaction sent: ${signature}`);

  const nonceAccount = await connection.getNonce(noncePubkey, 'confirmed');
  console.log(`nonceAccount: ${JSON.stringify(nonceAccount, null, 2)}`);
};

main().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(-1);
  },
);
