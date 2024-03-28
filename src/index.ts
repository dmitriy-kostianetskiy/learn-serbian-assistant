import { conjugate } from './conjugation/conjugator';

async function main(): Promise<void> {
  const response = await conjugate('putovati');

  console.log(response);
}

main()
  .then(() => process.exit(0))
  .catch(console.error);
