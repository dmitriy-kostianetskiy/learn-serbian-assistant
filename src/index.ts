import { assist } from './assistant/assist';

async function main(): Promise<void> {
  const response = await assist('dete');

  console.log(response);
}

main()
  .then(() => process.exit(0))
  .catch(console.error);
