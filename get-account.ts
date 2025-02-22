import { getKeypairFromFile } from '@solana-developers/helpers';
import { clusterApiUrl, Connection } from '@solana/web3.js';

const main = async (): Promise<void> => {
  const connection = new Connection(clusterApiUrl('devnet'));

  const keypair = await getKeypairFromFile('./account1/keypair.json');
  const accountInfo = await connection.getAccountInfo(keypair.publicKey);
  console.log(JSON.stringify(accountInfo, null, 2));
};

main().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(-1);
  },
);

